---
title: "A Distributed Pipeline Formalization in Caelum"
date: 2026-09-26
categories: [formal-verification, model-checking, caelum, distributed-systems, nfs]
---

This article describes how I used Caelum to formalize a lock protocol and
verify that it prevents data corruption and deadlock.

The specification can be checked in the browser:
[NFS Shared Lock in the Caelum docs](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html).

## Context

A data pipeline runs across several machines and produces large volumes of
data, so transferring data between machines must be avoided. The machine that
**produces** a dataset is not the one that **validates** it, and validation may
write files next to the data it checks.

All machines therefore mount the same NFS export as a shared scratch space.
Before writing into a directory, a job **locks** it. Any job may read; writes
happen only while holding the lock.

Requirements:

- **No data corruption.** Two jobs never write to the same directory
  concurrently. If a defect causes two jobs to attempt it, one of them must
  **fail loudly** (wait or time out) instead of silently overwriting the other.
- **No deadlock.** If a job crashes while holding the lock, the next run of that
  job must still be able to proceed.

## How a lock becomes a consensus problem

A straightforward design evolves as follows:

1. A job creates a lock before writing and removes it afterwards.
2. If the holder crashes, the lock is never removed and the pipeline stops.
3. A common remedy is to break locks older than some threshold. However, a
   *slow* holder (swapping, blocked on I/O, paused VM) is indistinguishable
   from a dead one, so two jobs can end up holding the lock: the silent
   corruption the lock exists to prevent.
4. Preventing that requires heartbeats, leases, fencing tokens, and a service
   that issues the tokens; making that service fault tolerant requires several
   replicas that agree on its state.

At this point the design requires consensus. The underlying reason is that
**a remote observer cannot distinguish a crashed process from a slow one**,
which is the core of the
[FLP impossibility result](https://en.wikipedia.org/wiki/Consensus_%28computer_science%29#The_FLP_impossibility_result_for_asynchronous_deterministic_consensus).
Any design in which one machine must decide that a process on *another* machine
is dead leads to this problem.

The design presented here avoids it by **not coordinating at all**.

## Assumptions that remove the problem

Two properties of this pipeline make coordination unnecessary:

1. **Host affinity:** a given job always runs on the same host.
2. **Exact local failure detection:** a host can determine with certainty
   whether one of its own processes is dead, by comparing boot id, pid, and
   process start time.

Consequently, a lock left by a crashed run of a job was created on the host
where the job runs, and that host can verify the holder's death exactly and
recover the lock. A lock owned by another host is never judged remotely; the
process waits, and the owning host recovers the lock.

The question "is that remote process dead?" is never asked, so no coordination
is required. The only shared state is the lock on NFS, whose metadata records
the owner's machine (`/etc/machine-id`), boot id, pid, and start time.

## Formalization in Caelum

[Caelum](https://github.com/dhilst/caelum) is an LTL model checker: a
specification describes states, transitions, and properties, and Caelum checks
the properties against every reachable state and every interleaving.

The model has two hosts and three processes: `local` runs two (so they can race
to recover a crashed lock) and `remote` runs one. The host of each process is a
static fact:

```
type Host = enum { local, remote }
let host[p ∈ Proc] ∈ Host

init {
  host[0] = local ∧
  host[1] = local ∧
  host[2] = remote
}
```

**Notation.** A transition is one step of the system, written as a predicate
over two states: the state *before* the step and the state *after* it. An
unprimed name such as `st[p]` denotes the value **before** the step; the primed
name `st[p]'` denotes the value **after** it. For example,
`st[p] = waiting ∧ st[p]' = holding` means "p was waiting and is now holding".
Conjuncts over unprimed names form the *guard* (when the step is enabled);
conjuncts over primed names form the *effect* (what the step changes). `∧` is
conjunction and `∨` is disjunction. `unchanged(x, y)` abbreviates
`x' = x ∧ y' = y`; a variable not constrained by a transition may take any
value in the next state, so every variable the step must preserve is listed
explicitly.

The protocol is captured by the guard of `acquire`:

```
transition acquire(p ∈ Proc) {
  // p is waiting,
  st[p] = waiting ∧
  // the lock is free, or stale
  // and owned by p's host:
  (rec = none ∨
    (rec = stale ∧ owner = host[p])) ∧
  // p now holds it,
  st[p]' = holding ∧
  // the lock is live
  rec' = live ∧
  // and records p's host;
  owner' = host[p] ∧
  // everyone else is untouched
  unchanged(st except p, host)
}
```

That is: a process may take the lock if it is free, or if it is stale and
owned by the process's own host. A holder leaves the critical section in one of
two ways. Normally it releases the lock:

```
transition release(p ∈ Proc) {
  // p holds the lock,
  st[p] = holding ∧
  // finishes its work and exits,
  st[p]' = free ∧
  // removing the lock;
  rec' = none ∧
  // nothing else changes
  unchanged(st except p, owner, host)
}
```

Alternatively it crashes, leaving a stale lock behind:

```
transition crash(p ∈ Proc) {
  // p holds the lock,
  st[p] = holding ∧
  // dies,
  st[p]' = free ∧
  // leaving the lock behind, stale,
  rec' = stale ∧
  // still naming p's host
  unchanged(st except p, owner, host)
}
```

The required properties talk about whole runs of the system, over time, using
two temporal operators:

- `□ φ`, **always**: φ holds in every state, from now on. `□ (x ≠ 2)` means
  "x is never 2".
- `◇ φ`, **eventually**: φ holds in some state, now or later. `◇ (x = 2)` means
  "x will be 2 at some point".

Combined, `□ (a → ◇ b)` reads "whenever a holds, b eventually holds", the
general form of a liveness requirement. `∀ p ∈ Proc:` means "for every process
p", and `→` is implication.


```
// No data corruption:
// at most one holder.
property mutual_exclusion {
  □ (∀ p ∈ Proc: ∀ q ∈ Proc:
       (p ≠ q ∧ st[p] = holding) →
         st[q] ≠ holding)
}

// No deadlock: a crashed lock is
// eventually taken back by its host.
property crash_recoverable {
  □ (∀ h ∈ Host:
       (rec = stale ∧ owner = h) →
         ◇ (rec = live ∧ owner = h))
}

// Progress: every waiting process
// eventually gets the lock.
property work_progresses {
  □ (∀ p ∈ Proc:
       st[p] = waiting →
         ◇ (st[p] = holding))
}
```

All properties hold: **44 states, checked in about a second in the browser.**

Writing the model required stating every assumption explicitly: only the
owner's host decides whether the holder is dead (A0), acquiring the lock is
atomic (A1), processes terminate (A2) and eventually acquire the lock (A3), and
a crashed process is restarted (A4). If A4 does not hold, the lock remains
until an operator removes it; this is the cost of not coordinating.

## Result: a simpler implementation

None of the distributed machinery from step 4 is needed. The algorithm is:
take the lock atomically; if it is stale and owned by the local host, recover
it; otherwise wait.

This illustrates a central use of lightweight formal verification: not only
proving that complex code is correct, but showing that **the complex code is
unnecessary**. Once the assumptions that actually hold are written down (host
affinity, exact local failure detection, atomic creation), the design reduces
from a distributed-systems problem to careful file handling, and the model
checker confirms that the reduction is sound.

_In short: Small design + strong guarantees. In this case I could fit the implementation in ~200 lines that I know are deadlock and data-corruption free. And this is a solved problem now, I can implement it in any language I want._

## Lessons learned

The great value of lightweight formal verification is that it forces you to
think rigorously about the properties that must hold in your system, which in
turn forces you to think rigorously about what assumptions must be true for
those properties to follow, which in turn forces you to enumerate all your
assumptions. And once you enumerate them, you can find out, with a simple
Google search or a question to an LLM, whether they hold in your production
environment. For example, that `/etc/machine-id` may **not** be unique.

The full specification, with explanations and a Check button:
**[NFS Shared Lock — Caelum real-world examples](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html)**.

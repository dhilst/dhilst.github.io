---
title: "The Lock That Never Asks Anyone: Dodging Consensus with a Model Checker"
date: 2026-09-26
categories: [formal-verification, model-checking, caelum, distributed-systems, nfs]
---

(AI Generated)

This is the story of a lock. A boring lock. A lock so boring it doesn't talk to
anybody, doesn't elect a leader, doesn't heartbeat, doesn't read the clock, and
still can't corrupt your data or get stuck. Getting to "boring" took a model
checker, three assumptions, and a firm refusal to implement Raft on a Tuesday.

The spec is live, runs in your browser, and you can break it yourself:
[NFS Shared Lock in the Caelum docs](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html).

## The setup

I have a big pipeline running across several machines. It produces a *lot* of
data. Terabytes-don't-fit-in-your-mental-model a lot. Moving that data between
machines is the one thing I really want to avoid.

The twist: the machine that **produces** a dataset is not the one that
**validates** it, and validation may write files next to the data it checks.

So the plan: every machine mounts the same NFS export and uses it as a shared
scratch space. Data stays put, and everyone brings their compute to it.

Now two jobs could write into the same directory at the same time. That's the
kind of bug that doesn't crash. It just quietly produces garbage, which you then
validate, publish, and discover three weeks later during a meeting. I want the
opposite: if a bug makes two jobs collide, one of them should **fail loudly**
(wait, or time out) instead of silently overwriting the other.

So: a lock. Lock a directory, write into it, unlock. Anyone may read; writing
happens only under the lock. It's a convention, but I control the pipeline code,
so I can enforce and check it.

Easy, right? Let me show you how fast "easy" turns into a PhD thesis.

## How a lock becomes a consensus problem in four easy steps

**Step 1.** "I'll just put a lock file there." Great. Job takes lock, job writes,
job releases lock.

**Step 2.** "What if the job crashes while holding the lock?" The lock file stays
there forever. The next run of that job waits forever. The pipeline is now a
very expensive way to heat the server room.

**Step 3.** "OK, if the lock is old, someone else can break it." Old according to
whom? After how long? What if the holder is just *slow*: swapping, stuck on I/O,
paused by a VM migration, or working on an honestly large file? Now two jobs
believe they hold the lock. That's exactly the silent corruption we built the
lock to prevent. Congratulations, the cure is the disease.

**Step 4.** "Fine, the holder heartbeats, and we add fencing tokens, and a
monotonic counter, and the storage checks the token, and someone has to hand
out the tokens, and that someone can crash, so we need several of them, and
they need to agree..."

And there it is. You are now implementing consensus. Paxos is on the whiteboard.
Someone says "we could just use etcd" and nobody laughs.

This isn't bad luck; it's a theorem-shaped wall. In an asynchronous system,
**a remote observer cannot tell a crashed process from a slow one.** That's the
heart of the FLP impossibility result, and it's why every "just break stale
locks after a timeout" scheme eventually lets two writers in. Any time you need
a *remote* node to decide "that other node is dead", you're buying a failure
detector, and good failure detectors are built out of consensus.

The lesson: **the moment workers need to coordinate, you're one bad week away
from a consensus problem.** So the trick is not to coordinate better. It's to
not coordinate at all.

## The assumptions that make the problem disappear

Here's what's true about *my* pipeline, which is not true about distributed
systems in general:

1. **The same job always runs on the same host.** Host affinity is fixed.
2. **A host can tell, for certain, whether one of its own processes is dead.**
   Not "probably dead". *Dead.* Check the pid; if it exists, check its start
   time; also check the boot id so a reboot can't fool you with a recycled pid.
   This is a local question with a local, exact answer.

Put those together, and look at who ever needs to ask "is the holder dead?":

- If the lock belongs to a crashed run of *my* job, the holder was on *my* host
  (assumption 1). I can check it exactly (assumption 2). Recover.
- If the lock belongs to a *different host*, I can't check it... but I also never
  need to. I just wait. That lock will be recovered by its own host, the only
  one qualified to decide.

The impossible question, "is that remote process dead?", is never asked. Not
answered cleverly: *never asked*. No timeouts, no heartbeats, no clocks, no
tokens, no leader, no quorum. Hosts don't talk to each other. The only shared
state is the lock record on NFS.

That's the whole design. It fits on a napkin. But napkins are famously bad at
finding race conditions, so let's not trust the napkin.

## Checking the napkin with Caelum

[Caelum](https://github.com/dhilst/caelum) is an LTL model checker I built. You
write down states, transitions, and properties; it explores every reachable
state and every interleaving, and either proves the properties or hands you a
counterexample trace.

The model is tiny on purpose:

- **2 hosts, 3 process slots.** Host 0 has two slots, so two runs on the same
  host can race to recover a crashed lock. Host 1 has one slot and plays "the
  other host".
- Each process is `free`, `waiting`, or `holding`.
- The lock record is `none`, `live`, or `stale` (the holder crashed), plus the
  `owner` host written in the record.

The heart of the protocol is a single guard:

```
// acquire → ok (atomic CAS, A1): take a free lock (any host), or recover a
// stale one — only on the owner's host (A0).
transition acquire(p ∈ Proc) {
  st[p] = waiting ∧
  (rec = none ∨ (rec = stale ∧ owner = p / 2)) ∧
  st[p]' = holding ∧
  rec' = live ∧
  owner' = p / 2 ∧
  unchanged(st except p)
}
```

Read the guard out loud: *you may take the lock if nobody has it, or if it's
stale and it's yours to judge.* `owner = p / 2` is the whole "never ask a
remote host" idea, in thirteen characters.

A crash is one transition:

```
// The holder crashes: its record is left behind, stale.
transition crash(p ∈ Proc) {
  st[p] = holding ∧
  st[p]' = free ∧
  rec' = stale ∧
  unchanged(st except p, owner)
}
```

And here is what we demand:

```
// S1. At most one process holds the lock.
property mutual_exclusion {
  □ (∀ p ∈ Proc: ∀ q ∈ Proc: (p ≠ q ∧ st[p] = holding) → st[q] ≠ holding)
}

// L1. A crash while holding the lock doesn't deadlock: the crash host
// eventually takes the lock back.
property crash_recoverable {
  □ (∀ h ∈ Host: (rec = stale ∧ owner = h) → ◇ (rec = live ∧ owner = h))
}

// L2. Every waiting process eventually gets the lock.
property work_progresses {
  □ (∀ p ∈ Proc: st[p] = waiting → ◇ (st[p] = holding))
}
```

Safety ("nothing bad happens"): no two holders, ever, across all hosts. Liveness
("something good eventually happens"): a crash never wedges the pipeline, and
nobody waits forever.

All of it passes. **44 states, checked in about 150 ms, in your browser.** Go
press the button: [the live spec](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html).

## The part where the model checker earns its keep

The interesting bit isn't the green checkmarks. It's everything the model forced
me to say out loud:

- **A0: same-host liveness check.** Only the recorded host may decide that the
  holder is dead. I originally had this as a *property*, then realized it was
  circular: it's an *assumption about the world*, encoded in the guard. The
  model made the difference between "what I assume" and "what I prove" painfully
  explicit.
- **A1: taking the lock is atomic.** Checking the record and writing it must be
  one step. If they aren't, two processes on the same host can both see "stale"
  and both walk in. The model shows that instantly.
- **A2: processes finish** (release, or crash). **A3: a waiting process
  eventually succeeds.** These are the `fairness` block. Weaken A3 and
  `work_progresses` fails, with a trace showing a process losing every race
  forever.
- **A4: a crashed host comes back.** This one's the uncomfortable one: if the
  crash host *never* returns, its stale lock is stuck forever. And that's not a
  bug in the protocol, it's the price of not coordinating. Nobody else can tell
  "dead host" from "slow host", which is FLP waving at us again. That case gets
  a human with `rm -rf`, and I'm fine with that.

For fun, I also modelled the "tempting" version, where a remote host may
recover a lock it *thinks* is dead (say, "held for too long"). Since it can't
tell live from stale, the guess is sometimes wrong. Caelum found the bug in
four steps:

```
pid 0 (host 0) acquires the lock
pid 2 (host 1) decides pid 0 "looks dead" and takes over   ← pid 0 is alive
→ both hold the lock: silent data corruption
```

That's Step 3 of the consensus spiral, caught by a machine in milliseconds, not
by me at 2 a.m.

## And then reality showed up: no flock for you

One technical wrinkle. My scratch space is a **re-exported** NFS mount, and the
kernel refuses file locks on re-exports. From the
[kernel docs](https://docs.kernel.org/filesystems/nfs/reexport.html):
*"Clients are not allowed to get file locks or delegations from a reexport
server, any attempts will fail with operation not supported."* So
`flock`/`fcntl` return `EOPNOTSUPP`.

No problem. The model never said "use flock"; it said "A1: taking the lock is
atomic". NFSv4 gives us server-side atomic operations: `mkdir` fails if the name
exists, and `rename` is atomic. The lock becomes a directory, built from those.
The spec didn't change at all. I just needed a different way to make A1 true.

That's the point of separating assumptions from mechanisms: when the platform
takes a tool away, you know exactly which property you need to rebuild, and
nothing else moves.

## The payoff: the code got *smaller*

Here's what I did **not** have to write:

- a heartbeat thread
- lease timeouts and the eternal debate about their value
- clock-skew handling
- fencing tokens and a way to check them on writes
- a coordinator, and then three coordinators, and then a leader election
- a test suite for all of the above, which would still miss the one
  interleaving that matters

What I wrote instead is an acquire loop: try to take the lock atomically; if
it's stale *and mine to judge*, recover it; otherwise wait. A release. A pid +
start time + boot id check. That's the whole thing.

This is what lightweight formal verification is actually good for. Not
(only) for proving that complicated code is correct, but for discovering that
you **don't need the complicated code**. Once you write down which assumptions
really hold (same host, exact local death check, atomic create), the
design collapses from "distributed systems problem" to "careful file handling".
And the model checker tells you that the collapse is sound, instead of your gut.

_In short: Small design + strong garantees. In this case I could fit the implementation in ~200 lines that I know are deadlock and data-corruption free. And this is a solved problem now, I can implement it in any language I want._

Formal methods have a reputation for making things heavier. Here it made the
code lighter. Forty-four states, one guard, zero consensus.

The full spec, with the explanation and a Check button, is here:
**[NFS Shared Lock — Caelum real-world examples](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html)**.

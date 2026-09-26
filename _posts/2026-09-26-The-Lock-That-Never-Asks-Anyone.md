---
title: "The Lock That Never Asks Anyone: Dodging Consensus with a Model Checker"
date: 2026-09-26
categories: [formal-verification, model-checking, caelum, distributed-systems, nfs]
---

This is the story of a boring lock. It doesn't talk to anybody, doesn't elect a
leader, doesn't heartbeat, doesn't read the clock, and still can't corrupt your
data or get stuck. Getting to "boring" took a model checker, a few assumptions,
and a firm refusal to implement Raft on a Tuesday.

The spec runs in your browser:
[NFS Shared Lock in the Caelum docs](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html).

## The setup

A big pipeline runs across several machines and produces a *lot* of data, so
moving data between machines is out. The machine that **produces** a dataset
isn't the one that **validates** it, and validation may write files next to the
data it checks.

So every machine mounts the same NFS export as a shared scratch space. Before
writing into a directory, a job **locks** it. Anyone may read; writing happens
only under the lock.

Two rules:

- **No data corruption.** Two jobs never write the same directory at once. If a
  bug makes them try, one should **fail loudly** (wait or time out), not
  silently overwrite the other.
- **No deadlock.** If a job crashes while holding the lock, the next run must
  still be able to proceed.

## How a lock turns into a consensus problem

1. "I'll put a lock there." Fine.
2. "What if the holder crashes?" The lock stays forever and the pipeline heats
   the server room.
3. "Then break locks that are *old*." Old according to whom? A *slow* holder
   (swapping, stuck on I/O, paused VM) looks exactly like a dead one. Now two
   jobs hold the lock: the silent corruption we built the lock to prevent.
4. "Then heartbeats, leases, fencing tokens, and someone to hand out tokens,
   and a few of those so they can't crash, and they need to agree…"

Congratulations, you are implementing consensus. The wall is real: **a remote
observer can't tell a crashed process from a slow one** (that's the heart of
FLP). Any design where one machine must decide "that *other* machine's process
is dead" ends up here.

So the trick isn't to coordinate better. It's to **not coordinate at all.**

## The assumptions that make the problem disappear

Two facts about *my* pipeline:

1. **The same job always runs on the same host.**
2. **A host can tell, for certain, whether one of its own processes is dead**:
   compare boot id, pid, and process start time.

So a lock left by a crashed run of *my* job was created on *my* host, and I
can check it exactly: recover. A lock owned by *another* host is not mine to
judge: wait. Its own host will recover it.

The impossible question, "is that remote process dead?", is never asked. No
timeouts, no heartbeats, no clocks, no leader. The only shared state is the lock
on NFS, whose metadata records the owner's machine (`/etc/machine-id`), boot id,
pid, and start time.

## Checking it with Caelum

[Caelum](https://github.com/dhilst/caelum) is a model checker I built: you
describe states, transitions, and properties, and it checks every reachable
state and every interleaving.

The model has two hosts and three processes: `local` runs two (so they can race
to recover a crashed lock), `remote` runs one. Where each process runs is a
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

The whole protocol is one guard:

```
transition acquire(p ∈ Proc) {
  st[p] = waiting ∧
  (rec = none ∨ (rec = stale ∧ owner = host[p])) ∧
  st[p]' = holding ∧
  rec' = live ∧
  owner' = host[p] ∧
  unchanged(st except p, host)
}
```

*Take the lock if nobody has it, or if it's stale and it belongs to the host I
run on.* A `crash` transition leaves the lock behind as `stale`.

And what we demand:

```
// No data corruption: at most one holder.
property mutual_exclusion {
  □ (∀ p ∈ Proc: ∀ q ∈ Proc: (p ≠ q ∧ st[p] = holding) → st[q] ≠ holding)
}

// No deadlock: a crashed lock is eventually taken back by its host.
property crash_recoverable {
  □ (∀ h ∈ Host: (rec = stale ∧ owner = h) → ◇ (rec = live ∧ owner = h))
}

// Progress: every waiting process eventually gets the lock.
property work_progresses {
  □ (∀ p ∈ Proc: st[p] = waiting → ◇ (st[p] = holding))
}
```

All pass: **44 states, checked in about a second, in your browser.**

The green checkmarks are nice, but the real value was being forced to write the
assumptions down: the owner's host is the only judge (A0), taking the lock is
atomic (A1), processes finish (A2) and eventually succeed (A3), and a crashed
host comes back (A4). If A4 fails, the lock stays stuck until a human removes
it. That's the price of not coordinating, and I'm fine with it.

## No flock for you

The scratch space is a **re-exported** NFS mount, and the kernel refuses file
locks there ([kernel docs](https://docs.kernel.org/filesystems/nfs/reexport.html)):
`flock`/`fcntl` return `EOPNOTSUPP`. No problem: the model never said "use
flock", it said "taking the lock is atomic". NFSv4's `mkdir` (fails if the
directory exists) and `rename` (atomic) give us that. The spec didn't change.

## The payoff: the code got smaller

No heartbeat thread, no lease timeouts, no clock skew handling, no fencing
tokens, no leader election. Just: try to take the lock atomically; if it's
stale *and mine to judge*, recover it; otherwise wait.

This is what lightweight formal verification is actually good for. Not
(only) for proving that complicated code is correct, but for discovering that
you **don't need the complicated code**. Once you write down which assumptions
really hold (same host, exact local death check, atomic create), the
design collapses from "distributed systems problem" to "careful file handling".
And the model checker tells you that the collapse is sound, instead of your gut.

_In short: Small design + strong guarantees. In this case I could fit the implementation in ~200 lines that I know are deadlock and data-corruption free. And this is a solved problem now, I can implement it in any language I want._

## Plot twist: the obviously true assumption

There's one more assumption hiding in the model: **hosts have distinct
identities.** In the spec, `local ≠ remote` by construction. In production,
"host identity" means `/etc/machine-id`, and it is *obviously* unique per
machine. That's what it's for.

Except when it isn't. `/etc/machine-id` is generated once, on a machine's first
boot, and then it's just a file on disk. **Clone a VM, or create VMs from a
template or golden image, and every copy inherits the same machine-id**, unless
the image was prepared for it (the file emptied so each clone generates its
own on first boot). Cloud images usually get this right. The template someone
made by hand three years ago may not.

And if two hosts share a machine-id, everything above falls apart. Host A sees a
lock held by host B, reads "same machine-id, different boot id", and concludes
"that's mine, from before a reboot, so it's dead". It isn't. B is alive and
writing. A takes the lock, and now two jobs write the same directory: silent
data corruption, in our beautiful, model-checked, 44-state perfect system. The
proof is still correct. It's just about a world where machine-ids are unique,
and we don't live there by default.

So the machine-id uniqueness is now an explicit assumption (A5), and checking it
on every host is part of deploying the pipeline.

## Lessons learned

The great value of lightweight formal verification is that it forces you to
think rigorously about the properties that must hold in your system, which in
turn forces you to think rigorously about what assumptions must be true for
those properties to follow, which in turn forces you to enumerate all your
assumptions. And once you enumerate them, you can find out, with a simple
Google search or a question to an LLM, whether they hold in your production
environment. For example, that `/etc/machine-id` may **not** be unique.

The full spec, with the explanation and a Check button:
**[NFS Shared Lock — Caelum real-world examples](https://dhilst.github.io/caelum/real-world/nfs-shared-lock.html)**.

---
title: "Specifying Software with Caelum: Why Formal Specs Matter Even When Lives Aren't at Stake"
date: 2026-05-06
categories: [rust, formal-verification, model-checking, ltl, specifications]
---

(AI Generated)

Formal specification has a reputation problem. People hear "model checking" and
think avionics, nuclear reactors, safety-critical systems with million-dollar
budgets. The implicit message: if nobody dies when your code breaks, you don't
need it.

That's wrong. Formal specifications add value to any project where you need to
reason about behavior — which is most projects.

[Caelum](https://github.com/dhilst/caelum) is an LTL model checker I built to
make this practical. You describe your system's states, transitions, and
properties in a `.lum` file, and Caelum exhaustively checks whether those
properties hold across all reachable states. When they don't, it gives you a
concrete counterexample — a trace showing exactly how the system reaches the
bad state.

## What You Can Express

The specification language is small but expressive. You declare finite-domain
variables, define initial states, write transitions that describe how the system
evolves, and state properties using Linear Temporal Logic (LTL).

Here's a crossroad traffic light controller:

```
type Color = enum { red, green, yellow }

let traf1 ∈ Color
let traf2 ∈ Color
let timer ∈ 0..5

init {
  traf1 = green ∧ traf2 = red ∧ timer = 5
}

// When time is remaining, decrement the timer
transition tick {
  timer > 0 ∧ timer' = timer - 1
  ∧ traf1' = traf1 ∧ traf2' = traf2
}

// When traf1 is green and timer expires, traf1 goes yellow
transition traf1_to_yellow {
  traf1 = green ∧ timer = 0
  ∧ traf1' = yellow ∧ timer' = 2 ∧ traf2' = traf2
}

// When traf1 finishes yellow, control passes to traf2
transition swap_to_traf2 {
  traf1 = yellow ∧ timer = 0
  ∧ traf1' = red ∧ traf2' = green ∧ timer' = 5
}

// When traf2 is green and timer expires, traf2 goes yellow
transition traf2_to_yellow {
  traf2 = green ∧ timer = 0
  ∧ traf2' = yellow ∧ timer' = 2 ∧ traf1' = traf1
}

// When traf2 finishes yellow, control passes back to traf1
transition swap_to_traf1 {
  traf2 = yellow ∧ timer = 0
  ∧ traf2' = red ∧ traf1' = green ∧ timer' = 5
}
```

Now the interesting part — the properties:

```
// The two lights never show green simultaneously
property mutual_exclusion {
  □ ¬(traf1 = green ∧ traf2 = green)
}

// traf1 always eventually gets a green turn
property traf1_eventually_green {
  □ ◇ (traf1 = green)
}

// traf2 always eventually gets a green turn
property traf2_eventually_green {
  □ ◇ (traf2 = green)
}

// When traf1 is green, traf2 will eventually get green too (fairness)
property green_follows_red {
  □ (traf1 = green → ◇ (traf2 = green))
}
```

Try expressing "mutual exclusion holds in every reachable state" or "both
lights always eventually get a green turn" in a unit test. You can't — not
without enumerating every possible interleaving yourself. But in Caelum, these
are one-liners, and the model checker exhaustively verifies them.

That's the first reason formal specs matter beyond safety-critical systems: **you
can express properties that would be hard to express unambiguously in prose or
tests, and the checker verifies consistency across all reachable states
automatically.**

## Properties as Documentation That Can't Lie

A specification is a contract written in a language precise enough to be
machine-checked. Compare:

- **Comment**: "The two lights should never both be green"
- **Test**: `assert!(!(traf1 == green && traf2 == green))` — checks one state
- **Spec**: `□ ¬(traf1 = green ∧ traf2 = green)` — checked across all reachable states

Comments rot. Tests check specific scenarios. Specifications cover the entire
state space. When you change a transition and accidentally break mutual
exclusion, the model checker catches it — and shows you the exact sequence of
states that leads to the violation.

This matters for any system with concurrent state, protocol logic, resource
management, or configuration state machines. You don't need to be building
flight controllers.

## The Model Checker as a Harness

Think of Caelum the way you think of a test harness — but instead of running
specific scenarios, it explores every reachable state. You write the spec, and
the checker does the exhaustive work.

The workflow is simple:

```sh
caelum check crossroad.lum
```

If everything holds, you get confirmation. If something fails, you get a
counterexample trace:

```
property mutual_exclusion FAILED
  State 0: traf1=green, traf2=red, timer=5
  State 1: traf1=green, traf2=red, timer=4
  ...
  State N: traf1=green, traf2=green, timer=5  ← violation
```

This is the same feedback loop as test-driven development: write the property,
run the checker, fix the design. The difference is that the checker is
exhaustive. It's not sampling — it's proving.

Caelum fits naturally into CI too. Run `caelum check --format json` and you get
machine-readable output suitable for a pipeline gate. Your specification becomes
a living, verified document that blocks merges when invariants break.

## You Don't Need to Learn the Syntax

Here's something people don't realize: you don't need to memorize LTL operators
or the `.lum` syntax to benefit from this. Coding agents — Claude Code, Cursor,
Copilot — can write specifications for you. You describe the system in natural
language, and the agent produces the `.lum` file.

Tell the agent: "I have two traffic lights sharing a timer, they alternate
between green and red with a yellow transition, and they should never both be
green at the same time." That's enough. The agent knows what `□` and `◇` mean,
it understands the domain, and it can infer most properties directly from
context.

The pattern is:

1. **Describe your system** to the coding agent in plain language
2. **The agent writes the spec** — variables, transitions, properties
3. **Run the checker** — Caelum verifies or produces counterexamples
4. **Iterate** — fix the spec or the design based on counterexamples

Most of the interesting properties — safety invariants, liveness guarantees,
fairness constraints — follow naturally from the domain description. The agent
doesn't need to guess; "mutual exclusion" between two resources implies
`□ ¬(both active)`, "every request gets a response" implies `□ (request → ◇
response)`. These patterns are standard and agents handle them well.

This lowers the barrier dramatically. You don't need a background in formal
methods. You need to be able to describe what your system does and what
shouldn't happen — things you already know.

## The Punchline: Stochastic Code Needs Deterministic Checks

Here's the thing nobody talks about enough. We're increasingly generating code
with LLMs. These models are stochastic — they produce statistically likely
outputs, not provably correct ones. They're impressive, but they carry an
inherent unsoundness: there is no guarantee that the generated code satisfies any
particular property. The model might produce correct code 99% of the time and
subtly wrong code 1% of the time, and you can't tell which is which by looking
at it.

Formal specifications are the antidote. When your code is generated by a
stochastic process, the specification becomes the deterministic ground truth.
The model checker doesn't care whether the transitions were written by a human
or hallucinated by an LLM — it checks every reachable state regardless.

The irony is beautiful: the same AI that introduces unsoundness into your
codebase can also help you write the specifications that catch it. The agent
writes both the code and the spec, and the model checker arbitrates. The
checker is not stochastic. It's not probabilistic. It exhaustively enumerates
states and evaluates properties. It's a deterministic harness for a stochastic
world.

As coding agents take over more of the implementation work, formal
specifications become more important, not less. They're the firewall between
"the LLM thinks this is correct" and "this is provably correct." And with
agents lowering the barrier to writing specs, there's no excuse not to have one.

## The Spec as the Single Source of Truth

Even if your implementation doesn't perfectly follow the specification — and let's
be honest, implementations drift — at least you have an unambiguous source of
truth for what the system *should* do. Not a diagram that three people interpret
three ways. Not a stream of prose buried in a Confluence page that nobody reads
after sprint two. **Logic.**

A `.lum` file is pure text. It uses well-known logical symbols — conjunction,
disjunction, implication, temporal operators — that have had fixed semantics for
decades. There is no ambiguity in `□ ¬(traf1 = green ∧ traf2 = green)`. Every
reader, human or machine, extracts the same meaning.

This matters enormously for AI-assisted development. Language models consume text.
They can read your specification as trivially as they read your source code. But
unlike source code — which describes *what the program does* — the specification
describes *what the program should do*. And because it uses formal logic with
known operators and known semantics, the agent doesn't have to guess what you
meant. There's nothing to interpret, nothing to infer from context, no ambiguity
to resolve. The spec says what it says, with mathematical precision.

When you hand a coding agent a formal specification alongside your codebase, you
give it something no amount of comments or README prose can provide: a
machine-readable, unambiguous, logically consistent contract. The agent can
generate code that conforms to it, check its own output against it, and flag
discrepancies — all without the lossy translation step that natural language
requires.

Diagrams can't do this. Prose can't do this. Only logic can.

## Getting Started

```sh
git clone https://github.com/dhilst/caelum
cd caelum
cargo build --release
./target/release/caelum check examples/crossroad_traffic_light.lum
```

Start with a simple state machine from your project. Describe it to your coding
agent, ask it to write a `.lum` spec, and run the checker. You'll be surprised
how many implicit assumptions become explicit — and how many of them turn out to
be wrong.

Source: [github.com/dhilst/caelum](https://github.com/dhilst/caelum)

Tutorial: [dhilst.github.io/caelum/tutorial.html](https://dhilst.github.io/caelum/tutorial.html)

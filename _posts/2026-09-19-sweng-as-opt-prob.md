--- 
layout: post
title: "How I see Software Development in the AI era"
tags: [software, software-engineering]
---
Most software is not proven correct before release. It is tested, judged good
enough and shipped. When it fails in production, we fix it, add a test and ship
again.

This post proposes a model of that process: software development as nested
optimization. Inside, an AI agent refines code against failures and tests.
Outside, a developer refines the agent’s understanding, tests and fixes against
the software’s intent.

## The model

Software has an intent: what users, developers and the business expect it to
do. Intent is larger than any written specification. Some of it becomes visible
only when the software violates it.

Let:

- Iᵥ be the software intent of version v;
- Cₜ be the code at time t;
- Tₜ be the test suite at time t;
- e be an observed error.

When an error reveals that the code violates its intent, development performs
two operations:

		Tₜ₊₁ = Tₜ ∪ {test(e)}

		Cₜ₊₁ = fix(Cₜ, e)

The test converts an observed error into an executable constraint. The code is
changed until it satisfies that constraint.

		Iᵥ → Cₜ → e → Tₜ₊₁ → Cₜ₊₁

Over time, the test suite becomes executable knowledge about the boundaries of
the software’s intent.

## Tests as predictors

For code C and intent Iᵥ, define:

		Eᵥ(C) ∈ {🟢, 🔴}

where 🔴 means that the code violates Iᵥ in production and 🟢 means that it
satisfies Iᵥ, and:

		T(C) ∈ {🟢, 🔴}

where 🔴 means that the test suite is red and 🟢 means that it is green.

The test suite is a predictor of production failure. It can be wrong in two
ways. A false positive occurs when the suite is red but the code would succeed
in production. A false negative occurs when the suite is green but the code
fails. The second case means that the suite approved code that violated its
intent.

## Soundness and completeness

A test suite T is sound _(correct)_ when every test failure represents a real
production failure:

		T(C) = 🔴 ⇒ Eᵥ(C) = 🔴

It is complete when every production failure is detected by the tests:

		Eᵥ(C) = 🔴 ⇒ T(C) = 🔴

A suite that is both sound and complete satisfies:

		T(C) = 🔴 ⇔ Eᵥ(C) = 🔴

In practice, we cannot enumerate every program state or completely formalize
intent _(in fact we can, it is called formal verification)_. Production instead
supplies counterexamples to the suite’s predictions.

Suppose the suite is green but production fails:

		T(C) = 🟢 ∧ Eᵥ(C) = 🔴

We reproduce the error with a test, confirm that the test fails, fix the code
and confirm that it passes. A test that passes before the fix does not capture
the error.

We can describe the remaining gap as the probability of an undetected
production failure:

		d(Tₜ, Eᵥ) = P(Eᵥ(Cₜ) = 🔴 ∧ Tₜ(Cₜ) = 🟢)

_i.e. “The distance between the test suite at time t and production errors
equals the probability that the code fails in production while the test suite
remains green.”_

For a fixed version v, repeated refinement may drive this distance toward zero:

		d(Tₜ, Eᵥ) → 0

### Soundness and completeness as functions

Let T be a test suite.

Define:

		soundness(T) ∈ [0, 1]

where soundness(T) = 1 means that every 🟢 result is correct, while
soundness(T) = 0 means that a 🟢 result provides no evidence of correctness.

Similarly:

		completeness(T) ∈ [0, 1]

where completeness(T) = 1 means that every required behavior is tested, while
completeness(T) = 0 means that none of the required behavior is tested.

A useful test suite must maximize both properties. Completeness asks whether
the suite covers the intended behavior. Soundness asks whether passing the
suite actually implies correctness.

## The moving target

The problem is that v does not remain fixed. Sales requests new features,
markets change, users develop new expectations and dependencies change the
constraints under which the software operates. These pressures produce a new
intent before development fully converges on the previous one. Will call all
these pressures "the update pressure" and denote it by U; so we have:

		Iᵥ₊₁ = U(Iᵥ)

At time t, the active version is vₜ, so the distance being minimized is:

		dₜ = d(Tₜ, Eᵥₜ)

Software may converge toward the intent of a particular version, but the
sequence of versions does not necessarily converge toward a final intent, (it
frequently doesn't). The optimization target moves whenever v changes.

This is why software is never finished. Each version defines a target that
development can approach, but commercial, technical and social pressures
replace it with another target.

## Fast and slow test-suites as predictors

Slow end-to-end and integration tests are close to production but expensive.
Fast unit and lightweight integration tests are cheaper but observe smaller
representations of the system.

Let F(C) be the fast-suite result and S(C) the slow-suite result. We want:

		F(C) = 🟢 ⇒ S(C) = 🟢

_"If fast test suite is green, then slow test suite is green too"_

Equivalently _(by contrapositive)_:

		S(C) = 🔴 ⇒ F(C) = 🔴

Whenever the slow suite finds a defect missed by the fast suite, we create a
fast test that captures the same underlying problem.

The fast test does not need to reproduce the full slow scenario. If a browser
test discovers that submitting a form twice creates duplicate orders, a fast
test may call the handler twice and verify idempotency. It captures the same
defect at lower cost.

## The inner loop *(AI)*

Running the slow suite for every open pull request would make it a throughput
bottleneck. If pull requests arrive faster than the pipeline can process them
individually, they accumulate indefinitely.

Instead, the agent tests a batch of N pull requests together. Let:

		Bₖ = {b₁, b₂, …, bₙ}

be the candidate branches in iteration k. At the beginning of each iteration,
the agent recreates a temporary integration branch:

		Aₖ = merge(Bₖ)

The slow suite Sₖ runs once against Aₖ rather than once for every candidate
branch. The loop is:

1. Select the candidate branches.
2. Recreate the temporary branch by merging them.
3. Run Sₖ against the temporary branch.
4. Investigate a failure missed by the fast suites.
5. Map the failure to the branch where its test and fix belong.
6. If no branch owns the problem, create one.
7. Reproduce the failure with a fast test on that branch.
8. Confirm that the test fails before the fix.
9. Fix the code.
10. Confirm that the fast suite passes.
11. Recreate the temporary branch and repeat.

The mapping step is necessary because Sₖ observes the composition of all
candidate changes. A failure may belong to one pull request, result from an
interaction between several pull requests, or reveal an independent defect.

The process begins outside the test system. When a runtime error escapes both
suites and is reported or captured by an observability system, the agent first
reproduces it in the slow suite. Each reproduced error extends the set of
runtime behavior covered by Sₖ.

Here, completeness is measured relative to behavior observable at runtime. As
runtime errors are converted into slow tests:

		completeness(Sₖ) → 1

Failures found by Sₖ are then transferred into the fast suite Fₖ on the branch
that owns them. Consequently:

		completeness(Fₖ) → completeness(Sₖ)

_"The completeness of the fast-suite goes to the completeness of the slow suite..."_.

The slow suite learns from runtime, while the fast suite learns from the slow
suite. Therefore:

		completeness(Fₖ) → 1

_" ... therefore the completeness of the fast-suite goes to 1."

Batching allows a single slow-pipeline execution to evaluate N pull requests.
The temporary branch is disposable; the knowledge extracted from it persists in
the individual branches and their fast tests.

The AI therefore drives completeness. It repeatedly converts behavior observed
at one level into a test at the level below it:

		runtime → slow suite → fast suite

## The outer loop *(Human)*

The developer operates the outer optimization loop. The developer does not need
to perform every edit, but must understand the problem the AI encountered and
how its solution addresses it. With that understanding, the developer can
accept the fix or redirect the AI.

The review loop is:

1. Receive a pull request.
2. Understand the problem and the proposed solution. **(The cognitive
   bottleneck)**
3. Accept the fix or ask the AI to take a different approach.

The inner loop can mechanically increase completeness by converting observed
failures into tests. It cannot determine from test results alone whether those
tests and fixes correctly represent software intent. That is the purpose of the
outer loop.

The developer reviews two relationships:

1. Does the test represent the actual requirement?
2. Does the fix satisfy that requirement rather than merely make the test pass?

This review drives soundness. A test can increase completeness while encoding
the wrong behavior. A fix can also produce 🟢 without solving the intended
problem. The outer loop attempts to prevent these false greens:

		soundness(Tₜ) ↛ 0

_"Developer prevents soundness decay"_

where Tₜ represents the test system produced by the development process.

In practice, developers cannot build understanding as quickly as AI can
generate changes. Human attention is therefore the bottleneck. We review with
the attention available and then ship, allowing some incorrect tests and fixes
to pass through the outer loop.

The complete model is a loop that optimizes another loop. AI drives the inner
loop toward completeness by transferring failures into progressively faster
tests. The developer drives the outer loop toward soundness by keeping those
tests and fixes aligned with software intent.

## Conclusion

Software development is a nested optimization loop:

AI minimized the distance between source code and intented behavior and also
maximize the completeness of the test suite. While human prevents the soundness
of the test from dropping.

The inner loop expands the test system until observed failures become
reproducible and fixed. The outer loop verifies that passing this system still
provides evidence that the software is correct.

Completeness can be increased mechanically: observe a failure, reproduce it
with a test, and add that test to the suite. Soundness requires understanding
whether the test and fix represent the intended behavior. As AI increases the
speed of the inner loop, human attention becomes the limiting resource in the
outer loop.


Let Eₜ denote the errors, Cₜ denote the and Tₜ denote the test-suite and |X|
denote X size or quantity at time t.

### Conjecture 1: Test-suite quality hypothesis

		|Eₜ| → 0
as

		completeness(Tₜ) → 1 ∧ soundness(Tₜ) → 1

_"i.e. we expect the number of runtime failures to drop as the quality of tests improve."_

### Conjecture 2: AI test-suite decay

For a codebase & test suite evolved without human supervision:

		|Cₜ| → ∞ ∧ completeness(Tₜ) → 1 ∧ soundness(Tₜ) → 0

as:

		t → ∞

The AI continually generates code and converts observed failures into tests,
driving completeness. Without human interpretation of software intent, those
tests increasingly encode the AI’s previous assumptions and solutions, driving
soundness toward zero.

The suite eventually reproduces every observed failure, but passing it provides
progressively less evidence that the software is correct. 


Finally, if second conjecture is true you may observe:

	|Cₜ| → ∞ ∧ |Eₜ| → ∞ ∧ soundness(Tₜ) → 0

as

	t → ∞

_"i.e. codebases and runtime errors going to infinite while soundness goes to 0 as times goes to infinite"_

Do you?

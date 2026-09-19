---
layout: post
title: "How I See Software Development in the AI Era"
tags: [software, software-engineering]
---

Most software is not proven correct before release. It is tested, judged good
enough, and shipped. When it fails in production, we fix it, add a test, and
ship again.

This post models that process as nested optimization. Inside, an AI agent
converts failures into tests and fixes. Outside, a developer keeps those tests
and fixes aligned with software intent.

## The model

Software has an intent: what users, developers, and the business expect it to
do. Intent is larger than any written specification. Some of it becomes visible
only when the software violates it.

Let:

* Iᵥ be the software intent of version v;
* Cₜ be the code at time t;
* Tₜ be the test suite at time t;
* e be an observed error.

When an error reveals that the code violates its intent, development performs
two operations:

``` Tₜ₊₁ = Tₜ ∪ {test(e)} Cₜ₊₁ = fix(Cₜ, e) ```

*“Add a test that reproduces the error, then change the code to fix it.”*

The test converts an observed error into an executable constraint. Over time,
the suite becomes executable knowledge about the boundaries of software intent:

``` Iᵥ → Cₜ → e → Tₜ₊₁ → Cₜ₊₁ ```

*“Intent produces code; incorrect code produces an error; the error produces a
test and a fix.”*

## Tests as predictors

For code C and intent Iᵥ, define:

``` Eᵥ(C) ∈ {🟢, 🔴} ```

*“The code either satisfies the intent or fails in production.”*

Also define:

``` T(C) ∈ {🟢, 🔴} ```

*“The test suite either passes or fails the code.”*

The suite predicts production behavior. It produces a false red when it rejects
code that would behave correctly, and a false green when it accepts code that
fails in production:

``` T(C) = 🟢 ∧ Eᵥ(C) = 🔴 ```

*“The test suite passes the code, but the code fails in production.”*

We assume that failing in production is not part of the software intent.

## Soundness and completeness

Let T be a test suite. Its quality has two dimensions:

``` completeness(T) ∈ [0, 1] ```

*“The completeness of T is a value between zero and one.”*

Completeness measures how much observable intended behavior is covered by T. A
value of 1 means that every relevant observable behavior is tested; a value of
0 means that none is tested.

``` soundness(T) ∈ [0, 1] ```

*“The soundness of T is a value between zero and one.”*

Soundness measures how reliably passing T implies correct behavior. A value of
1 means that every 🟢 result is correct; a value of 0 means that 🟢 provides no
evidence of correctness.

Intent Iᵥ is implicit in both functions. More explicitly, they could be written
as `completeness(T, Iᵥ)` and `soundness(T, Iᵥ)`.

A suite can be complete but unsound: it may cover every requirement while
encoding some of them incorrectly. It can also be sound but incomplete:
everything it checks is correct, but important behavior remains untested.

A useful suite must maximize both:

``` completeness(T) → 1 ∧ soundness(T) → 1 ```

*“The completeness and soundness of T should both approach one.”*

## The moving target

Let B(Cₜ) be the observable behavior of the code. Development attempts to
minimize its distance from the intent of the active version:

``` dₜ = d(B(Cₜ), Iᵥₜ) ```

*“At time t, dₜ is the distance between the code’s behavior and the current
intent.”*

The problem is that v does not remain fixed. Sales requests features, markets
change, users develop new expectations, and dependencies change the
environment. Let U represent this update pressure:

``` Iᵥ₊₁ = U(Iᵥ) ```

*“Update pressure transforms the current intent into the intent of the next
version.”*

Code may converge toward the intent of one version, but the sequence of
versions need not converge toward a final intent. Whenever v changes, the
target moves and the distance may increase again.

This is why software is never finished.

## Fast and slow test suites

Slow end-to-end and integration tests are close to production but expensive.
Fast unit and lightweight integration tests are cheaper but observe smaller
representations of the system.

Let F(C) be the fast-suite result and S(C) the slow-suite result. We want:

``` F(C) = 🟢 ⇒ S(C) = 🟢 ```

*“If the fast suite is green, the slow suite should also be green.”*

Equivalently:

``` S(C) = 🔴 ⇒ F(C) = 🔴 ```

*“Every failure detected by the slow suite should also be detected by the fast
suite.”*

Whenever the slow suite finds a defect missed by the fast suite, we add a fast
test that captures the same underlying problem. It does not need to reproduce
the complete slow scenario; it only needs to preserve the relevant constraint
at lower cost.

## The inner loop *(AI)*

Running the slow suite for every open pull request would create a throughput
bottleneck. Instead, the agent tests N candidate branches together.

Let:

``` Bₖ = {b₁, b₂, …, bₙ} ```

*“Bₖ is the set of candidate branches in iteration k.”*

At the beginning of each iteration, the agent recreates a temporary integration
branch:

``` Aₖ = merge(Bₖ) ```

*“Aₖ is the result of merging the candidate branches.”*

The loop is:

1. Select the candidate branches.
2. Recreate the temporary integration branch.
3. Run the slow suite against it.
4. Investigate a failure missed by the fast suites.
5. Map the failure to the branch where its test and fix belong.
6. Create a new branch if none owns the problem.
7. Reproduce the failure with a fast test on that branch.
8. Confirm that the test fails before the fix.
9. Fix the code.
10. Confirm that the fast suite passes.
11. Recreate the temporary branch and repeat.

A failure may belong to one pull request, result from an interaction between
several pull requests, or reveal an independent defect.

The process begins in production. When an observable runtime error escapes both
suites, the agent reproduces it in the slow suite. Under the assumption that
observable failures are eventually captured and reproduced:

``` completeness(Sₖ) → 1 ```

*“The completeness of the slow suite approaches one.”*

Failures found by the slow suite are then transferred into the fast suite:

``` completeness(Fₖ) → completeness(Sₖ) ```

*“The completeness of the fast suite approaches that of the slow suite.”*

Therefore:

``` completeness(Fₖ) → 1 ```

*“The completeness of the fast suite also approaches one.”*

The slow suite learns from runtime, while the fast suite learns from the slow
suite:

``` runtime → slow suite → fast suite ```

Batching allows one slow-pipeline execution to evaluate N pull requests. The
temporary branch is disposable; the knowledge extracted from it persists in the
individual branches and their fast tests.

The AI drives completeness.

## The outer loop *(Human)*

The developer operates the outer optimization loop. The developer does not need
to perform every edit, but must understand the problem the AI encountered and
how its solution addresses it.

The review loop is:

1. Receive a pull request.
2. Understand the problem and the proposed solution. **(The cognitive
bottleneck)**
3. Accept the fix or redirect the AI.

The developer reviews two relationships:

1. Does the test represent the actual requirement?
2. Does the fix satisfy that requirement rather than merely make the test pass?

This review preserves soundness. A test can increase completeness while
encoding the wrong behavior, and a fix can produce 🟢 without solving the
intended problem.

``` soundness(Tₜ) ↛ 0 ```

*“The developer prevents the soundness of the test suite from decaying to
zero.”*

In practice, developers cannot build understanding as quickly as AI can
generate changes. Human attention is therefore the bottleneck. Some incorrect
tests and fixes will pass through the outer loop.

AI drives the inner loop toward completeness. Humans drive the outer loop
toward soundness.

## Conclusion

Software development is a nested optimization loop:

``` AI: minimize d(B(Cₜ), Iᵥₜ) maximize completeness(Tₜ)

Human: preserve soundness(Tₜ) ```

*“AI implements the intended behavior and expands test coverage; humans ensure
that passing the tests still means something.”*

Completeness can be increased mechanically: observe a failure, reproduce it,
and add a test. Soundness requires understanding whether that test and its fix
represent the intended behavior.

### Conjecture 1: Test-suite quality

Let Rₜ be the runtime errors observed during a comparable interval at time t.
For stable intent and workload:

``` completeness(Tₜ) → 1 ∧ soundness(Tₜ) → 1 ⇒ |Rₜ| → 0 ```

*“As test completeness and soundness approach one, runtime errors approach
zero.”*

### Conjecture 2: Unsupervised test-suite decay

For a codebase and test suite evolved without human supervision:

``` completeness(Tₜ) → 1 ∧ soundness(Tₜ) → 0 ```

as:

``` t → ∞ ```

*“Over time, the suite covers every observed behavior while passing it provides
progressively less evidence of correctness.”*

The AI continually converts observed failures into tests, driving completeness.
Without human interpretation of intent, those tests increasingly encode the
AI’s previous assumptions and solutions, driving soundness toward zero.

The suite eventually reproduces every observed failure, but passing it means
progressively less.

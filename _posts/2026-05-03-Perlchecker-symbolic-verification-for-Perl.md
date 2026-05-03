---
title: "Perlchecker: Symbolic Verification for Perl via SMT Solving"
date: 2026-05-03
categories: [rust, perl, formal-verification, smt, z3]
---

(AI Generated)

What if you could *prove* that your Perl function is correct — not just test it
with a few examples, but mathematically verify that it satisfies its
specification for all valid inputs? That's what
[perlchecker](https://github.com/dhilst/perlchecker) does.

perlchecker is a Rust tool that formally verifies annotated Perl functions using
symbolic execution and SMT solving (Z3). You write preconditions and
postconditions as comments above your functions, and perlchecker either proves
they hold universally or returns a concrete counterexample.

## The Idea

Formal verification tools exist for languages like C (CBMC), Java (KeY), and
Rust (Kani), but Perl has been left out of the party. Perl's dynamic nature
makes full verification intractable, but a restricted subset — with static
types, bounded loops, and no heap — is perfectly amenable to SMT reasoning.

The key insight: if you constrain the language to what Z3 can reason about, you
get push-button verification for free. No proof assistants, no manual
invariants, just annotations and an automated solver.

## How It Works

The verification pipeline:

```
Perl Source → Function Extraction → Annotation Parsing → PEG Parsing
  → Type Checking → SSA/IR Lowering → CFG Construction
    → Symbolic Execution → SMT Encoding (Z3) → Verified / Counterexample
```

1. **Parse** — A PEG grammar (via `pest`) parses the Perl subset into an AST
2. **Type check** — Static types are inferred from `# sig:` annotations
3. **Lower to IR** — The AST is converted to SSA form for symbolic execution
4. **Build CFG** — Control flow graph with bounded loop unrolling
5. **Symbolic execution** — Explore all paths, collecting path conditions
6. **SMT encoding** — Translate to Z3 assertions, check the negation of the postcondition

If Z3 finds a satisfying assignment to the negated postcondition, that
assignment is a counterexample — a concrete input that violates the spec.

## Annotations

Functions are annotated with three comment directives:

```perl
# sig: (Int, Int) -> Int
# pre: $y != 0
# post: $result == $x / $y
sub safe_division {
    my ($x, $y) = @_;
    return $x / $y;
}
```

- **`# sig:`** declares the type signature (required)
- **`# pre:`** states preconditions — assumptions about inputs (optional)
- **`# post:`** states the postcondition — what must hold about `$result` (required)

Supported types include `Int`, `Str`, `Array<Int>`, `Array<Str>`, `Hash<Str, Int>`, and `Hash<Str, Str>`.

## Counterexamples

When verification fails, perlchecker produces a concrete witness:

```perl
# sig: (Int) -> Int
# post: $result > $x
sub broken {
    my ($x) = @_;
    if ($x >= 0) {
        return $x;     # Bug: $x is not > $x
    } else {
        return $x + 1;
    }
}
```

Running `perlchecker check broken.pl` will report that `$x = 0` (or any
non-negative value) is a counterexample: the function returns `$x` itself, which
is not strictly greater than `$x`.

## What Can It Verify?

The Perl subset is restricted but expressive enough for real logic:

- **Arithmetic**: `+`, `-`, `*`, `/`, `%`, `**`, bitwise ops, shifts
- **Control flow**: `if`/`elsif`/`else`, `unless`, ternary, `while`, `for`, `do-while`, `until`
- **Loop control**: `last`, `next`, bounded unrolling
- **Data structures**: arrays (push, pop, index), hashes (read, write, exists)
- **Strings**: `length`, `substr`, `index`, `contains`, `starts_with`, `ends_with`, `chr`, `ord`
- **Functions**: calls between verified functions, `# extern:` contracts for external functions
- **Specification features**: ghost variables, mid-function assertions, die-as-unreachable

Here's a more complex example — a bounded accumulator with loops:

```perl
# sig: (Int) -> Int
# pre: $x >= 0 && $x <= 5
# post: $result == 0
sub countdown {
    my ($x) = @_;
    while ($x > 0) {
        $x = $x - 1;
    }
    return $x;
}
```

perlchecker unrolls the loop up to the configured bound and proves that for any
`$x` in `[0, 5]`, the while loop terminates with `$x == 0`.

## Architecture

The implementation is about 5,000 lines of Rust, structured as:

| Module | Role |
|--------|------|
| `parser/` | PEG grammar + AST construction |
| `ast/` | AST types and type checker |
| `ir/` | SSA/IR lowering |
| `symexec/` | Symbolic execution engine |
| `smt/` | Z3 encoding and model extraction |
| `limits.rs` | Configurable safety bounds |

The safety limits prevent path explosion and infinite loops:

```
--max_loop_unroll 9     # loop unrolling depth
--max_paths 1024        # symbolic execution path limit
--solver_timeout_ms 5000 # Z3 timeout per query
```

## Why Rust + Z3?

Rust gives us the performance to handle path-explosive symbolic execution without
garbage collection pauses. The `z3` crate provides safe Rust bindings to
Microsoft's Z3 solver — the same engine used in production verification tools
like KLEE, Dafny, and F*.

The PEG parser (via `pest`) makes grammar evolution painless: adding a new Perl
construct means adding a rule to the `.pest` file and a corresponding AST node.

## Limitations and Tradeoffs

This is verification of a *subset*, not full Perl:

- No objects, closures, or references (scalar references recently added)
- No unbounded recursion (rejected at parse time)
- No dynamic `eval`, regexes as executable code, or string interpolation
- Loop unrolling is bounded — infinite loops produce "unknown" verdicts
- No heap modeling — arrays and hashes are modeled as SMT arrays

These restrictions are deliberate. Each one removes a source of undecidability
while preserving the ability to express real algorithmic logic.

## Trying It Out

```sh
git clone https://github.com/dhilst/perlchecker
cd perlchecker
cargo build --release
./target/release/perlchecker check examples/09_safe_division.pl
```

You'll need `libz3` installed (the `z3` crate links against it).

## How It Was Built: ChatGPT + Claude Code

perlchecker was not written by hand in a single sitting. It was developed through
a collaboration between ChatGPT (for research and planning) and Claude Code (for
implementation), orchestrated in iterative rounds.

### Step 1: Research in ChatGPT

The project started with exploratory conversations in ChatGPT — figuring out
which libraries to use (`pest` for parsing, `z3` crate for SMT), how to
structure the pipeline, and what subset of Perl would be tractable for symbolic
verification. This was pure problem exploration: no code yet, just deciding
the approach.

### Step 2: Generate a Plan for Claude Code

Once the design was clear, I asked ChatGPT to produce a detailed implementation
plan formatted as input for Claude Code. This became the bootstrap document that
Claude Code would follow to scaffold the project — the parser, AST, IR, symbolic
execution engine, and SMT backend, all wired together from day one.

### Step 3: Bootstrap with Claude Code

I fed the plan into Claude Code and let it bootstrap the project: create the
Cargo workspace, implement the initial pipeline end-to-end, and get the first
trivial example verifying. This was the PLAN → IMPLEMENT → TEST cycle for the
foundation.

### Step 4: Iterative Expansion (~118 Rounds)

With the foundation in place, the real work was expanding the Perl subset. This
happened in two phases:

**Phase A (~50 rounds):** I went back to ChatGPT to explore which Perl
constructs could be added while staying SMT-tractable. Each round followed a
protocol: propose a feature, validate it won't blow up Z3, implement it in
Claude Code, run the test suite. Fifty rounds of this got us from basic
arithmetic to loops, arrays, hashes, string builtins, and compound expressions.

**Phase B (rounds ~50–118):** To push further, I ran an adversarial debate
inside Claude Code using multi-agents — a CRITIC and a DEFENDER. The CRITIC's
job was to dismiss the project — pointing out real Perl patterns that perlchecker
couldn't handle, arguing the restrictions made it useless. The DEFENDER argued
back, showing what *could* be verified and why bounded verification is a valid
engineering tradeoff. The debate traces were recorded and mined for expansion
ideas. Features like ghost variables, extern contracts, and mid-function
assertions came directly from this adversarial process — the CRITIC would say
"you can't even express X" and the DEFENDER would figure out how to add it
tractably.

Each expansion round followed the same meta-plan: propose one feature, check SMT
tractability, implement, run QA, commit. The protocol ensured no round broke
existing functionality and every new feature shipped with a verifiable example.

### The Takeaway

The interesting pattern here is using LLMs in complementary roles:

- **ChatGPT** for open-ended research, library selection, and generating
  structured plans
- **Claude Code** for disciplined implementation within a defined protocol
- **Adversarial debate** (multi-agent in Claude Code) to stress-test the design
  and generate non-obvious feature ideas

The result is a tool that would have taken weeks of manual implementation,
built incrementally through 118 automated rounds with human oversight at the
steering level.

## Conclusion

perlchecker shows that formal verification doesn't have to be a heavyweight
process reserved for safety-critical systems. By choosing a tractable subset and
leveraging mature SMT infrastructure, we get push-button proofs for Perl
functions — write annotations, run the tool, get either a proof or a
counterexample. No PhDs required.

Source: [github.com/dhilst/perlchecker](https://github.com/dhilst/perlchecker)

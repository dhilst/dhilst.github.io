---
layout: post
title: Equational reasoning meets Induction (part 1)
tags: [proofs, algebra, equational-reasioning, axiom]
---

I've been studying Formal Methods again since the beggining of this
year, and now I'm looking at algebraic specifications and I found
they pretty elegant. To be able to pratice with it I vibecoded
an algebraic specification plugin for Claude, and named it [algae](github.com/dhilst/algae).

Since I more interested into understanding the proofs I'm focusing
on a syntax that make everything explicit, instead of focusing on
soundness and the checker now.

I came across Algebraic Specifications while going through this book:

![Specification of Software Systems, Alagar et Periyasamy, 2nd edition](assets/spec-of-sw-systems-alagar-2nd-ed.jpg)

At chapter 13 the author show the [OBJ3](https://wiki.c2.com/?ObjLanguage) language.
So I decided to write one of my own so I can experiment, or even better, let Claude
write on of my own. As I said I'm more interested into learning the equational
reasoning than having a working solution, so my focus was more into making it
very explicit than very pratical for use.

I spend some weeks play with proofs until I arrived to this 

	# Stack with a partial assert that narrows pop's fallible result, plus
	# lemmas with proof sketches. Lemmas and proofs are parsed but not checked.
	sort Stack, Elem;

	sort Error = {empty_error};

	op empty  : → Stack;
	op push   : Stack × Elem → Stack;
	op pop    : Stack → Stack × Elem | Error;

	# A partial operation (⇸, ASCII -/->) narrows a sum to one of its branches.
	op assert : Stack × Elem | Error ⇸ Stack × Elem;

	op fst : (Stack × Elem) → Stack;
	op snd : (Stack × Elem) → Elem;

	var s : Stack;
	var e : Elem;

	axiom push_pop
	  s.push(e).pop = (s, e);

	axiom empty_pop
	  empty().pop = empty_error;

	axiom assert_elim
	  (s, e).assert = (s, e);

	axiom fst_pair
	  (s, e).fst = s;

	axiom snd_pair
	  (s, e).snd = e;

	lemma pop_top
	  s.push(e).pop.assert.snd = e;
	proof
	  s.push(e).pop.assert.snd;
	  = (s, e).assert.snd by push_pop;
	  = (s, e).snd by assert_elim;
	  = e by snd_pair;
	qed;

	lemma pop_stack
	  s.push(e).pop.assert.fst = s;
	proof
	  s.push(e).pop.assert.fst;
	  = (s, e).assert.fst by push_pop;
	  = (s, e).fst by assert_elim;
	  = s by fst_pair;
	qed;


At this point I was able to prove little things about stacks. I also had a
parsing and typechecking working. There was no checker but all the steps are
sound. The proofs go by equational reasoning, for example

This is what I want to prove: `s.push(e).pop.assert.fst = s`,
- by `axiom push_pop s.push(e).pop = (s, e); ` I can replace
  `s.push(e).pop` → `(s, e)` getting `(s, e).assert.fst`
- Now you may wonder, why assert is necessary? The problem is that
  `fst` accepts `Stack × Elem` while pop returns `Stack × Elem | Error`, these
  are not the same type. The `assert` specify the runtime error checking
  behavior, this can be `.is_ok` in Rust or `is not None` in Python or type
  narrowing in typescript. The only axiom we have to eliminate `assert` is
  `axiom assert_elim (s, e).assert = (s, e)`, i.e. we can only allow us to
  eliminate `.assert` call if its argument is an pair.
- After that we have `(s, e).fst` and the `fst_pair` axiom allow us to
  eliminate the pair to the `s`.
- Since we're trying to prove `... = s` and we get to `s` we finished our proof.

We can gatter two lessons from this.

1. First, how equational reasoning works: You want to prove something like `A = D`, 
   and you have a bunch of equations `A = B`, `B = C`, `C = D`, you use the equations
   to replace portions of the goal, step by step, usually getting a simpler goal at
   each step, until you get to `D = D` when you can finish the proof (by reflection).

2. How you can use equational reasoning to emulate computational reasoning. When we
   do `const fst = ([a, b]) => a;` in javascript and later `fst([1, 2])` we're
   **computing** `1` from `[1,2]`. The equation `axiom fst_pair (a, b) = a`
   emulate the same behavior. The difference between "computational" and "equational"
   and more profoundly the difference between computation and logic is that logic
   is birectional, you can rewrite in both directions, it is a equantion, not a
   computer procedure, you cannot put a value into the return address and
   **unwind** a function to get its inputs, computers do not work that way, logic
   does! The big advantage and power of computers is that you can put the inputs
   in place and hit **COMPUTE** and let it do the hard work for you. The big drawback
   is that once you have **ONE** undefined term, it cannot compute anymore. You cannot
   say "compute `f(x)`" without defining `f` and `x`. If you look at our Stack spec,
   `Stack` and `Elem` are completely abstract. They are not defined at all, this allow
   us to keep things abstract, to implement this in a computer we need define Stack,
   probably with an array, which is defined by the underlying language, which is later
   interpreted or compiled to another language, until finally it is in a form which
   which your x86_64, or ARM CPU can understand, you can't skip a step, 
   every bit, every data type, every function, class, everything has to be defined
   up to the baremetal level, but once it is one, you have that beatiful **COMPUTE**
   red buttom that allow you to be very fast. Okay back to the proofs.

After that I want to prove things about queues. Stacks are simple because they
only reason about the last elements, so they do not much state. I mean given an
arbitrary stack `s` you can relate `push` and `pop` with `s.push(e).pop = (s,
e)` what about queues, how to relate `enqueue` and `dequeue` (`put` and `get`
below)? `put` talks about the tail of the queue, `get` talks about the head of
the queue. Here is the spec:


	sort Queue, Elem;

	op new : → Queue;
	op put : Queue × Elem → Queue;

	# Returns (remaining_queue, returned_element)
	op get : Queue × Elem → Queue × Elem;

	var q             : Queue;
	var e, f, default : Elem;

	# Empty queue
	axiom new_get new().get(default)
	  =
	  (new(), default);

	axiom new_put_get new().put(e).get(default)
	  =
	  (new(), e);

	axiom fifo_law q.put(e).put(f).get(default)
	  =
	  let (rest, x) = q.put(e).get(default)
	  in (rest.put(f), x);

	lemma get_three
	  new().put(a).put(b).put(c).get(default) =
	    (new().put(b).put(c), a);
	proof
	  new().put(a).put(b).put(c).get(default);
	  = let (rest, x) = new().put(a).put(b).get(default) in
	    (rest.put(c), x) by get_fifo;
	  = let (rest, x) = (new().put(b), a) in
	    (rest.put(c), x) by get_two;
	  = (new().put(b).put(c), a) by let_pair;
	qed;


I could prove things about fixed length queues by applying the same axiom again
and again and again ... but I want to prove things about arbitrary long queues,
and it was clear (after GPT told me) that I need induction. I didn't know how
to use induction with equational reasoning so I started to research.


continue ...

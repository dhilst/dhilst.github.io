---
layout: post
title: Abstracting recursion over AST
tags: [ocaml, AST, optimization, tree]
---

Something that I think is realy useful when working with abstract
syntax trees, is the possibility to do tree transformations. Trees
transaformations can be used to add information to the AST from a
semantic analysis, add positions, do optimizations, inline functions,
etc. In this post I show what I learned after trying to achieve good
tree transformations API in my code.

First things first: I'm using a boolean language with variables as
example here. I know that real world examples tend to be much more
complex. Also, keep in mind that the things shown here represent my
personal opinion but I will try to explain the trade-offs as much as
possible, in any case, spoiler alert; it may not be the most type safe
option available, I will try to explain why later.

You can find the code [here](https://gist.github.com/dhilst/e26a8e7d4b19d6db63778fadae40e56e)!

## The Language

So this is the OCaml type for the AST

```ocaml
type expr =
  Bool of bool
| And of expr * expr
| Or of expr * expr
| Not of expr
| Var of string 
```

The `Var` is just for making it possible to represent unoptimizable
branches in the AST. Otherwise the notion of interpreting and optimizing
would colide.

## `(Not (Not x)) ~> x`

Our first optimization is solving `(Not (Not x))` expressions to
`x`. The code start like this:

```ocaml
let rec notnot = function
  | Not (Not a) -> notnot a
  | ...
```

Of course this is not valid OCaml code. The `...` need to be replaced
with all the branches. I may be tempted to do this:

```ocaml
let rec notnot = function
  | Not (Not a) -> notnot a
  | expr -> expr
```

But then the expression `(And (Not (Not x), ...))` would not be optmized.
We need to carry our tree transformation recursively over the AST:

```ocaml
let rec notnot = function
  | Not (Not a) -> notnot a
  | And (a, b) -> And (notnot a, notnot b)
  | Or (a, b) -> Or (notnot a, notnot b)
  | Not a -> Not (notnot a)
  | Bool _ as a -> a
  | Var _ as a -> a
```

Now if we do another tree transformation we need to repeat all the recursion
boilerplate again. This is not a problem with a small AST as we have here
but it becomes tedious when the AST starts to grow.

## Abstracting recursion

So this is the first lesson I learned from these tries:

1. Try to squish all the AST in on type as much as possible.

This will simplify a lot the tree transformations because if you have an
AST spanning 5 types for example, to write a complete tree transformation
you'll need to write, at last: 5 functions, just to carry the recursion
over the AST.

The *down side* here is that a complex AST have multiple levels, for
example: a complete programming language may have a type for
statements and another for expressions. Squishing statements and
expressions make possible to construct expressions containing
statements which may be invalid in that programming language. Because
of this the user of the API has to deal with invalid cases and the AST
is *NOT VALID BY CONSTRUCTION*.

My argument here is that is simpler to: 1) use a simpler grammar and
simpler AST that is not valid by construction and do validation as
second phase action than 2) write a strictier grammar and use a valid
by construction AST with multiple types. You can also use both, start
with simpler AST and write a function that maps that simpler AST to
a correct by construction AST type.

That said, it is possible to abstract the recursion of the previous
optimization: We receive a function that represents some transformation
and we call it in all the recursive cases in our AST:

```ocaml
let transf' f = function
  | Bool _ as b -> b
  | Var _ as v -> v
  | And (a, b) -> And (f a, f  b)
  | Or (a, b) -> Or (f a, f b)
  | Not a -> Not (f a)
```

Now we can redefine our `notnot` optimization like this

```ocaml
let rec notnot' = function
  | Not (Not a) -> notnot' a 
  | expr -> transf' notnot' expr
```

And this is the second lesson I learned:

2. Write a function to carry the recursion for you.
   - Given the AST type `t`:
     - A transformation is a function `t -> t`
     - Receive a tranformation `f : t -> t` and an expression `expr :
       t` and call/carry the transformation over all the recursive
       branches of `t`

As a side note, in the gist there are two functions `transf` and `transf'`.
The difference is that `transf` calls the `f` function again after recursing,
in the `Not` case:

```ocaml
(* transf *)
| Not a -> f (Not (f a))

(* transf' *)
| Not a -> Not (f a)
```

I couldn't find an example but *I guess* that `transf` is more susceptible to falling
in an infinite loop depending on `f`.

Abstracting the recursion make the intended transformation evident and
this is very important because tree transformations may introduce unsoundness
or bugs.



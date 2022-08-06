---
layout: post
title: Almost dependent typechecking in Python
tags: [python, type-checking]
---

In this post I evolve the idea of typechecking Python code by using
the `ast` module introduced at [Polymorphic Typechecking in Python by
Unification](https://dhilst.github.io/2022/07/18/polymorphic-typechecking-in-python/),
but instead of using unification I use evaluation to compare the types.

The code that we will typecheck can be found
[here](https://github.com/dhilst/lampy3/blob/master/pydepchecktest.py)
and the typechecker
[here](https://github.com/dhilst/lampy3/blob/master/pydepcheck.py).

To run the typechecker and the tests clone the repo and do this:

```sh
# running the typechecker
python pydepcheck.py pydepchecktest.py
# running the tests (you need pytest installed)
pytest pydepchecktest.py
```

I will not show the full code here to not make the post overwheming,
but I will briefly explain how to typechecker works in the end of the
post. Let's start simple.

# Polymorphic functions

On [Polymorphic Typechecking in Python by
Unification](https://dhilst.github.io/2022/07/18/polymorphic-typechecking-in-python/),
I used strings to express the type signatures, but I want to try to
index my types by any kind of Python expressions, so using strings
become a burden and I decided to look for another representation.

I want something like `forall (a : Type) (b : a), E` where `a` is a
type `b` is a term with type `a` and `E` is any Python expression, but
which are still valid Python. The encoding I come up to represent
functions was to use a `lambda` returning a tuple. With a `lambda` I
can introduce names, and with tuples I can represent the function
arguments and return value.

So for a `add` function `int -> int -> int` is expresed as `lambda: (int,
int, int)`. If the function is polymorphic I use the lambda to
introduce the type variable, the id function has this type `lambda T:
(Type, T, T)`.

As before I use a special function to introduce type information and
use the [ast](https://docs.python.org/3/library/ast.html) module to
parse and typecheck the code.

The id and add function state with type anotations:

```python
type_("id", lambda T: (type, T, T))
def id(T, a):
    return a

type_("add", lambda: (int, int, int))
def add(a, b):
    return a + b
```

You see that `id` function receives two arguments `T` and `a`. `T` is
the type of `a`. This looks redundant, and it is at some point, but this
is what happens behind the scenes in most implementations of polymorphism,
in most cases the type argument is implicit and just infered from the
other arguments. Here are some calls

```python
id(int, 1)          # ok 
id(int, "foo")      # type error, but it works at runtime
id(int, id(int, 1)) # ok
add(1, 2)           # ok
add(1, True)        # type error, but it works at runtime
add(1, "bar")       # type error and fails at runtime
```

# Type abstraction/Polymorphic container types

In the same way that polymorphic functions are functions that receive a type
as argument, polymorphic types are just functions that receive types as argument
and returns a type. Here I define a `box(T)` type. At runtime this is just a list
with a single value.


```python
type_("box", lambda T: (Type, Type))
def box(T): return Type(box, T)
``` 

To represent types I use the `Type` class, a class created in
`pydepcheck.py` which is damn simple, here is the constructor

```python
class Type:
    def __init__(self, *args):
        self.args = args
    # more method for repr and equality checking
```

The cool part is that `box` is a function from types to types, and this gives
us type abstraction, i.e., polymorphic type constructors. Here are some functions
using box and its test

```python
# receives a T and return a box(T)
type_("put_into_a_box", lambda T: (Type, T, box(T)))
def put_into_a_box(T, i):
    return [i]

# receives a box(int) and return an int
type_("get_from_a_box", lambda: (box(int), int))
def get_from_a_box(b):
    return b[0]

def test_box():
    # insert 1 in a box(int) and then remove it
    # int is the type parameter
    assert get_from_a_box(put_into_a_box(int, 1)) == 1
```

# Existential types / Record types / Module types

The next type I want to show is existential types, it let us to
express abstract types so that the caller do not know the
representation of the type and only way that it has to interact with
terms of an abstract type is through functions that work on such type.
This is the foundation stone of encapsulation, which is one of the
most important things in software engineering in my opinion.

This is for example the mechanism behind the OCaml (plain) modules.

I introduce a new class `Record` to represent record types, again the
type constructor is a function from types to types, in this example
I show the encapsulation of naturals.

```python
# Receives a (T : Type) and return a the nat(T) type
type_("nat", lambda: (Type, Type))
def nat(T):
    return Record({
        "type": T,
        "zero": T,
        "succ": lambda: (T, T)
    })
```

Records are represented by dictionaries in runtime, `pack_nat` receives
the needed input and returns a packed `nat(T)`:

```python
# Receives a (T: Type) (zero : T) (succ : T -> T) and returns
# a nat(T) term
type_("pack_nat", lambda T: (Type, T, lambda: (T, T), nat(T)))
def pack_nat(T, zero, succ):
    return {"type": T, "zero": zero, "succ": succ}
```

Functions receiving a `nat(T)` term has no clue about the term internal
representation but they can call the provided functions on it

```python
# inc knows nothing about T, just that it can call
# nat(T) functions on it, i.e, T is abstract 
# receives a (T : Type), (nat : nat(T)) (i : T) and
# returns a T
type_("inc", lambda T: (Type, nat(T), T, T))
def inc(T, nat, i):
    return nat["succ"](i)
```

Here is the test of `nat`

```python
# increment an int
type_("add1", lambda: (int, int))
def add1(a):
     return a + 1

def test_nat():
    # packs (int, 0, add1) into a nat(int) and pass it to
    # the inc function
    assert inc(int, pack_nat(int, 0, add1), 1) == 2
```


You may be wondering, well we have functions from terms to terms,
from types to types, can we have functions from terms to types, or
dependent functions?

Well, yes, but there is a problem

# (static) Dependent types

Here I will introduce a `tlist` type, `tlist` is just a list in runtime
and it has a with a generic `T` type in typecheck time.

```python
# A typed list
type_("tlist", lambda T: (Type, Type))
def tlist(T):
    return Type(tlist, T)

# Return a new list with x in the front of the l list
type_("cons", lambda T: (Type, T, tlist(T), tlist(T)))
def cons(T, x, l):
    return [x, *l]

# Return an empty list
type_("nil", lambda T: (Type, tlist(T)))
def nil(T):
    return []

# Convert (cast) an untyped list to tlist(T) [unsound]
type_("mklist", lambda T: (Type, list, tlist(T)))
def mklist(T, l):
    return l

def test_tlist():
    assert cons(str, "a", cons(str, "b", nil(str))) == ["a", "b"] # ok
    assert mklist(int, [1,2,3]) == [1,2,3]                        # ok
```

Ok, now I will indtroduce a vector type, vector is tlist, paired with
its lenght, it's a *type*, since the lenght of the list depends on the
list, this is tecnically a dependent type. Yay!, here is it:

```python
# vec(T, i), where i is the length of the term of T
type_("vec", lambda T: (Type, int, Type))
def vec(T, i):
    return Type(vec, T, i)

# given a tlist(T) returns a vec(T, len(l))
type_("mkvec", lambda T, l: (Type, tlist(T), vec(T, len(l))))
def mkvec(T, l):
    return l

# converts a vec(T, i) back to a a tlist(T)
type_("vunpack", lambda T, n: (Type, int, vec(T, n), tlist(T)))
def vunpack(T, n, vec):
    return vec

# like cons, but for vectors
type_("vcons", lambda T, n: (Type, int, T, vec(T, n), vec(T, n + 1)))
def vcons(T, n, x, vec_):
    return [x, *vec_]

# acccept a vector with exactly one element
type_("head", lambda T: (Type, vec(T, 1), T))
def head(T, vec):
    return vec[0]
```

In runtime, vectors are justs lists. We can see in the type of `head` that it
receives an vector of type `vec(T, 1)`, which means that this vector need to
have exactly one element. `vec(T, 0)` is type error, `vec(T, 2)` is type error.

We can call these functions as long as our inner lists exists at typecheck type,
i.e, statically, here is the test

```python
def test_tvec():
    assert head(bool, mkvec(bool, mklist(bool, [False]))) == False
```

But what would happens if we have something like this

```python
type_("foo", lamdba T: (Type, tlist(T), T))
def foo(T, l):
    return head(T, mkvec(T, l))
```

In this case `l` does only exists in runtime, how can we typecheck the head call? The
answer is, with the current implementation you can't, to explain why I will need to
explain a little how the typecheck works.


# How the typecheck works

When you call `python pydepcheck.py pydepchecktest.py` the
`pydepchecktest.py` is parsed into an
[AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) and passed
to
[Typer](https://github.com/dhilst/lampy3/blob/master/pydepcheck.py#L171)
class, this class is an subclass
[NodeTransformer](https://docs.python.org/3/library/ast.html#ast.NodeTransformer).
`NodeTrasnformer` class will visit each node of the AST and it may
replace the nodes if needed (more on this later).

In `Type` I only implement the `visit_Call` method of the
`NodeTransfomer` which means that only calls will be visited. This is
why all examples are nested calls, something like this `x = 1; id(int,
x)` is not implemented.

In the
[visit_Call](https://github.com/dhilst/lampy3/blob/master/pydepcheck.py#L90)
I

* Just return if this is a subscript, subscript are expressions like
  this `foo[bar]`, they are used in the record but we don't care about
  them during the typechecking.
* If this is a call to `type_` we extend the type environment
  `self.typeenv` with the new type information just gathered. The
  value in `self.typeenv` will be an ast subtree.
* If this is a call to `typedebug` we just print stuff.
* If this is call to a lambda or to a function which we don't have
  type information we just give up
* Otherwise ... this is the fun part

So here we are, trying to typecheck a call to a function which we have
type inforation available, I will use the `id(int, 1)` call as
example, at this point we are
[here](https://github.com/dhilst/lampy3/blob/master/pydepcheck.py#L120)
in the code. I recommend that you open the code side by side to follow
the explanation, in the following block of code we have

* `typ = self.typeenv[node.func.id]`, this will grab the type of the
  function. This is the AST for `lambda T: (type, T, T)` in this case.
  `node.func.id` is the name of the function being called, `id` in
  this case.
* `nparms = len(typ.args.args)` will get the number of type arguments
  in `typ`, in this case we have `T` so a single one.
* `typargs = node.args[:nparms]`, here `node.args` are the actual
  arguments, if we are calling `int(int, 1)`, then `node.args` will be
  the AST for the `int, 1` arguments, `nparms` is the number of type
  arguments taken before, which is 1, so this will reduce to something
  like `[int]`
* `reduced_typs = self.eval(Call(typ, typargs, keywords=[]))`, this is
  the coolest part. In `typergs` we have the type arguments that we
  want to apply to type of the function, these will be the type
  variables like `T` in the type of `id`: `lambda T: (Type, T, T)` we
  construct an `Call` AST, here `typ` is `lambda T: (Type, T, T)` and
  `typargs` is `int`, this is basically `(lambda T: (Type, T,
  T))(int)` which reduces to `(Type, int, int)` after type
  application, and this is what is saved in the `reduced_types`, we
  will use this to typecheck.
* `nodeargs = [self.visit(arg) for arg in node.args]`, here
  `self.visit` is a method of `NodeTransformer` which will visit the
  nodes at `node.args`, `node.args` are the actual arguments of the
  functions. If we have nested calls like `id(int, id(int, 1))` this
  will recurse to `visit_Call` again. As an spoiler, on success,
  `visit_Call` returns the type of the function just typechecked, the
  `self.visit` method will return this return type here, and this is
  how we typecheck the nested calls. In `foo(bar())` the return type
  of `bar()` is replaced in `nodeargs` and used during the
  typechecking.
  
Now that we have the concrete (reduced) types and the argument, the
typchecking, rougtly speaking is a matter of checking if the type of
each term matches if the type gathered (and reduced) from the type
environment, we do this by zipping the types and arguments (called
terms in the code) and checking them, we have some cases to check, we
are
[here](https://github.com/dhilst/lampy3/blob/master/pydepcheck.py#L127)
in the code.

At this point `term` may still be an AST node, so instead of `int`
that whould be what we want, we would have `Name("int")`, `to_value`
method handle this returning a returning a proper value for the term,
in this case, at first iteration we will have `int` in term and `type`
in `typ`, with this, in the last if
[here](https://github.com/dhilst/lampy3/blob/master/pydepcheck.py#L161)
we have `type(int) is type` which returns `True`. Yeap, we just
typechecked the type variable passed to `id`, in the next iteration
the `term_` is 1 and the `typ` is `int` which reduces to `type(1) is
int` which is also is `True`, finally we return the type of the whole
call `int` in this case wrapped in a constant node.

# Failing to checking runtime dependent types

Going back to our example, if we try to typecheck this

```python
type_("foo", lamdba T: (Type, tlist(T), T))
def foo(T, l):
    return head(T, mkvec(T, l))
``` 

The first problem is that `l` is a variable here and it's not introduced
int the type environment, to introduce it we need to implement the
`visit_FunctionDef` method of `NodeTransformer` introducing the type of
the arguments into the type environment before typechecking the function body,
but this will be not enough.

Even assuming that we did `l` has the type `tlist(T)` in the type environment,
the type of `mkvec` is `lambda T, l: (Type, tlist(T), vec(T, len(l))))` which
means that we need to call `len` in this `l`, BUT `l` DOES NOT EXIST YET.

![epic-fail](/assets/try-again-fail-meme.png)

To make this work we would need to typecheck at runtime. Other option that I was wondering
was to do something like this

```python
type_("foo", lamdba T: (Type, tlist(T), T, T))
def foo(T, l, default):
    if len(l) == 1:
        return head(T, mkvec(T, l))
    else:
        return default
```

The idea here is to use the `len(l) == 1` information in the if
position as a typeguard, and substitute `len(l)` in the type `vec(T,
len(l))` with `1`, with this achieving the the desired type for the
head call. But I wil not do this at last not now, and I don't think
that this is elegant because now I have two evaluation strategies, but
yeah, is doable. I say something about typeguards in
[this](https://twitter.com/geckones/status/1551410190196555776?s=20&t=b9s_lJY1hHu4C7B4NHS_9w)
tweet. (In english: _Playing with type guards, refining a type inside an if_)

Well, I think that's it. BTW this
[lampy3](https://github.com/dhilst/lampy3) project started with the
idea of writing a functional language that transpiles to python but it
got so complicated when I get to integrating to python (because there
are python things that I don't want, like exceptions) and also get I get
stuck in the typechecker, I wanted something with at last polymorphism and
existential types, but I'm always tempted to adding more and more to the
type language (dependent types). I'm very happy with the results, even the
dependent types being not usable.

Not controlling the evaluator imposes big obstacules in the implementation
of a language, like I do not control the evaluation of Python, but it was
a wonderful prototyping tool, if you get up to here, thanks for reading,
you can reach me in the [twitter](https://twitter.com/geckones) for questions :)

Cheers!



        
    


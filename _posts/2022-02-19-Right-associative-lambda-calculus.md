---
layout: post
title: Rigth associative lambda calculus
author: Daniel Hilst
tags: [lambda-calculus, parser, parsers, associativity, parse-combinators]
---

I always wondered how it would be to use a function that application is right
associative. I mean, instead of calling functions like this `f(x)` or
`f x` we can call it like this `x f`, basically the call is inverted
you have the arguments first then the function. And what would be the implications
of this change.

The pipe operator is known in OCaml for providing something like that, so 
`foo |> bar` is equivalent to `bar foo` and `foo |> bar tar` is equivalent
to `bar tar foo`. I would like to try a language where all applications
are in this form by default, to experiment with this I implemented a simple
lambda calculus parser and evaluator. I show my conclusions at the end of the post

## The motivation 

The motivation behind this is the look for a grammar that is intuitive to read. The
use of pipe operator make it clear what I'm talking about. `do_something x |> 
then_other_thing |> then_another_thing`. You speel the code as a series of transformations
in the order they occur, in the same way we do with shell
commands for example, `ps -ef | grep python | grep -v grep | awk '{print $2}'`.

I want something that is in this way by default, `data func1 func2 func3`.

## The implementation

[Lambda calculus](https://en.wikipedia.org/wiki/Lambda_calculus) is a computation
model created by Alonzo Church in the 30s. You can think of it as the smaller programming
language ever. It has variables, abstractions (functions) and applications (function calls).
Applications are usually left associative so `f a b` is equal to `((f a) b)`. In this
post I show an (deadly simple, and possibly wrong) implemenation a lambda
calculus with right associative aplications.

**All the code is in github at https://github.com/dhilst/rlambda**

Basically I declare the type of expressions that I can have:

```python
from collections import namedtuple as t  # type: ignore

var = t("var", "name")
lamb = t("lamb", "var body")
rappl = t("rappl", "l r")
```

Some possible errors

```python
class ParseError(Exception):
    pass


class EndOfInput(ParseError):
    pass
```

### The parse microlib

Then I wrote a simple parse combinator, you can check what are parse
combinators at [Wikipedia](https://en.wikipedia.org/wiki/Parser_combinator) or
search for tutorials on it, but basically you write functions to parse simple
things, and other functions to combine the former ones on to parser more complex expressions.

Here is a simple explanation of the combinators used in the code

* A parse is a function that receives an input and return the parsed value and the remaining
input, or raise an error.
* `pregex("foo")` returns a parser that parses "foo".
* `pand(p1, p2, ..., pn)` is an _logical and_ combinator, it runs all parsers,
  `p1`, `p2`, up to `pn` and return a list of their results. If any `p` fails
  the `pand` fails too.
* `por(p1, p2)` is an _logical or_, it returns the resulf of the first `p` that
  succeed, and fails if all parsers fails.

And that's it!

### The grammar

I declare the terminals at:

```python
LPAR = pregex(r"\(")
RPAR = pregex(r"\)")
ARROW = pregex(r"=>")
VAR = pregex(r"\w+")
```

Then I declare the grammar as a series of parser combinators, the entry point is the `pexpr`
function. There are `pexpr_<n>` functions where `<n>` is a number. The higher the number higher
is the precedence of that parser. So `pexpr` will call `pexrp_1` which in turn calls `pexrp_2` and so
on and in the end they will genearte and [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree),
in terms of `var`, `lamb` and `rappr`, introduced earlier, so that this AST can
be evaluated by the `eval_` function. I will show the `eval_` function later. 

The code:

```python
def pexpr(inp):
    return pexpr_1(inp)


def pexpr_1(inp):
    return por(plamb, pexpr_2)(inp)


def pexpr_2(inp):
    return por(prappl, pexpr_3)(inp)


def pexpr_3(inp):
    return por(pvar, pparen)(inp)


def plamb(inp):
    (v, _, body), inp = pand(VAR, ARROW, pexpr)(inp)
    return lamb(v, body), inp


def pvar(inp):
    v, inp = VAR(inp)
    return var(v), inp


def prappl(inp):
    e1, inp = pexpr_3(inp)
    e2, inp = pexpr(inp)
    return rappl(e1, e2), inp


def pparen(inp):
    (_, e, _), inp = pand(LPAR, pexpr, RPAR)(inp)
    return e, inp
```

With this set up we can test the parsing. It should return AST value and the
remaining input. I'm using pytest for testing, you can run `pytest rlambda.py`
to run it.

```python
def test_lparser():
    assert pexpr("a") == (var("a"), "")
    assert pexpr("(a)") == (var("a"), "")
    assert pexpr("a b")[0] == rappl(var("a"), var("b"))
    assert pexpr("(a b)")[0] == rappl(var("a"), var("b"))
    assert pexpr("a => b")[0] == lamb("a", var("b"))
    assert pexpr("(a => b)")[0] == lamb("a", var("b"))
    assert pexpr("a => b => c")[0] == lamb("a", lamb("b", var("c")))
    assert pexpr("x (a => b)")[0] == rappl(var("x"), lamb("a", var("b")))
    assert pexpr("x (a => b)")[0] == rappl(var("x"), lamb("a", var("b")))
    assert pexpr("a => a b") == (
        lamb(var="a", body=rappl(l=var(name="a"), r=var(name="b"))),
        "")
    assert pexpr("x a => b => c")[0] == rappl(
        l=var(name="x"), r=lamb(var="a", body=lamb(var="b", body=var(name="c"))))
    assert pexpr("x (a => b => c)")[0] == rappl(
        l=var(name="x"), r=lamb(var="a", body=lamb(var="b", body=var(name="c"))))
    assert pexpr("x (a => b => c)")[0] == rappl(
        l=var(name="x"), r=lamb(var="a", body=lamb(var="b", body=var(name="c"))))
```

Then we have the eval function that evaluate an expression. Here I'm using
[call by value](https://en.wikipedia.org/wiki/Reduction_strategy#Lambda_calculus) convetion.
This is closer to what is used on most programming languages.

And some tests, and during the tests I found something interesting, that is kind of
obvious once you think about it, but not that obvious at first.

```python
def test_eval():
    assert eval_(pexpr("1 (x => x)")[0]) == "1"

    assert pexpr("1 2 (a => b => a)")[0] == pexpr("1 (2 (a => b => a))")
    assert eval_(pexpr("1 2 (a => b => a)")[0]) == "2"
```

# Right associative applications, conclusion

If you look carefully to the last tests you will find this `assert ("1 2 (a => b =>
a)")[0] == pexpr("1 (2 (a => b => a))")`.  ```, And yet `assert eval_(pexpr("1 2 (a => b => a)")[0]) == "2"`.

I was expecting `1 2 (a => b => a)` to reduce to 1, not 2, but since
the application is right associative, that expression is equal to
`1 (2 (a => b => a))`. Now it's clear what is happening, the 2 is being
passed to the function before the 1. The AST of this expression is this:

```python
rappl(
    l=var(name="1"),
    r=rappl(
      l=var(name="2"), 
      r=lamb(var="a", body=
        lamb(var="b", body=
          var(name="a")))),
)
```

So `r=rappl(l=var(name="2"), r=lamb(var="a", body=lamb(var="b", body=var(name="a"))))` is evaluated first.

While `data func1 func2 func3` is some kind of intuitive to read _take data and
apply func1, then func2 then func3_, the inversed application of arguments were
not expected and took me by surprise, and it's not intuitive at all.

This is not wrong in fact, it's consistent to the right associativity, but it's
weird. I will keep looking for a left to rigth grammar that is intuitive to
follow anyway.


I hope that you liked, comments and questions are welcome!

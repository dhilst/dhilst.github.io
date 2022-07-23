---
layout: post
title: Functional programming in Python with partial application, pipe operator and error handling
tags: [python, functional-programming]
---

While trying functional programming in Python there are two things that I think
always come as pain points. The first, chaining or composing functions. The second
is the error handling composition. In this post I how implement an usable pipe operator
how to get most of the functions with partial application and an ExceptionMonad to
abstract try/catchs.

#### Pipe operator

In OCaml we have the pipe operator `foo |> bar x` is equivalent to
`bar x foo`, this really helps with chaining `List` high order functions, like `map`, 
`fold_left`, `filter`, so that you can do something like this.

```ocaml
utop[0]> List.(init 10 Fun.id |> filter (fun x -> x < 5) |> map (fun x -> x * 2));;
- : int list = [0; 2; 4; 6; 8]
```
In Python, without piping, this is would be something like this

```python
>>> list(map(lambda x: x * 2, filter(lambda x: x < 5, range(0, 10))))
[0, 2, 4, 6, 8]
```

It's terrible to read. The first step is to be able to partially apply a function. In
OCaml we have curry so this is for free. In Python we can do something like this (credits: 
[this](https://nvbn.github.io/2016/08/09/partial-piping/) post by [nvbn](https://github.com/nvbn)).

The idea is, we create an object that works like [partial](https://docs.python.org/3/library/functools.html#functools.partial)
but for one of the arguments you pass `...` and this object is a callable that receives one argument
and when it's called it replaces the `...` with that argument.

```python
>>> add(1, ...)(1) # ... is replaced with 1
2
```

Here is the implementation

```python
import sys
from functools import partial, reduce
from dataclasses import make_dataclass

class Pipe:
    def __init__(self, f, *args, **kwargs):
        self.f = f
        self.args = args
        self.kwargs = kwargs
    def __call__(self, replacement):
        args = [arg if arg is not Ellipsis else replacement
                for arg in self.args]
        kwargs = {k: v if v is not Ellipsis else replacement
                  for arg in self.kwargs}
        return self.f(*args, **kwargs)
    def __rmatmul__(self, other):
        return self(other)

def pipefy(f):
    def wrapper(*args, **kwargs):
        if Ellipsis not in args and Ellipsis not in kwargs:
            return f(*args, **kwargs)
        else:
            return Pipe(f, *args, **kwargs)
    return wrapper
```

The problem here is that you need to call `pipefy` for every function that
you want to work in this way, I want to be able to do this for an entire module,
to do this I wrote this function.

```python
def patch_module(m, f, into, blacklist=[]):
    blacklist = blacklist + 'int str list tuple dict float bool type'.split()
    import importlib
    if m not in sys.modules:
        importlib.import_module(m)
    m = sys.modules[m]
    into = sys.modules[into]
    for k, v in m.__dict__.items():
        if (k[0].islower() and 'Error' not in k and callable(v) 
            and not k.startswith('__') and k not in blacklist):
            into.__dict__[k] = f(v)
```

This function will take a source module as first argument a function
as second, a target module as third and a blacklist as the optinal
last argument. It will replace almost all callables in `m` with the
same callables but with `f` decorator applied to it and will patch
this into the `into` module, usually you pass `__name__` as into
argument. This way other modules will not see the patch. Even not
breaking the other modules it may break your module in someway

```python
>>> patch_module('operator', pipefy, __name__)
>>> patch_module('functools', pipefy, __name__)
>>> map
<function pipefy.<locals>.wrapper at 0x7f03d2d5b7f0>
>>> reduce
<function pipefy.<locals>.wrapper at 0x7f03d278a440>
>>> mul
<function pipefy.<locals>.wrapper at 0x7f03d2788ca0>
>>> add
<function pipefy.<locals>.wrapper at 0x7f03d2788820>
>>> 
```

Almost all the function of these modules are "pipefied" now, the
exceptions are callables that are likely to be a class or an error.
The problem with this is that `is` tests do not work anymore (this is
why I exclude `int`, `str` ... for examble. This is why I try to be
conservative when overriding the functions in `pactch_module` one way
to me extra conservative is to do this in a single module and the
import only the functions that you want from these modules. For
example start to return false (when used to return true).

```python
>>> map
<function pipefy.<locals>.wrapper at 0x7f03d2d5b7f0>
>>> type(map(lambda x: x, [])) is map
False
>>> map = __builtins__.__dict__['map']
>>> map
<class 'map'>
>>> type(map(lambda x: x, [])) is map
True
```

If you pipefy `int` for example this would stop to work `type(1) is int`.

The next thing is to invert the order of the calls we want something like 
`(1) add(2, ...)` instead of `add(2, ...)` so we can compose functions in
the order that they are called. If you paid attention to the `Pipe` class 
it supports the `@` operator (`__rmatmul__` method), with this is just a
matter of chaining with `@`, here is the example from the beginning of the
post.

```python
>>> patch_module('builtins', pipefy, __name__)
>>> patch_module('functools', pipefy, __name__)
>>> patch_module('operator', pipefy, __name__)
>>> list(range(0, 10) @ filter(lt(..., 5), ...) @ map(mul(2, ...), ...))
[0, 2, 4, 6, 8]
```

#### The error monad

I assume that you know what is a monad, if not there are plent of posts about it,
to the matter of this post, the *Error Monad* is a way to abstract the exception
handling in a composable way, so that you can write code that raise exceptions,
but don't have to spread tons of try/catchs everywhere.

To make my point, exception handling is too noisy and too syntax
heavy, in other hand unpacking `Result[T, E]` values are also heavy in
someway when you have to compose them without a monadic operator, also stdlib
and other's people code will not wrap their errors in your result type, they just
throw errors and now that errors are your problem. I want something so
that I can compose multiple function calls in an expressive way and
but that the error handling is still consise, and that work with stdlib
functions.

Here is the `ExceptionMonad` class

```python
class ExceptionMonad:
    blacklist = (AssertionError, NameError, ImportError, SyntaxError, MemoryError,
                 OverflowError, StopIteration, StopAsyncIteration, SystemError, Warning)
    def __init__(self, v):
        self.v = v

    def map(self, f):
        if isinstance(self.v, Exception):
            return self
        else:
            try:
                return ExceptionMonad(f(self.v))
            except Exception as e:
                if isinstance(e, self.blacklist):
                    raise
                return ExceptionMonad(e)

    def join(self, other):
        if isinstance(other, ExceptionMonad):
            return other.v
        else:
            return other

    def flatmap(self, other):
        return self.join(self.map(other))
    
    @staticmethod
    def ret(a):
        return ExceptionMonad(a)

    def __matmul__(self, other):
        return self.map(other)

    def __eq__(self, other):
        if isinstance(self.v, Exception) and isinstance(other, Exception):
            return (type(self.v), *self.v.args) == (type(other), *other.args)
        elif isinstance(self.v, Exception) and type(other) is ExceptionMonad and isinstance(other.v, Exception):
            return (type(self.v), *self.v.args) == (type(other.v), *other.v.args)
        elif isinstance(other, ExceptionMonad):
            return self.v == other.v
        else:
            return self.v == other
```

The idea is that you write functions that are not aware of the error monad, if your
function need to fail it just raises an exception. The error monad catches this exception
and like a result type it will propagate it over map chain calls. For example, here is a
safe subtraction funtion that never returns negative.

```python
@pipefy
def sub(a, b):
    c = a - b
    if c < 0:
        throw ValueError("underflow")
    return c
```

To call it with the error monad you do this

```python
ExceptionMonad.ret(1).map(sub(..., 1))
# or 
ExceptionMonad.ret(1) @ sub(..., 1)
```

`ret` is the monad return function/method it takes a non monadic value and puts in the monadic context
in this case `ErrorException`. Then we call `.map(foo)` where this callable will may throw
an exception. The return value of `foo` is wrapped in another `ErrorException` instance, if `foo`
throws an exception then the exception is catched and wrapped in a `ErrorException` instance too, so
that if we do `.map(foo).map(bar)` and `foo` raises an exception, then `bar` is never called. If
`foo` does not raise an exception then `bar` is called as with the result of `foo`. Again we implement
`@` as an alias for `map`. Here is an complete example:

```python
assert (ExceptionMonad.ret(1) @ sub(..., 1) @ sub(..., 1)) == ValueError("underflow") 
assert (ExceptionMonad.ret(3) @ sub(..., 1) @ sub(..., 1)) == 1
```

Also in this way you can handle native python functions that throw
exceptions. If the functions are not unary you can use `pipefy` do supply the other arguments and to
chose where the missing argument should fit.

By mixing `pipefy`, `ExceptionMonad` and [adt](https://dhilst.github.io/2022/03/27/ADT-in-python.html)
I achieved a great level of expresivity for functional programming in python, enforcing
using imutabilty, purity, composability, etc. The mypy is not always happy with this solutions
but I think is better to have them than not.

The only thing missing I think now is immutable data types like lists and dicts, you can achive this
by using `[a, *args]` or `{**kw, k: v}` forms or update, there is also `frozenset` and the pip library
`frozendict`.

That's it, I hope you liked it, 

Cheers!


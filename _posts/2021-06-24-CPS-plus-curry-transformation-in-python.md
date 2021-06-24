---
layout: post
title: CPS transformation + Curry in python + Piping functions
tags: [CPS, Curry, Python, Pipe, pipe operator]
---

# CPS + Curry + Pipe Operator in Python, this what FP can do for you

Before begin I would like to alert that there is no AST manipulation here. These
are just functions returning functions, calling and being called. The only
class in this code is to make use of `>>` operator as a pipe operator, but
any other operation would because this is simply function transformations.

## WTF is CPS?

First let me clarity what CPS is about. CPS stands for continuation passing style,
in CPS every function has a last argument that is the continuation. The continuation
is _What I do next?_. Instead of simply returning every function as to call it's continuation
and return the continuation results. Talking in code is like this

```python

# this is a normal function

def inc(x):
  return x + 1

# this is a function that receives a continuation. K is
# used on the literature to denote a continuation so I'm
# using it here too
def inc(x, k):
  return k(x + 1)
```

So the idea is simple, instead of simply returning you call a continuation, and then
return.

But there is something still missing. When you're in CPS all functions receive another
function, so you need a function to end the chain. In Haskell is is called `id`. Since
`id` is already a function in Python I named it `id_`. It just return its argument

```
def id_(x):
  return x
```

## WTF is Currying?

The number of argumens that a function receives is called arity. Functions that receive
one argument are called unary functions. It's possible to transform any function on a
chain of functions that receive one argument and return a function that receives the
next argument and so on so forth. Once all arguments are feeded a value is produced. Don't
get "value" to serious here, it's just a way to help you to understand.

So imagine this function

```python

def add(a, b):
  return a + b
```

A curried version would look like this

```python

def add(a):
  def inner(b):
    return a + b
  return inner
```

To call a curried function you can do this

```python

add(1)(2)
```

And it will work as expected.


## Function transformations and decorators

The fun part of decorators is that you can get a function and return another function that
do something similar to what your primary function did but with more behavior. Basically you
can transform functions in another functions.

Transforming a function in CPS is easy, just return a function that
* Has one more argument `k`, that is expected to be a function
* That return as `return k(original_func(original_args))`

Here is a decorator that does just that


```python
def cps(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        k = args[-1]
        return k(f(*args[:-1], **kwargs))
    return wrapper
```

Now currying is more complicated, there are mutiple solutions for transforming a function
into a curried version. The one I take here is using a [EAFP](https://stackoverflow.com/a/11360880/652528)
strategy. We try to call the function with the provided arguments, if it fails we curry the
argument, and so on recursively.


```
def curry(f):
    @wraps
    def wrapper(arg):
        try:
            return f(arg)
        except TypeError:
            return curry(partial(f, arg))
    return wrapper
```

# Puting all together in a crazy way

We can use both transformation to achieve a kind of pipe operator. Here our goal is to
have the continuation argument infixed. Check this out

```python
@curry
@cps
def inc(x):
    return x + 1

@curry
@cps
def double(x):
    return x * 2

assert 6 == inc(1)(inc)(double)(id_)
```


We can use a class to take advantage of operator overload and have this

```python
assert 6 == K() >> inc(1) >> inc >> double >> K.unwrap
```

Crazy huh?

Before you starting to pull your hair "How the hell this works?" here is the full code

```python
from functools import partial, wraps

def curry(f):
    @wraps
    def wrapper(arg):
        try:
            return f(arg)
        except TypeError:
            return curry(partial(f, arg))
    return wrapper

def cps(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        k = args[-1]
        return k(f(*args[:-1], **kwargs))
    return wrapper

def id_(x):
    return x

@curry
@cps
def inc(x):
    return x + 1

@curry
@cps
def double(x):
    return x * 2


assert 6 == inc(1)(inc)(double)(id_)

class K:
    unwrap = object()
    def __init__(self, wrapped=id_):
        self.wrapped = wrapped

    def __rshift__(self, other):
        if other is self.unwrap:
            return self.wrapped(id_)
        return K(self.wrapped(other))

assert 6 == K() >> inc(1) >> inc >> double >> K.unwrap
```

This is the power of functional programming, transforming functions in a way that you can combine
they in crazy ways and still work as expected.

---
layout: post
title: Dependent pairs in Python
tags: [python, dependent types]
---

Is possible to encode dependent pairs (or sigma types) in python
using [TypeGuard](https://mypy.readthedocs.io/en/stable/type_narrowing.html?highlight=typeguard),
abtract classes and subtyping.

Dependent pair is a pair of a value and a predicate about that value, in Coq
is denoted like this `(x : { n : T, P n })`, where `T` is a type and
`P` is a predicate. Using abstract classes, subtyping and type guards
is possible to achieve dependent pairs, here is an example:

```python
from abc import ABCMeta, abstractmethod
from typing import *

class Nat(int, metaclass=ABCMeta):
    @abstractmethod
    def __init__(self):
        pass

def is_nat(x: int) -> TypeGuard[Nat]:
    return x >= 0

def f(x: Nat):
    return x + 1

x = 1
if is_nat(x):
    f(x) # ok

f(1) # mypy: Argument 1 to "f" has incompatible type "int"; expected "Nat"  [arg-type]
```

Here `Nat` is an abstract class, meaning that it cannot be instantiated, trying to
isntantiate it will give a type error:

```python
Nat() # Cannot instantiate abstract class "Nat" with abstract attribute "__init__"  [abstract] [2 times]
```

`is_nat` is a predicate about `x`, `mypy` will check a type guard at
an if condition and refine the type inside the if body, to `Nat`. Because
`Nat` is abstract, so it cannot be instantiated, the only way to call `f`
is by calling `is_nat` first, in an if statement.

Also, because `Nat` is a subclass of `int`, the `x`in `def f(x: Nat)` can be used
in any place that an `int` is expected, so that `x + 1` typechecks.

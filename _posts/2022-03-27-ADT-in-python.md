---
layout: post
title : ADTs (or Sum types) in Python
tags: [functional-prograaming, python]
---

I'm a big fan of ADTs (algebraic data types or sum types) because they
make so easy to model stuff. You split your data in cases and then
do case analysis functions to determine what to do.

It's possible to encode ADT with objects but it's bloatted in someway,
for example the `Maybe` datatype: `data Maybe a = Just a | None`
may be encoded as:

```python
from dataclasses import dataclass
class Maybe: pass

class None(Maybe): ...

class Just(Maybe):
	x: Any
```

I encoded this pattern in a function to construct the dataclasses
for me it works like this

```python
from dataclasses import make_dataclass

def adt(datatype, *ctrs: str):
    basecls = type(datatype, (), {})
    klass = lambda x: x.split()[0]
    fields = lambda x: x.split()[1:]
    clss = (make_dataclass(klass(cls),
                           bases=(basecls,),
                           fields=fields(cls))
            for cls in ctrs)
    return (basecls, *clss)

# Just call the adt function passing the
# constructors. the first is the type constructor
# and the others are data constructors. It will
# return a tuple of the constructors in the same
# order.
Maybe, Just, None_ = adt("Maybe", "Just x", "None_")

# Here's how to use the maybe datatype
just1 = Just(1)
none = None_()

# __repr__ is provided by the dataclass
print(just1) # Just(x=1)

# isinstance relation is preserved
print(isinstance(just1, Maybe)) # True
print(type(just1) is Just) # True
print(type(none) is None_) # True
```

So this is an easy way to encode ADTs in python. But it's not
perfect. You loose the typing, mypy isn't able to guess that
the return values are classes so it will complain that if you
use it as a hint, for example

```
def foo(maybe: Maybe): ... # Variable "adt.Maybe" is not valid as a type
```

I'm always reaching the ceil when trying to do functional
programming in python. I hope I can find a solution for this problem
soon too.

Cheers
```

---
layout: post
title: TCO in Python with exceptions
tags: [python, tco, exception]
---

I was wondering if it would be possible to implement infinite
recursion (TCO) in Python by using exceptions to discard the
intermediary stack frames, and IT IS POSSIBLE!

Here is how, more explanation after the code

```python
class Unwind(Exception):
    def __init__(self, *args, **kwargs):
        self.args = args
        self.kwargs = kwargs


def tco(f):
    unwind = False
    def _inner(*args, **kwargs):
        nonlocal unwind
        if unwind:
            raise Unwind(*args, **kwargs)

        unwind = True
        while True:
            try:
                result = f(*args, **kwargs)
            except Unwind as s:
                args = s.args
                kwargs = s.kwargs
                continue
            else:
                unwind = False
                return result
    return _inner

@tco
def recurse(x):
    if x <= 0:
        return "ok"
    recurse(x - 1)

print(recurse(1001)) # ok
print(recurse(1001)) # ok


@tco
def sum(x, acc):
    if x <= 0:
        return acc
    sum(x - 1, acc + x)

print(sum(1001, 0)) # 501501
```

So, `recurse` is a function that receive an int and calls
itself n times that int. Is well known that python can
only do 1000 nested calls before raising the
`RecursionError: maximum recursion depth exceeded in comparison`
error message. This can be parameterized by [sys.setrecursionlimit](https://docs.python.org/3/library/sys.html#sys.setrecursionlimit)
function, but anyway, if you call `recurse(1000)` with
the default settings (assuming that `@tco` is not applied to it)
you for sure will get the `RecursionError`, the same is for 
`sum` function above, if you try to get the sum of a number
greater than 1000 (without `@tco`) it will fail with the same error.

Languages that do not have tail call optimization (TCO) will
add a stack frame at each function call, each stack frame
spend memory and at some point you ran out of stack, and
if your language keep stack frames in heap you would
get out of memory, or maybe you get an error like `RecursionError` above.

Tail call optimization is a technique where the previous stack frame
is discarded, or reused, so the stack consumption is constant. But for
this to be possible the function call need to be in tail position,
this means that the function call is the last thing the function will
do before return, for exmaple: `return foo(a,b,c)`. In this case we
can discard the current stack frame *BEFORE* calling `foo`.

But how can we do this? Well, is known that exceptions unwind the
stack, so if I can jump from a inner call to the outter while keeping
the inner stack frame information, we can use this as a way to implement
TCO. And this is precisely what `@tco` does.

When we find a nested call we raise `Unwind` exception while passing
to it the current function arguments. This jumps to the previous call,
discarding one stack frame, we override the function arguments an call
it again.

When we dectect no `Unwind` exception it means that the function
reached its stop condition, we reset the `unwind` variable
and return.

That's it, cheers!

---
layout: post
title: Scott Encoding in Python
tags: [lambda-calculus,scott-encoding,python,functional-programming]
---

On LISP world is well known that functions and data are not so distinct entities.
Every LISP program is data and code, at the same time. Other place where this
happens is in lambda calculus, where you have only functions, (closures to
be more precise), and it's still possible to encode data structures. In this post I will talk
about Scott Encoding and show how it works.

We can encoding arbitrary data structures using only functions, I will show an example
with lists but this is also true for trees, maps and even numbers. Let's begin.

_PS: I will use Haskell on the first examples, but you don't need to know Haskell to
follow this post, don't worry, it's just on the beginnig and it will end fast._

[Algebraic data types](https://en.wikipedia.org/wiki/Algebraic_data_type) are something
well know in functional programming world. The ideia is that you define things like this
(in Haskell)

```hakell
data Bool = True | False
```

Meaning that `Bool`, is a type, which have values `True` and `False`. `True` and `False` are
called data construtors but I will call it only construtors here because we'll not use
the type vs value distinction in this post.

Construtors may receive arguments too. For example : `data Foo a = Bar a | Tar`. In this
case the construtor `Bar` receives 1 argument and `Tar` receives 0 arguments. But why
I'm talking about algebraic data types instead of encoding data as functions? Well,
because the encoding that I will show can be used to encode any algebraic data type.

Other things that you can do with algebraic data types is to match then against a
`case` expression (or `match` expression in OCaml and other languages). It works like
this :

```haskell
case foo of
     Bar x -> -- foo is a Bar
     Tar -> -- foo is a Tar
```
So, enough of Haskell, I will show now some python code, with the encoding and will
explain in the remaining of the post.

```python
nil = lambda: lambda cons_, nil_: nil_()
cons = lambda x, y: lambda cons_, nil_: cons_(x, y)

def fold(l, f, acc):
    def not_empty(head, tail):
        return fold(tail, f, f(head, acc))
    def empty():
        return acc
    return l(not_empty, empty)

def test_list():
    l = cons(1, cons(2, cons(3, nil())))
    sum_ = lambda x, acc: x + acc
    to_list = lambda x, acc: acc + [x]
    assert fold(l, sum_, 0) == 6
    assert fold(l, to_list, []) == [1,2,3]
```

If you copy and paste this code to a `foo.py` file and install `pytest`
(I recomed use `python3 -m pip install --user pytest`) you can run it
with `pytest foo.py`. The code is crypt but the idea is simple.

Before dive in the explanation, this encoding is used on lambda calculus
where we only have functions, so basicaly, everything is a function,
the arguments, the data, the iteration, it's okay, it's the function world.

We are going to define a Scott encoding for a list. A list has two construtors:

* `cons` which receives an argument and the tail of the list.
* `nil` which is the list terminator.

So that lists have this structure (in python syntax) `cons(1, cons(2, cons(3, nil)))`,
but as I said, everything is a function so `nil` is function too, so we in fact need to write
it like this : `cons(1, cons(2, cons(3, nil()))))`.

Here we go, the encoding :

1. The idea is that you define a function for each of your constructors, we have `cons`
   and `nil` so we should have two functions too, which I named `cons` and `nil` too,
   because I'm very creative.
2. These functions are our construtors, they will receive as many arguments as our
   construtors do. So `cons` receives two arguments, the element to be put on the
   list and the tail of the list. And `nil` do not receive any arguments, so we
   define it as a function with zero arguments. These are lines 1 and 2 in the code above.
3. Each of the construtors will return a function that takes as many parameters as we have
   constructors. In our case we have two constructors, so each function will receive two
   arguments. You can choose the order arbitrary, but that order need to be consistent
   across all the constructors. Here each construtor will return a function that
   receives two arguments which I named `cons_` and `nil_`. I could name it `cons`
   and `nil`, but I liked to make it clear that these are other functions. I will
   call these the matcher functions, becuse they will do the role of `case`/`match`
   expressions in future.
4. Each matcher function defined at (3) will call one of it's arguments, depeding
   on which of the construtor we are. So if we are defining `nil` construtor and we have `nil_`
   argument in the matcher function, we will call it, since `nil`does not receive any
   argument we will call it with no arguments, like `nil_()`. For `cons` is the same
   but we will call `cons_` with the argument receive by the construtor so `cons_(head, tail)`
   where the constructor is defined as `cons = lambda head, tail: lambda cons_, nil_, cons_(head, tail)`.

Okay, that's it, we did it! But all these functions? How we use this? Well constructing a list
is not that hard, it can be done intuitively as in `l = cons(1, cons(2, cons(3, nil())))`.

The next question is, how we extract data from this list. And the answer is : FUNCTIONS!

Let's think, we called the construtors, each construtor return a fuction that receives two
arguments. So we can extract data from `l` by calling it with two functions, the first one
will be called if the list is *not* empty, and the second function will be called if the
function is empty. So for example

```python
l = cons(1, cons(2, cons(3, nil())))
l(print, print) # 1 <function <lambda>.<locals>.<lambda> at 0x7f5ddb1848b0>
l(lambda head, tail: None, print) # nothing happens, the list is not empty
l(lambda head, tail: print("banana"), print) # prints banana

empty = nil()
print(empty(lambda head, tail: "cat", lambda: "dog")) # prints dog, this list is empty
```

Okay we know how to take the first and second element of the list, and
how to deal with empty lists, we just pass the functions that will be
called on each case. But how we iterate over it? Well in the first
argumment, called by the `cons` case, you will receive the head of the
list and the tail of it, which is another list. You just have to call
the tail again with your functions and you will be iteating over it,
or recursing over it, it's the same thing in this case. So here is
function that print the elements of a list

```python
def print_list(l):
    empty = lambda: None # do nothing
    def not_empty(head, tail):
        print(head)
        tail(not_empty, empty)
    l(not_empty, empty)

print_list(l) # prints 1 2 and 3
```

It's a little weird in the way that it works, but yeah, it works!
Another cool thing you can do with lists is folding then, on
javascript and in other languages this is called _reduce_. Here is how
to define it:

```python
def fold(l, f, acc):
    def not_empty(head, tail):
        return fold(tail, f, f(head, acc))
    def empty():
        return acc
    return l(not_empty, empty)
```

And now you can sum list of numbers with `fold(l, lambda x, acc: x + acc, 0)`
and even convert it to a python list with `fold(l, lambda x, acc: [x] + acc, [])`.
Both of these examples are in the `test_list` function in the code above so you
can play with it.

If you want to know more about Scott Encoding, just Google it or search on YouTube
for "Scott Encoding", you will find plent of source talking about it.

So, this is it! I hope you like it :)

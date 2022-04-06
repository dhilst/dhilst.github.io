---
layout: post
title: Small LISP interpreter in Python
tags: [lambda-calculus, functional-programming, lisp, python]
---

What you can do only with functions? In this post I will show a small
implementation of a LISP like interpreter where it has no data
structures, only functions, and show some examples of how to get
recursion with anonymous functions and lists with it.

First things first, the implementation is here: https://github.com/dhilst/lis.py

It's an small LISP like interpreter wrote in Python using
only the stdlib. Also it's a single file so it should be
easy to grasp it.

First thing is that `lis.py` is strictier that other LISPs.
It's common to write LISP like this: 

```
(foo bar)
(tar zar)
(tick tack toe)
```

And expect the lines to execute in sequence. But in `lis.py` to write
a sequence of expressions and have then executed in sequence you need
to wrap it in a `prog` call, so the above example should be in
`lis.py` like:

```
(prog
  (foo bar)
  (tar zar)
  (tick tack toe))
```

The exception to this rule is the REPL. In the REPL
each line is read and evaluated so you don't need the
`prog` between each line.

In other words, a program is always an expression in `lis.py`, there
no are _"statements"_ so far. So, beside that, everything is pretty
straighfoward.

Now the cool part, FUCNTIONS! Or to be more precise, CLOSURES!

The major construct in `lis.py` is the `lambda`, with it
you can construct closures that captures the environment. The
environment, as you may know, is where the variables live.

So let's show some examples, we have the arithmetic operators builtin,
so to write a function that increments a value we can do:

```
(lambda (x) (+ x 1))
```

Pretty simple huh? And to call this function, as it is expected,
we place it side by side with an argument, so the below
example prints `2` in the REPL:

_To run the REPL just clone the repo and fire `python3 lis.py`_

```
((lambda (x) (+ x 1)) 1)
```

But using anonyous function can become a burden so I added `define`
construct wich defines a global varialbe. The previous example
could also be achieved with (in REPL):

```
(define inc (lambda (x) (+ x 1)))
(inc 1)
```

You can define a recursive function too, so the next example prints
120:

```
(define fact (lambda (x) (if (= x 0) 1 (* x (fact (- x 1))))))
(fact 5)
```

You can call lambda functions recursively too, to do
this there is the `fix` operator. `fix` will receive
a function and a list of arguments and call this function
passing the same function as the last argument. So you can do the
previous example in a single expression like this


```
(fix (lambda (x fact) (if (= x 0) 1 (* x (fact (- x 1) fact)))) 5)
```

If this is too trick here is the same exaple in python

```
def fix(f, *args):
    return f(*args, f)
    
assert fix((lambda x, fact: 1 if x == 0 else x * fact(x - 1, fact)), 5) == 120
```

If you want to now more about fix checkout the [Wikipedia
article](https://en.wikipedia.org/wiki/Fixed-point_combinator#Usage_in_programming).
Or just google "fix point operator" or "The Y combinator" (and skip the
results about the company called with the same name). Please note that
while _fix_ is simple, theorical articles tend to make it looks much
more complicated that it needs to be, the idea is _"you get recursion
by passing the function as argument to it self"_.

What about lists? We don't have lists, but we can recover then using
Scott encoding. I wrote a post about it here
[Scott-encoding-in-pytho](https://dhilst.github.io/2022/03/19/Scott-encoding-in-python.html).
If the next example is too complicated for you read this article about
Scott encoding first then go back here, it should be easier since
there I give all the details of how this works, the code here is
just a translation of the code in the Scott encoding article.

Roughtly speaking the idea is that you break your data type in
constructors and define these constructors in terms of functions. Here
is the example from the `lis.py` source code at `test.lispy`, `ignore`
calls are comments :

```
  (ignore Define the two constructors of our list datatype)
  (define list-nil (lambda () (lambda (cons nil'') (nil''))))
  (define list-cons (lambda (cons nil') (lambda (cons' nil'') (cons' cons nil'))))

  (ignore Define a list)
  (define l (list-cons 1 (list-cons 2 (list-cons 3 (list-nil)))))

  (ignore Define a fold function)
  (define list-fold
     (lambda (l f acc k)
       (let! (empty (lambda () acc))
       (let! (not-empty (lambda (head tail) (k tail f (f head acc) k)))
         (l not-empty empty)))))

  (ignore Fold the list with the + function, basically sum the elemnts
          of the list)
  (assert (= (fix list-fold l + 0) 6))
```

Note that I'm using fix, so this works as well with anonymous function as
it would work with named ones.

In fact I was not even aware that recursive definitions works out-of-box before
writing this article. The `fix` operator was there before the `define`, I
put `define` as a convenience.

But why all this? Well I want something so that I can pratice lambda calculus
where I know that I don't have anything other than functions and that I can easily
tweak, so that I can pratice encoding stuff into functions. Also I think this
is the smaller language possible, we basically only have functions, `if`,
and `fix`. `define`, `ignore`, `progn` and `assert` are conveniences
to make it better to use, but not really critical. Also I have some
bultings like arithmetic, boolean comparison functions and bitwise,
but these are to make easier to check things. On pure lambda
calculus everything are functions, if I use it I would need to check
things like this `(= ((lambda (x) x) (lambda (y) y)) (lambda (y) y))`,
in fact I would not have `=` so it's terrible experience to work with
it.

Seconly, I was on this _"writing programmming"_ languages for some
time, gaining experience, and some years ago this would be full mind-blowing
to me. I tried _Make you a LISP_ and other tutorials about it and all
they go over macros, and all the complications which I think is
important for a real LISP but not so important for grasping the
essence of how interpreters and programming languages works. `lis.py`
is small (but still usable for studying) so that other learners
can read it, tweak it and learn from it.



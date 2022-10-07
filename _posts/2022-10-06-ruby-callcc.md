---
title: Implementing call/cc in Ruby
tags: [callcc, ruby, small-step-semantics, interpreter, continuation]
layout: post
---

call/cc is an Scheme function that make it possible to implement
all sorts of control flows. From loops to generators, try/catch,
green threads, etc. In this post I show a simple implementation
of call/cc and talk a little about small-steps semantics.

The whole code can be found [here](https://gist.github.com/dhilst/0045207251015dbc4908738c122ac51d)

#### Small-step semantics

When you're implementing a interpreter that are some ways to do
it. The most intuitive way is what is called big-step semantics.  You
usually implement an _eval_ recursive function, and use the
meta-language (the language that you're using) stack as the
object-language (the language that you're implementing) stack.

It's called big-step because you focus on going from one expression
to the final result, not minding about the intermeriary results. The
order of evaluation is given by the meta-language.

On other hand, in small-step semantics you care about each intermediary
step, and you define the interpreter as a succecion of each step carefully.

For example, suppose that we have a language with inteters and plus, you
can define big step like this (in pseudo code)

```
eval (plus a b) = eval a + eval b
eval (var x) = lookup x
eval (int x) = x
```

While in smallsteps you need to make it clear each individual step,
so in the `plus` rule you need to define who will be evaluated first, 
the left or right branch of the plus (again in pseudo code)

```
step (plus a b) = plus a' b, where a steps into a'
step (plus v b) = plus v b', where b steps into b', and v is an int
step (plus v v') = v + v', where v and v' are ints
```

The interpreter that I implemented in the gist above uses small-step
semantics.  The `Small` class has a `@expr` instance variable and a
`step` method. Each time that you call `step` the `@expr` changes to
match the next expression that need to be evaluated. The problem with
this approach is that we need some bookkeeping to know what to do next.
For example suppose that I have this `step` implementation. Just to
make it clear, the `v`s above mean a value, a value is something that
cannot be further evaluated, this will be important in the following
code.

```ruby
class Small
   # initialize ..
   
   def step
	case @expr
	when Plus
      if not is_value?(@expr.a)
        @expr = @expr.a
	  end
	end
	self
   end
end
```

After this `step` run with `@expr == Plus.new(1, 2)` we set `@expr` to `1`
but then we forget that we where evaluating a `Plus` in first case. To
handle this we use continuations. The continuation is _what to do next_,
when there is nothing else to do we return, so something like this
(in pseudo ruby) (not tested)

```ruby
  def step
    case @expr
	when Plus
	  if is_value?(@expr.a) && is_value(@expr.b)
	    @expr = Val.new(@epxr.a.value + @expr.b.value)
	  elsif not is_value?(@expr.a)
		@cont = [:plus_b, @expr.b]
	    @expr = @expr.a
	  end
    when Value
	  case cont&.first
	  when :plus_b
	    # continue by evaluating b
		b = cont.second
		cont = [:plus_apply, @expr] # @expr is the evaluated a
		@expr = b
	  when :plus_apply
	    a = cont.second
		b = @expr.value
	    @expr = Plus.new(a, b)
		@cont = nil
      end
    end
  end
```

The idea here is to introduce the idea of a continuation. In this case
the continuation is an array with two elements, the first is a symbol
denoting what the continuation is about, and the second element is a
payload.

So to sum up, with small-step semantics you stop at each evaluation
step. Formally this is presented as a state matchine where the
expression and the continuation are the current state and the _step_ is a
transition, and a definition of a final state.

Now call/cc

#### call/cc

The first time I came across call/cc was while taking a look into scheme
to during the implementation of a lisp in VimL. This was 16 months ago
and at that time I wanted to implement call/cc for my lisp interpreter.

I got stuck.

At that point I didn't had a good intuition to distinguish big-step and
small-step semantics, and all the interpreters that I have written so
far (at that time) were in big-step (but I didn't now that at that point)

The problem that I got is that, by doing big-step, the stack of my
object-language get coupled to the stack of my object-language, and
because of this I couldn't make thinks that deal with the stack, like
tail-call optimization, call/cc etc. Basically I need an explicit
stack, this is the insight here. By decoupling the object and meta-language
stack I can do things in the object language that are not supported
in the meta-language.

Enough introduction, so what is call/cc?

(I really recomend this video : https://www.youtube.com/watch?v=Ju3KKu_mthg )

Don't get mad if you get lost, I get lost too, I think this is
the only thing clear about continuations, you will get lost, it's normal.
Because it's a control-flow primitive (so it defines what to run next)
it's easy to get lost of sight where the code will jump to, so, don't
worry if you lost the track of the execution flow, it's okay, except
if you have to maintain the code, then it's a problem.

_call/cc is a way to save the current stack and use it as a function._

That's it, even if it doesn't make sense. I will explain. The name
call/cc is an abreviation of `call-with-current-continuation` so
what is the _current continuation_? Suppose that you have an expression
like this (in scheme) `(+ a b c d)`, now suppose that `a` evaluates
to `1`, `b` evalutes to `2` and `c` to `3` so you are about to evaluate
`d` you have this `(+ 1 2 3 [you are here])`. The current continuation
is the _what to do next_ in the case is _add 1, 2 and 3_. call/cc will
save the stack and transform it in a function, in literature people call
this _to reify the stack_, so `(+ 1 2 3 [you are here])` becomes
`(lambda (x) (+ 1 2 3 x))`. When calling call/cc you pass to it an
unary function. This function will be called with the current continuation,
so instead of this `(+ 1 2 3 [you are here])`, suppose that you have
this `(+ 1 2 3 (call/cc (lambda (k) ...)))`. Okay, I hope you are still
following. This `k` will be the `(lambda (x) (+ 1 2 3 x)` that we said
before, the reifed stack. If we call the `k` argument for example
`(+ 1 2 3 (call/cc (lambda (k) (k something))))` the whole `(call/cc ...)`
expression is replaced by the argument that you passed. So the trivial
exmaple `(+ 1 2 3 (call/cc (lambda (k) (k 4))))` will evaluate to 
``(+ 1 2 3 4)` which is 10. But how this is control flow? Well, suppose
that you do this instead `(+ 1 2 3 (call/cc (lambda (k) (+ 4 (k 5)))))`.
When the `(k 5)` is evaluated the whole `(call/cc ...` is replaced by 5
so this `(+ 4 ...)` is lost so it evaluates to 11.

Some people call languages with call/cc as having first-class stacks.
In the same way you can have values, and functions and pass them around
you can now do the same thing with stacks.

If it's confusing it's okay. In my opinion coninuatinos are the most
mind-bending concept that I found in computing. Now about the Ruby code.
Open it up, I will explain the code.

The fist lines are the definition of the AST, so we have a simple language
with numbers, variables, addition, functions, application, call/cc and
cont which is used by the call/cc.

The `Small` class implement the small-step semantics. The most important
method is `step`. Each time that it is called it changes the current
state of the object, so the `@expr` and `@stack` variables are updated.
The `@expr` is the current expression being evaluated. The `@stack` holds
two things, it's a list of lists of two elements. The first element is
the continuation as a function. Every time that we need to continue the
computation latter we create a continuation that is a function that rebuilds
the current expression with the missing piece passed as argument.

This is something important, the first element of each _stack frame_
contains a partial AST as a function. We can use this to rebuild the
current continuation by composing these functions together, this is
what the reify function does.

When we call call/cc it reifies the stack, creates a `Cont` and save
it on the environment so it can be referenced in the call/cc body.
The `Cont` works exactly as a lamda the only difference is that it
erases the stack before its body is evaluated, that that it's argument
is the reified stack. So calling the argument is the same as replacing
the whole stack that you had before the call/cc call. That's it.

In the end of the code there is an exmple that is small enough to
put here.

```ruby
s = Small.new(plus(1, plus(2, callCC(:k,
  plus(3, app(:k, 4))))))
puts s.eval # evaluates to 7
```

Inside the `callCC` body we have `plus(3, app(:k, 4))` (app here is for
function application, this expression is the same as `(+ 3 (k 4))` in
scheme. When `k` is called the current stack is erased in the `step` function
in the line 122 `@stack = []` and with it the `(+ 3 ...)` is erased
to. The `k` is the reifed stack `(lambda (x) (+ 1 2 x))` so we have
something like this `((lambda (x) (+ 1 2 x)) 4)` which evaluates to
`(+ 1 2 4)` which is 7.

I hope that this make it more accessible what is happening with call/cc.
There are plenty of information on internet about it but mostly on scheme
or haskell and mostly overly complicated. By presenting this in Ruby, with
a complete implementation, I expect to make it better to understand it.

I recoment these materials about small-step semantics and call/cc in general
these were also my references for implementing this, thanks to the authors

* [https://rolph-recto.github.io/posts/2016-12-26-implementing-callcc.html](https://rolph-recto.github.io/posts/2016-12-26-implementing-callcc.html)
* [https://matt.might.net/articles/cek-machines/](https://matt.might.net/articles/cek-machines/)
* [https://www.youtube.com/watch?v=Ju3KKu_mthg](https://www.youtube.com/watch?v=Ju3KKu_mthg)
* [http://www.madore.org/~david/computers/callcc.html](https://www.youtube.com/watch?v=Ju3KKu_mthg)











  

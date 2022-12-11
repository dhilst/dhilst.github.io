---
layout: post
title: Implementing ADT with macros in Racket using Church encoding
tags: [church-encoding, lambda-calculus, racket, scheme]
---

I was playing with a simple ML like grammar in the past weeks
involving algebraic data types at the form `data <type> = <ctr> <arg0>
... <argn> | ...` I got me asking myself if it would be possible to
compile this to Church encoding so that we have only functions at
evaluation time. I will use option type as example here: `data option
= some x | none` and match expressions as eliminators `match x with |
some x => x | none => 0 end`.

To make my life easier I decided to try this with Racket. If can
define a macro expanding the data definition to function definition
and the match expression to function calls, then for sure I can use
the same strategy to do a tree transformation in the AST to achieve
the same goal. By doing it with Racket macros I don't have to deal
with the AST and evaluation details, it's a perfect tree
transformation prototyping tool, so let's go.

Since Racket is a LISP dialect I will use these forms

```racket
(data option (some x)(none))

(match x
  ((some x) x)
  ((none) 0))
```

Starting with `(data option (some x) (none))` the first step was to
write the expansion by hand and then trying to translate it to a
macro. If you don't know [Church
encoding](https://en.wikipedia.org/wiki/Church_encoding) you can
Google for it as there are plenty of materials on this topic.
Regarding this post, you just need to know that Church encoding is a
way to encode data as functions. The insight is that data will be a
high order function that will receive one callback for each construtor
(in the `option` data type we have two  constructors, `some` and `none`)
and it will call the callback correspoding do the variant that it is.
It's easier to understand with an example, so here
is it for option:

```racket
;; (data option (some x) (none)) should exapands to:
(define (some x) (lambda (some none) (some x)))
(define (none) (lambda (some none) (none)))
```
With `some` and `none` functions defined we can use it like this:

```racket
((some 1)
 (lambda (x) (format "is some ~a" x))
 (lambda () "is none"))
;; outputs "is some 1"

((none)
 (lambda (x) (format "is some ~a" x))
 (lambda () "is none"))
;; outputs "is none"
```

So you can see that the data knows what it is and it calls the
corresponding callback. This already works like a match expression.

It took some time to me to understand how `...` works in the Racket
macros and to be honest I'm not 100% confident of how it works but
I found the macro that I was looking for after lots of trial and error,
here is it.

```racket
(define-syntax data
  (syntax-rules ()
    [(data _ (ctr args ...) ...)
     (begin 
       (define (ctr args ...) (lambda (ctr ...) (ctr args ...)))
       ...
       )]))
```

_I'm not a Racket expert, it took a time to understand that I need `begin`_

Anyway, this works as expected, here are some examples of it in use

```racket
(data option (some x) (none))

((some 1)
 (lambda (x) (format "is some ~a" x))
 (lambda () "is none")) ;; outputs "is some 1"
  
((none)
 (lambda (x) (format "is some ~a" x))
 (lambda () "is none")) ;; outputs "is none"

(data bool (true) (false))

((true) 
 (lambda () "is true")
 (lambda () "is false")) ;; outputs "is true"

((false) 
 (lambda () "is true")
 (lambda () "is false")) ;; outputs "is false"

(data list (cons x tail) (nil))

((cons 1 (cons 2 (cons 3 (nil))))
 (lambda (x l) (format "is cons with ~v" x))
 (lambda () "is nil")) ;; outputs "is cons with 1"

((nil)
 (lambda (x l) (format "is cons with ~v" x))
 (lambda () "is nil")) ;; outputs "is nil"
```

To see the macro expansion we can use this


```racket
(pretty-print
 (syntax->datum
  (expand #'(data option (some x) (none)))))
  
;; '(begin
;;   (define-values (some) (lambda (x) (lambda (some none) (#%app some x))))
;;   (define-values (none) (lambda () (lambda (some none) (#%app none)))))
```

_`#%app` is some specificity of Racket that I don't fully understand, I know that it stands
for application, but not more than that_

Okay, so with `data` working we only need to implement the `match` macro and this
one happens to be simpler.

We want to do this transformation

```racket
;; (match (some 1) ((some x) x) ((none) 0)) should expand to
((some 1) (lambda (x) x) (lambda () 0))
```

And here is it with some examples:
```racket
(define-syntax match
  (syntax-rules ()
    [(match scrutinee ((ctr args ...) body) ...)
     (scrutinee (lambda (args ...) body) ...)]))
     
(match (some 1)
  [(some x) (format "is some ~a" x)]
  [(none) "is none"]) ;; outputs "is some 1"

(match (none)
  [(some x) (format "is some ~a" x)]
  [(none) "is none"]) ;; outputs "is none"
```

You can find the full code [here](https://gist.github.com/dhilst/3920b4da168f85e476be4193db541182)

So to conclude: It's very feasible to have algebraic data types as
syntax sugar for functions.

I know that Church encoding is considered harmful because it has some
performance hit, but I don't care 🤷, it's cool anyway

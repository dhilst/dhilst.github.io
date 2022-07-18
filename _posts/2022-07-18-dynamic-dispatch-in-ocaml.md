---
layout : post
title : Dynamic dispatch in OCaml
tags: [ocaml, dynamic-dipatch]
---

In this post I will show how to implement a `show` function in OCaml with
GADts and existentials and how to recover/implement dynamic dispatch in OCaml.

I've been working with OCaml in the last months. It's a wonderful language,
fully functional with opt-in imperative features. But one thing that I miss
is things being printable by default.

In Haskell we have the `show` function that works almost everywhere and
one the things that we first start looking when coding in OCaml is for some
sort of `show` function. In Python, Ruby etc we usually resort to dynamic
dipatch to work on this, like supporting a method like `__repr__` or `to_s`.

In OCaml we can use GADts with extential types to recover this kind of behavior
but there is a caveat, anyway, here is the code, `contact` function
is where we use the `show` function as it's used in Haskell.

```ocaml
type showable = 
  | Bool : bool -> showable
  | Int : int -> showable
  | Float : float -> showable

(* dynamic dispatch based on an existential *)
let show = function
  | Bool b -> if b then "true" else "false"
  | Int i -> string_of_int i
  | Float f -> Float.to_string f

let print t = print_endline (show t)

let concat s1 s2 =
  show s1 ^ show s2

let () =
  print (Bool true);
  print (Int 1);
  print (Float 2.);
  print_endline (concat (Bool true) (Int 10))
```

The type of `contat` is `showable -> showable -> string`,
preatty neat uh? The problem with this approach is that, while
in OOP or in Haskell we can spread the implementation of `show`
(or whatever) where is conveninent, here we need to extend the
GADT *AND* the `show` function, so it's not very usable.

It *IS* dynamic dispatch in essence because the pattern match
in `show` is done at runtime, so that we can write functions
as `concat` for example.

It's possible to do better with records and modules but this
is a matter for another post, I have to sleep 😅

That's it, cheers!

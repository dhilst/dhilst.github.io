---
layout: post
title: Fuzz testing in Rust
tags: [rust, test]
---

In this post I explain how I used fuzz testing to catch bugs in a date time
parsing library I'm contributing to.

Fuzz testing means testing some system with random input data and iterate over
mutations of that input data in order to find inputs that drive the testing
code to a bug, crash or similar.

As I said I'm contributing to a date parsing library
[uutils/parse_datetime](https://github.com/uutils/parse_datetime) writen in
Rust in order to improve my skills with the language. Before explaing how I did
the fuzz testing let me specify the problem properly:

There is a `fn parse_datetime(&mut &str) -> Result<DateTime<FixedOffset>>`
function. This function should parse a date and return it as a
[chrono::DateTime](https://docs.rs/chrono/latest/chrono/struct.DateTime.html),
or fail. The function should hold compatibility with GNU
core utils `date` command. This means that for every input, the function
succeeds iff GNU core utils `date` succeeds, and return the same date in such
case. In short _forall i: string, parse_datetime(i) = coreutils_date(i)_

The contribution that I'm doing consists of finishing the rewrite of the
library using [winnow](https://docs.rs/winnow/latest/winnow/) as the parser library. The
library was already using fuzz testing but it was using random strings as inputs. The
problem is that almost all random strings are far from valid dates so the inputs do
not really test the implementation.

_To use fuzz testing in Rust you need
[cargo-fuzz](https://github.com/rust-fuzz/cargo-fuzz). I'm not going into the
details here but the ideia is that if you have a type T, you implement the
[Arbitrary](https://docs.rs/arbitrary/latest/arbitrary/trait.Arbitrary.html)
trait for your type. The library
[arbitrary](https://docs.rs/arbitrary/latest/arbitrary) implement the trait for
the primitive types, which let's you instantiate your own structured random input._

What I did was to create a new `struct Input { .. }` type containing all the 
information I have in a date: year, month, day, hour, minute, etc.. Then I implemented
[Arbitrary](https://docs.rs/arbitrary/latest/arbitrary/trait.Arbitrary.html)
for that type. I convert it to string before feeding into `parse_datetime`
and GNU coreutils `date` command and compare the results. In the `Arbitrary`
implementation I can chose how random my inputs will be, for example: I'm
generating days between `[1,31]` and months `[1,12]`. This means that
`2024-02-31` is a possible input for my fuzz test, even being an invalid date.
For the date formatting I'm chosing from a list of possible formats (ex:
`%Y-%m-%d %H:%M:%S`), but I have an idea of splitting the date into tokens,
like `%Y-%m-%d`, then shuffle these tokens and generate a random date string,
this will test the generality of the grammar.

By narrowing how fuzz the inputs I can cover hidden edge cases. Using this
approach I found that
[chrono](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021)
fails to instantiate some dates that GNU date accepts, like `272114-11-10
00:00:00`. I also discovered that 2147485547 is the greater year that GNU date
accepts and that there is a good reason for that:

```
$ date -d '2147485547-01-01' '+%Y'
2147485547
$ date -d '2147485548-01-01' '+%Y'
date: invalid date ‘2147485548-01-01
```

[Year 2038 problem](https://en.wikipedia.org/wiki/Year_2038_problem) is the
reason. Summing up dates are represented with 32 bits integers and well, there
are only 32 bits, at some point you always runs out of bits.

I doubt I would be able to find these edge cases if weren't by the fuzz testing.
The approach was so good that found subtle bugs in days and now is clear that
chrono is getting in the way: `parse_datetime` requires compatibility to GNU
but `chrono` is not GNU compatible 🤡

Maybe we have to implement yet another calendar arithmetic library 😎 in Rust, I
can't wait 

So summing up I really loved fuzz testing, it is amazing I'll try more with it
in the future.

References:

- [https://docs.rs/chrono/latest/chrono/](https://docs.rs/chrono/latest/chrono/)
- [https://github.com/winnow-rs/winnow](https://github.com/winnow-rs/winnow)
- [https://en.wikipedia.org/wiki/Year_2038_problem](https://en.wikipedia.org/wiki/Year_2038_problem)
- [https://github.com/uutils/parse_datetime/pull/86](https://github.com/uutils/parse_datetime/pull/86)
- [https://github.com/uutils/coreutils](https://github.com/uutils/coreutils)



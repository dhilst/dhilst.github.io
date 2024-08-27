---
title: Why use Rust? A simple Regex parser example
layout: post
tags: [rust, parser]
---

In this post I show why I would chose Rust over other languages for a project
in present date. I do this by using a library for parsing dates as example,
exposing strong points of Rust in a real example instead of speaking
abstractly.

Before starting let me state the problem properly: 

*We want to parse strings into dates. The strings will be assumed to be a list
of data elements separated by spaces. No special token order is assumed, the
parser has the freedom to guess the meaning of a token based on the previously
read tokens and heuristics*

Here are some examples to give us one idea of what we want to achieve, we're
going to write the `parse` function.

```rust
fn main()
{
    println!("{:?}", parse("2024-12-31"));
    println!("{:?}", parse("12312359"));
    println!("{:?}", parse("Dec 31 2024"));
    println!("{:?}", parse("Dec 31 +1 day 2024"));
    println!("{:?}", parse("11111111"));
    println!("{:?}", parse("Jul 18 06:14:49 2024 GMT"));
    println!("{:?}", parse("@1690466034"));
    println!("{:?}", parse("@1735689599"));
}
```

*A side note here, what I'm calling parsing is mostly called "lexing" or
"tokenizing" in most compiler-related contexts. Parsing implies an AST but we have
no AST here* 

Let's start by opening the required libraries and creating
a struct to hold a regex.

*Note: You can check the code here: [play.rust-lang](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=1192e2413659f80e6e0de8eb1f73ce59)*

```rust
use regex::Regex;
use chrono::{Duration, DateTime, Datelike, Timelike, Utc};
use std::error::Error;


type Result<T> = std::result::Result<T, Box<dyn Error>>;


struct RegexParser {
    regex: Regex,
}
```

I then implement a new method for `RegexParser`

```rust

impl RegexParser {
    fn new(input: &str) -> Result<RegexParser> {
        Ok(RegexParser {
            regex: Regex::new(input)?,
        })
    }
```

This will permit me to allocate a new Regex and fail safely if required.

Then I have the `.action` method that works like *semantic action* as in parser
libraries. `.action` returns a closure that will be called with the tokens
`&str` to be parsed. `.action` will also receive a closure that will be called
with an array of strings `[&str; N]` (result of [regex::Captures.extract](https://docs.rs/regex/latest/regex/struct.Captures.html#method.extract))
and return a `Result<T>`. The type returned by the semantic action
will be the return type of the parser constructed. The only requirement is that
the regex has at least one capture group

Here is the method:

```rust
    fn action<'a, T, const N: usize>(
        self,
        map: impl Fn([&'a str; N]) -> Result<T>,
    ) -> imply Fn(&'a str) -> Result<T> {
        move |token: &str| {
            self.regex
                .captures(token)
                .ok_or(Box::<dyn Error>::from("Expecting {self.regex} found {token}"))
                .and_then(|c| map(c.extract::<N>().1))
        }
    }
} // closes impl RegexParser
```

Let's see an example, if we want to parse a number we can do something like
this:

```rust

fn foo() -> Result<()> {
   let parse_num = RegexParser::new(r"(\d+)")?
        .action(|[n]| n.parse::<i32>().map_err(|e| Box::from(e.to_string())));

   let n: i32 = parse_num("1")?;
   assert_eq!(n, 2);
   
   Ok(())
}
```

In this example `parse_num` is a parser that returns an `Result<i32>`. This
the type comes from the type of the action. This code is overflow-safe because
`.parse::<i32>()` will return `Err` if the value read overflows `i32`. The
`RegexParser` ownership is captured by `.action` so all the memory (the `regex`
and the closure itself) is kept with the caller of `.action` method, the
regex is compiled only once and the parser can be called multiple times before
the regex is freed.

Also, by making the result of `.action` generic, the return type can be decided
by the action, which adds a lot of flexibility to the user. We returned a simple
`i32` but we can return a tuple for example:

```rust
   let parse_triple = RegexParser::new(r"(\d)(\d)(true|false)")?
        .action(|[a, b, c]| Ok((
            a.parse::<i32>().unwrap(),
            b.parse::<i32>().unwrap(),
            c.parse::<bool>().unwrap(),
        )));

   let (a, b, flag): (i32, i32, bool) = parse_triple("00false")?;
   assert_eq!(a, 0);
   assert_eq!(b, 0);
   assert_eq!(flag, false);
```

The generic return type `Result<T>` for any `<T>` is extremely helpful, and
combined with `?` operator it makes it simple to compose parsers. These `unwrap`s
are safe because of the size of the matches in this special case. But since
the action returns `Result<T>` we can handle error cases in the semantic action
too, like we did for `i32`.

To sum up, the chained call `.new` `.action` binds a regex with a semantic
action and determine the return of the resulting parser, allocating the
necessary memory, and moving it to the caller.

With these in hand, it is easy to make a bunch of parsers for parsing dates,
here I'll be using an optimistic approach. The parser will iterate over the
tokens, and accumulate a state. When all the tokens were read the accumulated
state is returned. The input is assumed to be space separated of tokens, the
tokens will be parsed individually and the state will be accumulated during the
iteration.

```rust

// The parser state will accumulate Some(..)s during the iteration
#[derive(Default, Debug)]
struct ParseState {
    year: Option<i32>,
    month: Option<i32>,
    day: Option<i32>,
    hour: Option<i32>,
    minute: Option<i32>,
    second: Option<i32>,
    relatives: Vec<Duration>,
}
```

To parse the dates we create the parsers in the scope, and split the input (a
string at this point) into tokens. We iterate through the tokens, looking at
most one token ahead if required (by using `Peekable`). We do this in a `parse`
function which will own the memory used by the parser. The function returns the
state, on return the parsers created go out of scope and are deallocated.

In the `parse` function I initialize a set of parsers, a default state,
the iterator and the starting iterating over the tokens.


```rust
fn parse(input: &str) -> Result<ParseState> {
    let mut parse_state = ParseState::default();
    let parse_i32 = RegexParser::new(r"^\+?(\d{1,9})$")?.action(|[n]| {
    // more parsers ...
    let mut iter = input.split_whitespace().peekable();
    while let Some(token) = iter.next() {
	// parser code
```

For each token, we try the parsers in some order, but only if some field of the
state is absent. After iterating over all the tokens the state is returned.

```rust
    // initialization 
    while let Some(token) = iter.next() {
        if let (None, Ok((mm, dd, hh, mm_, yyyy))) = (parse_state.hour, parse_mmddhhmmyyyy(token)) {
            parse_state.hour = Some(hh);
            parse_state.minute = Some(mm_);
            parse_state.month = Some(mm);
            parse_state.day = Some(dd);
            parse_state.year = Some(yyyy);
        } else if let (None, Ok((mm, dd, hh, mm_))) = (parse_state.hour, parse_mmddhhmm(token)) {
            parse_state.hour = Some(hh);
            parse_state.minute = Some(mm_);
            parse_state.month = Some(mm);
            parse_state.day = Some(dd);
        } else if let (None, Ok(ts)) = (parse_state.minute, parse_epoch(token)) {
  ```

We can see now how the parsing advances. `parse_state` will be all `None`s at the beginning. When
a parser function matches a token it will update the `parse_state` fields. In some
cases reading one token gives us a clue about the next token's meaning. For example, in
`Jul 21`, after reading a month `"Jul"` if the next token is a number it is
interpreted as the day.

If we want to parse two tokens in sequence we can do something like this,
(assuming `-> Result<T>` context).

```rust
    let month = parse_month(tokens.next()?)?;
    if let Some(day) = parse_number(tokens.peek()?) {
	parse_state.day = Some(day);
```

Note that I'm using `peek` method here to get the next value in the iterator
without moving it forward. This means a lookahead of at most 1 token at a time.
Since our iterator is not capable of backtracking, and it cannot look more than
one value ahead in the iterator we guaranteed constant worst-case complexity.
This means that some grammar will not be expressible, but it is enough for our
cases where the tokens do not form trees. It is still possible to use recursive
descendent with `RegexParser` but you need an iterator more powerful than
what we're using there to control the backtracking.

The end of the `parse` function:

```rust
    eprintln!("{parse_state:?}");
    Ok(parse_state)
}
```

We can test multiple dates then:

```rust
fn main() {
    println!("{:?}", parse("2024-12-31"));
    println!("{:?}", parse("12312359"));
    println!("{:?}", parse("Dec 31 2024"));
    println!("{:?}", parse("Dec 31 +1 day 2024"));
    println!("{:?}", parse("11111111"));
    println!("{:?}", parse("Jul 18 06:14:49 2024 GMT"));
    println!("{:?}", parse("@1690466034"));
    println!("{:?}", parse("@1735689599"));
}
```

And see the results

```
ParseState { year: Some(2024), month: Some(12), day: Some(31), hour: None, minute: None, second: None, relatives: [] }
ParseState { year: None, month: Some(12), day: Some(31), hour: Some(23), minute: Some(59), second: None, relatives: [] }
ParseState { year: Some(2024), month: Some(12), day: Some(31), hour: None, minute: None, second: None, relatives: [] }
ParseState { year: Some(2024), month: Some(12), day: Some(31), hour: None, minute: None, second: None,
	relatives: [TimeDelta { secs: 86400, nanos: 0 }] }
ParseState { year: None, month: Some(11), day: Some(11), hour: Some(11), minute: Some(11), second: None, relatives: [] }
ParseState { year: Some(2024), month: Some(7), day: Some(18), hour: Some(6), minute: Some(14), second: Some(49), relatives: [] }
ParseState { year: Some(2023), month: Some(7), day: Some(27), hour: Some(13), minute: Some(53), second: Some(54), relatives: [] }
ParseState { year: Some(2024), month: Some(12), day: Some(31), hour: Some(23), minute: Some(59), second: Some(59), relatives: [] }
```

[play.rust-lang](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=1192e2413659f80e6e0de8eb1f73ce59)

Rust gives us control over memory allocation and has an amazing type system. It lets
us programmers reason about the lifetime of our memory resources and decide
how much they live and where/when they are released. While this is a lot of power is
also a lot of responsibility, the programmer has to keep track of the
lifetimes, something completely new(!?) when coming from other languages.

In the regex parser example, being able to decide the parser return
type by the semantic action and also being able to choose where the
memory for the parsers should live and when they are deallocated are
good reasons for me doing this in Rust. Also, the parser has a predictable
efficiency due to controlled backtracking. All these are good arguments in
favor of Rust. The downside is that the language is complex and it requires
some time to get productive with it, it is not a simple language. But
with some effort it is possible to understand it, is up to the developer
to decide. I think the hard learning curve gets paid in the end when
we finally achieve predictable/automatic memory management.

My mistake while trying to learn Rust for the first time was to try to avoid
lifetimes at all costs and never try to understand them for real. Here are
the top things about lifetimes I keep in mind while coding in Rust today:

* Lifetimes track scopes of a variable
* Lifetimes are type generics: `<'s, 'b>` *(small, big)*
* Lifetimes can be a subtype of another lifetime, `<'s, 'b: 's>`. The
  meaning of this is `'b` completely contains `'s` *(big completely contains small)*.
* Lifetimes are subject to variance, by being used in *covariant*,
  *contravariant* and *invariant* positions.
* `'static : 'a` holds for any `'a`
* Lifetimes variance are used during function application. For example if you
  have a function that receives `&'a str` reference, since `'static : 'a`  holds
  we know that `&'static str : &'a str` holds for that function, if we call
  that function with `&'static str` argument, which is a subtype of `&'a str`, 
  the call type checks.
* The intuition is: If the function can handle arguments with `'a` lifetimes, and
  `'static` completely contains `'a`, any reference valid in `'a`, will be valid
  in `'static`.
* The variance can make lifetimes complex but lifetime is at the core of Rust's
  killer feature, the borrow checker. I strongly believe that mastering Rust
  is mastering the borrow checker and that the lifetimes are a central part
  of it.

So if **any** of these is good for you, then Rust is a good choice, you may
take the project requirements into consideration for each case:

* Memory allocations and deallocations should happen at known places
* Type safety
* Native performance 
* Lightweight 
* Robustness 
* Fine Control
* Performance
* Easy deploy

If otherwise you don't care for these points other languages may suit you better 

* If you don't care about memory allocations
* Type safety does not matter
* Performance does not matter
* I want to fast prototype
* I don't like compilers
* Fast iteration, breaking changes
* Single thread 

I strongly believe Rust is a future-proof language because it gives us all the
features we require, the combination of an amazing type system and the borrow
checker is sufficient, for writing efficient, memory-safe programs.

References: 
- [play.rust-lang](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=1192e2413659f80e6e0de8eb1f73ce59)
- https://docs.rs/chrono/latest/chrono/
- https://doc.rust-lang.org/nomicon/subtyping.html

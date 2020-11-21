---
layout: post
title: Typed primitives in C#
tags: [c#, dotnet]
---

I have a problem with functions with the form `F(a: STRING, b: STRING)` where I swap a and b
and only discover the problem latter on with a runtime error. I had this with ints too, where I
was passing the id of the wrong table, and it was a mess to findout what was happening.

When you're programming with a dynamic typed language like Python and Ruby, having type errors at
runtime is something that happens frequently. But when you using a statically typed language is very
frustrating to commit this kind of error.

Some months ago I was rewriting a critical part of a program in Rust becase I want it to be checked
as much as possible, and I fall in this error of swappings arguments in a `F(STRING, STRING)` function.
Frustrating.

In the case of the wrong Id, it was C# that is a language that I was using in production daily and it was
also frustrating to have this kind of stupid error in production. To be more precise we're using Dapper.
There was a query like this `connection.QueryAsync<Employ>("SELECT * FROM employ JOIN another_table") and
for some reason the first column was the `another_table.id` which was filled on Employ.Id and things exploded
and then another query was not finding the employ. Luckly because otherwise the error would be propagated furter.

This is particularly known problem in programming with strings. With ints was the first time that I had this
problem. If you search for strong typed strings you will find a lot of material, I left my ideas here of
what I can do (I'm not applying this yet in production) in C# to solve this.

I tried a subtyping approach at first but I can't subtype int in C# so I tackled the problem with another approach

Stop talking, here is the code

{% gist 54770ee833806c330cde849fcbb3e82c %}


The idea is to have a generic class that wraps the primitive and a implicity conversion to the primitive type. This
way we can use it in whatever place it need to be used as a primitive, like libraries and such things. Inside your
code we strongly type it as the class name and this is enough to avoid swaping errors.


I hope that this helps. I would like to achieve this with subtyping so it's more generic than depending on implicity
conversions.

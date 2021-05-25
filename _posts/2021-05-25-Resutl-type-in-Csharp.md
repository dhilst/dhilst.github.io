---
layout: post
title: Resutl<T,E> type in C#
tags: [c#, csharp]
---

Result type is an specialization is used in Rust for carrying
computations that can fail. It's a sum type/enum type that
has two variants `Ok` and `Err`. It's an alternative for exceptions
that don't change the natural calling/return control flow.

Here is the class

```cs
#nullable enable
using System;

public abstract class Result<T, E>
{
    Result() { }

    public sealed class Ok : Result<T, E>
    {
        public readonly T Value;
        public Ok(T ok) => Value = ok;
    }

    public sealed class Err : Result<T, E>
    {
        public readonly E Error;
        public Err(E err) => Error = err;
    }

    public Result<T2, E> Map<T2>(Func<T, T2> func) => this switch
    {
        Ok _this => new Result<T2, E>.Ok(func(_this.Value)),
        Err _this => new Result<T2, E>.Err(_this.Error),
        _ => throw new Exception("Unreachable"),
    };

    public Result<T, E2> MapErr<E2>(Func<E, E2> func) => this switch
    {
        Err _this => new Result<T, E2>.Err(func(_this.Error)),
        Ok _this => new Result<T, E2>.Ok(_this.Value),
        _ => throw new Exception("Unreachable"),
    };

    public Result<T2, E> Bind<T2>(Func<T, Result<T2, E>> func) => this switch
    {
        Ok _this => func(_this.Value),
        Err _this => new Result<T2, E>.Err(_this.Error),
        _ => throw new Exception("Unreachable"),
    };

    public Result<T, E> Map(Func<T, T> func) => Map<T>(func);
    public Result<T, E> MapErr(Func<T, T> func) => Map<T>(func);
    public Result<T, E> Bind(Func<T, Result<T, E>> func) => Bind<T>(func);
}
```

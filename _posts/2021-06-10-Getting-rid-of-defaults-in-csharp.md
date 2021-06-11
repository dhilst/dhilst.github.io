---
title: Getting rid o defaults in C#
tags: [csharp, reflection]
layout: post
---

C# has reference and value types. Reference types defaults to `null`
but value types has each one it's own default. If you have the type
in hand you can generate a default with `defaul(T)` or usully just `default`.

The problems with value defaults are they are anoying when you're dealing
with APIs and databases. Before going further let'me explain.

PS: I'll be talking a lot of extension methods if you don't know it [you
should](https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/classes-and-structs/extension-methods)! Also

So, ..., I'm using [Dapper](https://github.com/DapperLib/Dapper) at work and Dapper
let you do queries like this:

```csharp
connection.Query<Foo>("SELECT * FROM foo WHERE id = @id", new { id });
```

You can use anonymous objects to pass parameters to your class and this is very
handy. But it's common to have a full object and trying to save it in the database
like this.

```csharp
public class Foo
{
    public int Id { get; set; }
    public string Something { get; set; }
}

public class FooRepo
{
    public Create(Foo foo, IDbConnection conn) =>
        conn.Execute($@"
            INSERT INTO foo
            (Id, Something)
            VALUES
            (@Id, @Something)", foo);
}
```

And as Foo increases in fields this query become tedious to do. There is a saying in
tech industry that, if you don't use an ORM you'll endup writing one. Soooo ... what if
I want a generic create? It would not be hard to do it right? Let's see:

```csharp
public static class Extensions
{
    public static void Create<T>(this IDbConnection conn, string tableName, T obj) =>
      conn.Execute($@"
        INSERT INTO {tableName}
        (obj.Columns())
        VALUES
        (obj.ColumnsPlaceholders())
        ", obj);

    public static string Columns(this object this_) =>
      this_.GetType()
        .GetProperties()
        .Select(p => p.Name)
        .Join(",");

    public static string ColumnsPlacehodelrs(this object this_) =>
      this_.Columns.Select(x => $"@{x}").Join(",")

    public static string Join(IEnumerable<string> this_, string sep) =>
      string.Join(sep, this_);
}
```

The problem with this approach is that `conn.Save<Foo>("foo", new Foo {});` will
initialize `Id` with 0 and try to save it in the database. Reference types are null
by default so is easy to filter them in `Columns()`


```csharp
    public static string Columns(this object this_) =>
      this_.GetType()
        .GetProperties()
        .Where(p => p.GetValue(this_) != null)
        .Select(p => p.Name)
        .Join(",");
```

But this will not save you from `0`s in `Id`. To make things worse `DateTime` is a
value type too. So you're it's not safe to assume that value types will be only bools
and ints. I knew abvout the `default` keyword so my first attempt was this

```csharp
    public static string Columns(this object this_) =>
      this_.GetType()
        .GetProperties()
        .Where(p => p.GetValue(this_) != default(p.PropertyType))
        .Select(p => p.Name)
        .Join(",");
```

But this doesn't work because `default(T)` need a `T` at compile time. So how to do it?

Today I found the solution for this and the bad news is that this should not be fast. But
we're full of reflection already anyway so whatever, to test for a default value I instantiate
a the type with the parameterless construtor and test with `.Equals`.

```csharp
    public static string Columns(this object this_) =>
      this_.GetType()
        .GetProperties()
        .Where(p => p.GetValue(this_) != null &&
            // Here is the test
            !p.GetValue(this_).Equals(p.PropertyType.IsValueType
              ? Activator.CreateInstance(p.PropertyType) // <- I instantiate a "default" object here
              : null // This is needed for reference types))
        .Select(p => p.Name)
        .Join(",");
```

This will filter all columns that are not initialized so you can use the initializer syntax
and still filter the undesired zeros and nulls. This can be extended, for example, here
is how to create a dictionary from an object ommiting unitialized fields.


```csharp


        public static IEnumerable<PropertyInfo> ExcludeDefaults(this IEnumerable<PropertyInfo> this_, object o) =>
            this_
            .Where(p => p.GetValue(o) != null && !p.GetValue(o).Equals(p.PropertyType.IsValueType
                        ? Activator.CreateInstance(p.PropertyType)
                        : null));

        public static Dictionary<string, object> ToDict(this object this_) =>
            this_
                .GetType()
                .GetProperties()
                .ExcludeDefaults(this_)
                .ToDictionary(k => k.Name, v => v.GetValue(this_));
```

This time I abstracted ExcludeDefaults in it's own extension method so I can reuse it wherever
I want.

I hope that this can be useful to you as is being to me.

Cheers.

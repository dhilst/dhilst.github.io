---
layout: post
title: Phatom types in C#
tags: [csharp, c#, phatom types]
---

You can use phatom types to secure your API, creating type
safe indentifiers (like ints or strings). _dotnet_ will not
erase phaton types, so you will endup with a boxed type for
a primitive, anyway is a cool trick to have on sleave.

Here is how:

```csharp
namespace lsharp
{
    // This is a "typed int" you can use with a type parameter
    // to explicify what "type of int" this would be. This is
    // particularly useful for type safe ids and I use this
    // as example in this case.
    public class Int<T>
    {
        int Val;
        public Int(int i) => Val = i;
        public static implicit operator int(Int<T> i) => i.Val;
        public static Int<T> From(int i) => new Int<T>(i);
    }

    // These are two classes, each has it's own "type of id" this
    // is useful for passing to methods that would only accept a
    // "one kind of" id
    public class Customer { public Int<Customer> Id { get; set; } }
    public class User { public Int<User> Id { get; set; } }
    public class Account { public Int<User> UserId { get; set; } }

    public class Program
    {
        // These are methods accepting a specific kind of
        // id. This will catch type errors as you can't
        // supply an User.Id to FindCustomer for example,
        // it won't type check
        public static void FindCustomer(Int<Customer> i) { }
        public static void FindUser(Int<User> i) { }
        public static void ReceivesInt(int i) { }

        public static void Main(string[] args)
        {
            var user = new User() { Id = Int<User>.From(1) };
            var customer = new Customer() { Id = Int<Customer>.From(1) };

            FindCustomer(customer.Id); // Type checks
            FindCustomer(user.Id);     // Doens't type check
            FindCustomer(1);           // Doens't type check

            // We'll need to call other libraries from our code
            // the types can be implicity converted to ints, but
            // on our application we use Int<T> to secure the
            // interface boundaries.
            ReceivesInt(user.Id);      // Type checks
            ReceivesInt(customer.Id);  // Type checks
        }
    }
}
```

Cheers

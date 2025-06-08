---
title: "Understanding Type Erasure: Solving Generic Programming Challenges in C++"
date: 2025-06-08
categories: [cpp, programming, type-erasure, generics]
---

Generic programming in C++ often requires carrying type information through
function signatures or data structures. This can complicate interfaces and
usage when the exact types are not known at compile time or when they vary. One
common challenge is how to write code that can accept and operate on
heterogeneous types without exposing those types explicitly to every caller.

This blog post explains the problem and demonstrates how **type erasure** can
help manage this complexity, allowing generic values to be stored and passed
around without the caller needing to know their concrete types.

## The Problem: Carrying Types Through Callers

Consider a templated class or function that operates on a generic type `T`:

```cpp
template <typename T>
void process(T value) {
    // do something with value
}
```

Every caller of `process` needs to know the type `T` at compile time. If you
want to store or pass these values through interfaces or containers without
exposing `T`, you end up needing to carry that type information throughout your
codebase. This complicates the API and often leads to heavy use of templates,
which increases compile times and code bloat.

The question arises: **Is there a way to store and operate on generic values
without exposing their types to the caller?**

## Type Erasure: Hiding Types Behind a Uniform Interface

Type erasure is a technique that **hides the concrete type** of an object
behind an abstract interface. This allows you to store and manipulate objects
of different types through a common API, without the callers needing to know
the actual types involved.

The basic idea involves:

- Defining an abstract interface (a concept) with virtual functions.
- Implementing concrete models templated on the actual types.
- Storing pointers to the abstract interface, erasing the concrete type
information.

## Example: TypeErased Wrapper

Below is an example demonstrating type erasure in C++:

```cpp
#include <iostream>
#include <memory>

namespace typeerasure {

struct TypeErased final {
    template <typename T>
    TypeErased(T value)
        : m_self(std::make_unique<Model<T>>(std::move(value))) {};
    void print() const {
        m_self->print();
    }
private:
    struct Concept {
        virtual void print() const = 0;
        virtual ~Concept() = default;
    };
    template <typename T>
    struct Model : Concept {
        T value;
        Model(T v) : value(std::move(v)) {}
        void print() const override {
            std::cout << value << '\\n';
        }
    };
    std::unique_ptr<Concept> m_self;
};

void test() {
    // TypeErased does not carry its template parameter around
    TypeErased foo1 = 43;
    TypeErased foo2 = std::string("Hello");
}

// No need for carrying out the generic type parameter
void acceptsFoo(const TypeErased& foo)
{
}

} // namespace typeerasure
```

Explanation:

- `TypeErased` is a non-templated class that internally holds a pointer to an
abstract `Concept`.
- The `Concept` interface defines the operations available (here, `print()`).
- The `Model<T>` template implements `Concept` for any concrete type `T`.
- When constructing a `TypeErased` object, a `Model<T>` is created dynamically
with the concrete value.
- The caller only interacts with `TypeErased` objects through the uniform
interface, without needing to know the underlying type.

This design allows code to store and pass generic objects without templates or
type parameters appearing in the public API.

## Benefits of Type Erasure

- **Simplified APIs:** Callers use a uniform interface without template
parameters.
- **Runtime polymorphism:** Different types can be stored and handled
uniformly.
- **Reduced compile-time dependencies:** Templates and their instantiations are
limited to internal implementation.

## Conclusion

Type erasure is a powerful technique for managing generic programming
challenges in C++. It lets you abstract away type details behind a common
interface, reducing complexity for callers and improving code flexibility.

The example above shows a minimal implementation of type erasure, focusing on a
`print()` operation. This pattern can be extended to other use cases requiring
runtime polymorphism without exposing type details.

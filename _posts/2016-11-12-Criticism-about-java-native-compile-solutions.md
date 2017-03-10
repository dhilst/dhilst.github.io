---
layout: post
title: Criticism about java native compilation tools
tags: [java, ant, maven, cross-compilation, JNI]
---

I've been researching about java native compilation tools and found two
options. Maven with [nar-maven-plugin](http://maven-nar.github.io/) or
[gradle](gradle.org). The problem about those two is that they try to be better
than they should.

Both tools give us support for compiling native code in a Java way. The problem
is that they try to figure out automagically the compiler and linker that they
should use. This works magically for host compilation but its a disaster for
cross compilation.

Trying to know every possible compiler for every possible platform becomes an
exponential explosion problem when cross compilation enters the game. In the
eagerness to be so smart these tools have to work with some expectations, and
these expectations become a big **FALSE** with cross compilation. In fact these
tools depend on compiler names and this is an encapsulation problem. I've been
looking at nar-maven-plugin code and it has "gcc" name hardcoded. I can setup
AOL bits, or mess up with pom. But this means that to compile for X platform
I need to tweak for X, while compiling for Y need tweaks for Y. This makes me
wonder why `CC` and `CXX` where invented if people don't use them?

It is ironic how the *damn nasty make* behaves nice with cross compilation just
because it doesn't try to make more than it's work. Running recipes based on
prerequisites to create targets. The compiler is deducted from environment
variables and everything works fine with compilation tool not depeding on
compiler. This is the beauty of simplicity my friends. Setting up tool chain
is, usually, a simple matter of sourcing some file.

Another example of this *guessing curse* is the python extension compilation
tools. It tries to guess compilation details from the python interpreter. More
specific, when the interpreter is compiled some data about the compilation is
saved on it self. When you compile some native extension with
[setuptools](https://setuptools.readthedocs.io/en/latest/) it use this
information to guess extension compilation bits. The result is obvious. It
fails with cross compilation. This is so true that the [Yocto](yocto.org) guys
had to hack python so that native extensions could be compiled with easier.

The problem is simple. Compilation logic and targeting has nothing to do
one with another. Changing the target *SHOULD* be a matter of changing
the called compiler. Making targeting depending on build files (being pom.xml,
build.gradle or setup.py) only serve to make crosscompilation a headache.

But still I have to admit something. While make is a simple recipe parser
these tools are more about packaging than compiling it self. There is no Java
or python cross compilation. This is an C and C++ problem. I'll keep studying
these guys and try to be more apprehensible about their aproaches. Maybe I
came back here, and append to this post some solutions I found. Maybe not.

Cheers,

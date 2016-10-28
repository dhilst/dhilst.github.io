---
layout: post
title: JNI Native Threads
cateogories: programming, java, JNI, c
tags: java, JNI, c, linux, programming
---

Hey everybody!

In this post I will show you how to use native threads
with Java. If you follow the previous posts you may have
noted that each native method comes with a JNIEnv pointer
and that pointer is used to access JNI's vtable. The
JNIEnv attaches the native call to the Java's thread. The
problem calling Java function from native threads is that
you don't have a JNIEnv to use, so how to proceed?

First you need a pointer to the JVM, of the `JavaVM *`.
With this pointer in hands you can call `AttachCurrentThread`
to initalize a `JNIEnv` variable. Okay, but now, how
to obtain the `JavaVM *` pointer. 

There are two functions that you can implement and that
are called each time that the JVM is load or unload. They are
`JNI_OnLoad` and `JNI_OnUnload` respectively. The last one
will not be used at this example.

So now we have a full picture.
1. Implement `JNI_OnLoad`.
2. Save `JavaVM *` pointer.
3. Call `AttachCurrentThread` to initialized one `JNIEnv **`.
4. Call any JNI function using that `JNIEnv **` pointer.
5. Call `DetachCurrentThread` to detach the previously attached thread.

The details can be grasped from the example code above. The comments
provides further guidance. Take a look:

{% gist https://gist.github.com/gkos/31cc7d04bbe3659beeb9321309e77db2 JNIThread.java %}
{% gist https://gist.github.com/gkos/31cc7d04bbe3659beeb9321309e77db2 libjnithread.c %}
{% gist https://gist.github.com/gkos/31cc7d04bbe3659beeb9321309e77db2 Makefile %}

Cheers :+1:

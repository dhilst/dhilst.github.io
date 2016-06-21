---
layout: post
title:  JNI Hello World
date:   2016-06-20 21:32:26 -0300
categories: programming
---
Hi every body. This is my first post. I hope you guys like. In this
first post I will show how to declare, implement, compile and call a
native Java methods in Linux.

The first thing we need is a class with a native method. I chose
a static one for sake of simplicity. We'll see instance methods later
on anoter post.

Our class will look like this:
{% highlight java %}
public class HelloJNIWorld {
	static {
		System.loadLibrary("hellonativeworld");
	}

	static native void helloWorld();

	public static void main(String[] args) {
		helloWorld();
	}
}
{% endhighlight %}

A litle bit of explanation doesn't hurt any body right? So here we
go... This first block load our native code. In linux this will
try to load a library called "libhelloworld.so". More on this later.
{% highlight java %}
static {
	System.loadLibrary("hellonativeworld");
}
{% endhighlight %}
This block will load our native code as soon as our class get loaded
by class loader.

The next line declares our native method. This method will be
implemented at libhellonativeworld.so.
{% highlight java %}
public native void helloWorld();
{% endhighlight %}

And after that we call it at our main:
{% highlight java %}
public static void main(String[] args) {
	helloWorld();
}
{% endhighlight %}

Now we need to compiled it. Nothing new here:
{% highlight shell %}
javac HelloJNIWorld.java
{% endhighlight %}

If you try to call this class you'll get an error. Let's take
a look:
{% highlight text %}
[geckos@localhost jnihw01]$ java HelloJNIWorld
Exception in thread "main" java.lang.UnsatisfiedLinkError: no hellonativeworld in java.library.path
	at java.lang.ClassLoader.loadLibrary(ClassLoader.java:1889)
	at java.lang.Runtime.loadLibrary0(Runtime.java:849)
	at java.lang.System.loadLibrary(System.java:1088)
	at HelloJNIWorld.<clinit>(HelloJNIWorld.java:3)
[geckos@localhost jnihw01]$
{% endhighlight %}

This means that java can't find libhellonativeworld.so. We'll create
it soom but first we need to create a header for our library. This
header is created by javah tool. This tool is called against a compiled
class. This is why we compiled our class before going furter to native
code. The procedure is always this:

1. Create native class, i.e, declare our native methods.
3. Generate native header.
4. Implement native methods.
5. Compile native methods.
6. Put everything in path so java can find/load it.
2. Compile native class.

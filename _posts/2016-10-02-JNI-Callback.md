---
layout: post
title: JNI Callback
tags: JNI, java, c, linux
---

Hi everybody. Today I'll show you how to call Java from C code
and how to pass callbacks to native code.

Let's start simple. By calling an static method from native code.
Our class would look like this:

``` java
public class Callback {
	public static void javaSaysHello() {
		System.out.println("Hello from java");
	}

	static native void nativeCallJavaMethod();

	public static void main(String []args) {
		System.loadLibrary("callback");
		nativeCallJavaMethod();
	}
}
``` 

`nativeCallJavaMethod` will call `javaSaysHello` from native code.
To achieve this we need to implement nativeCallJavaMethod. The
libcallback.c code looks like this:

``` c
#include "Callback.h"

JNIEXPORT void JNICALL Java_Callback_nativeCallJavaMethod
(JNIEnv *env, jclass cls)
{
	jmethodID mid = (*env)->GetStaticMethodID(env, cls, 
				"javaSaysHello", "()V"); 
	if (!mid)
		return;

	(*env)->CallStaticVoidMethod(env, cls, mid);
}
```

As you can see, to call a static method from native code we need
the method ID and the class. To retrieve method ID you should
use the `GetStaticMethodID` or `GetMethodID` for static an instance
methods respectively. That function receives four arguments being
the last the most crypt. The last parameter is the signature of the
method. In Java you can have multiple methods with the same name
but distinct signature, so to find an specific method you need to
supply its signature. To do that you use the `javap` tool with
the `-s` flag and the class name. The class should be at class path.
You may invoke it like this:

```
javap -s Callback
```

And it will output something like this:

```
$ javap -s Callback
Compiled from "Callback.java"
public class Callback {
  public Callback();
    descriptor: ()V

  public static void javaSaysHello();
    descriptor: ()V

  static native void nativeCallJavaMethod();
    descriptor: ()V

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
}
$ 
```

See the `descriptor:` bellow the `javaSaysHello` line? There is from where the
"()V" comes. So this brings our first headache while dealing with JNI code.
Since the method lookup is made at runtime, changing the method signature will
silently break native code, and you will only know at execution time.  Here is
the Makefile to compile the whole stuff:

```
JAVA_HOME := /usr/lib/jvm/java-8-openjdk-amd64
CFLAGS += -I$(JAVA_HOME)/include -I$(JAVA_HOME)/include/linux

all: libcallback.so

libcallback.so: libcallback.c Callback.h 
Callback.h: Callback.class
Callback.class: Callback.java

%.class: %.java
	javac $<

%.h: %.class
	javah $(<:.class=)

%.so: %.c
	$(CC) $(CFLAGS) $(LDFLAGS) -fPIC -shared -o $@ $^
```

Executing the code will generate the exepcted output.

```
$ java -Djava.library.path=. Callback
Hello from java
```

Okay. This show how to call Java methods from C. But this is
not realy a callback. Callbacks should be implemented by user.
So let's do some real callback.

Prior to Java 8 passing a method as argument isn't possible so
to make possible to user implement the callback we use an interface.

``` java
interface CallbackInterface {
	public void callback();
}

public class Callback {

	static native void nativeCallJavaMethod(CallbackInterface cb);

	public static void main(String []args) {
		System.loadLibrary("callback");

		/* Passing code as argument */
		nativeCallJavaMethod(new CallbackInterface() {
			public void callback() {
				System.out.println("Hello from CallbackInterface");
			}
		});
	}
}

```

You can see that `nativeCallJavaMethod` now receives an `CallbackInterface` implementation.
This way we can ensure the method name and signature. Instead of explicity implement the
inteface I'm instantiating it directly at `nativeCallJavaMethod` argument list. IMHO this
syntax is very nice to pass *code as argument*.

Our `libcallback.c` has to change too. Here is how it is now:

``` c
#include "Callback.h"

JNIEXPORT void JNICALL Java_Callback_nativeCallJavaMethod
(JNIEnv *env, jclass cls, jobject impl_obj) 
{
	jclass impl_cls;
	jmethodID impl_cb_mid;

	impl_cls = (*env)->GetObjectClass(env, impl_obj);
	if (!impl_cls)
		return;
	
	impl_cb_mid = (*env)->GetMethodID(env, impl_cls, "callback", "()V"); 
	if (!impl_cb_mid)
		return;

	(*env)->CallVoidMethod(env, impl_obj, impl_cb_mid);
}
```

We first grab the class of the object being passed, then use that class to get
the method id and finaly is this one to call the implemented method. Easy :+1:

You may notice that `if (!...)` statements. There I'm checking if the prior
call have failed and if this is the case I silently return. This is possible
since the native method is of `void` but this is not good since user can't
tell what goes wrong. An better aproach is to raise some exception, but this
is subject for another post.

The code can be found [here](https://gist.github.com/gkos/b29d6703d8bbc0e5b626ba56e23a0838)

Regards!


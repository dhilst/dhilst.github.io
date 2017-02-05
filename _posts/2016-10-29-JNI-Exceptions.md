---
layout: post
title: JNI Exception throwing & handling.
category: JNI
tags: java, JNI, c, linux, programming
---

This example show how to manage exceptions from JNI code. You'll
learn how to use some priciples to achieve easy maintainbility
of the code. Read on ...

{% gist 6c3f3d3525a803870bf2a8091c70f7ae JNIExceptionMain.java %}
{% gist 6c3f3d3525a803870bf2a8091c70f7ae libexception.cc %}
{% gist 6c3f3d3525a803870bf2a8091c70f7ae Makefile %}


---
title: How to make bash wrap long lines
categories: linux
layout: post
tags: bash, shell
---
If you open a terminal and then maximizes the terminal window you
may face problems where bash don't wrap long lines. This seems to
happen when bash wrongly assumes the number of terminal columns. To
fix it tell bash to check the window size automagically. This
can be done by adding the following line to your .bashrc file.

```
shopt -s checkwinsize
```

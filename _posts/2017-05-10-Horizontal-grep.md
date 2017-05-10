---
layout: post
title: Shell, Horizontal grep
tags: shell, bash, perl, oneliner
---

`grep` is very helpull filtering lines, but how to easily
filter tokens in lines?

First answer is use `cut` or `awk` if things get hairy. But
as I spend 99% of my time on command line I do really like
small commands that to smart things. This gives me productivity.

This is a small perl oneliner wrapped in a shell function that
can filter tokens in lines. Think it as an horizontal `grep`.
It iterates over tokens in a line and print the ones that matches.

```
hgrep() { perl -nase 'foreach(@F){print $_, "\n" if /$p/}' -- -p=$1; }
```
I use it, usually, after `grep` to take desired tokens. So, imagine that you
need to take the current working directory a process is using. You can get this
from the `PWD` environment. Imagine that the pid of the process is `1234`. You
may know that `e` flag of top brings the environment of it. But all variables
at spread at same line. You can use the above funtion to filter it easily.

```
ps ewww -p 1234 | hgrep PWD
PWD=/
OLDPWD=/root
```

I hope that this help you as helped me! Cheers!

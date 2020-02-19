
---
layout: post
title: Redirecting output to arbitrary commands in scripts
tags: [shell,exec]
---

Suppose that you have a script that runs early in boot. There
is no way to watch it because it runs before the SSH server
starts, or ever if you have serial connection, its output is
not captured by anybody. So you get stuck.

Your script doesn't work and you don't know what to do because
you don't have any clue about what is going wrong.

There is a little `exec` trick that I learned long ago, that
let you redirect the output of any command in the script
to an arbitrary file descriptor. Well, from now on I'm talking
exclusively about bash...

In bash is possible to create file descripts with some easy, but also
is possible to create file descriptor when read return the output of
a shell command.

## Bash file descriptors, 0, 1 and 2

I'm not going deep on file descriptors here. A fine definition is:
_A file descriptor is an identifier for an open file in some process_.
This is fine to me, it's usually a number, but it can be anything.

File descriptors have long history on unix, and there are 3 of them that are
kind of special. Basically, 0 is the standard input, usually mapped to user's
keyboard. 1 and 2 are standard output, and standard error respectively. The
difference between this two, besides being used to report distict kinds of
data, the error stream is unbuffered, which means that it has lower latence and
higher overhead. Finally, the 3 streams are usually refered as stdin, stdout and stderr.

So, enough theory. In bash you can open arbitrary file descriptors with the
syntax `N>&M` that redirects N to M. For example `2>&1` redirects stderr to
stdin. This is usefull if you want to filter errors with grep or sed for, let's
suppose that we want to filter the `ls` error and get the directory missing.

This would work but in fact it doesn't. Because the `ls` commands
print errors to stderr, and pipe `|` redirects stdout to stdin,
so stderr is lost. To fix this you can use this next command

    ls no_exists | sed -ne "s/.*\?cannot access '\(.*\?\)'.*/\1/p"

    ls no_exists 2>&1 | sed -ne "s/.*\?cannot access '\(.*\?\)'.*/\1/p"


With this in mind we need to understand exec command. `exec` is a bash command
that will execute it's argument in the curren session. So is possible to use
it to tweak current session's file descriptors, and with this is possible
to redirect stdout and stderr to some file for example, put this this

    exec > /var/log/myscript.out.$(date "+%Y%m%d%H%M") 2>&1

This is fine but the name of the post is "Redirecting output to arbitrary
commands in scripts", "to arbitrary commands", but how to do this? And
what does that means.

Where here we go in the last piece of this dirty trick. It is possible
to do this in bash `cat <(echo hello)`, and `<(command)` executes
the command and expand to a file descriptor that returns the command
output. So finally we can do this

    exec >(logger -s -t FOO -p local4.info) 2>&1

This will redirect the stdout and stderr of the script to syslog , which is a
nice when you're running commands on remote machines boot and want to debug stuff.

That's it, I hope that this became useful to someone



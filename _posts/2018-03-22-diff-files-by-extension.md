---
layout: post
title: Diffing files by extension.
tags: [diff, patching, shell, find, xargs, patch, c]
---

A long type ago I faced this problem while dealing with kernel. You
edit some files than ran `diff -Nurp A/ B/` but B was compiled and
you get a lot of trash in the output.

You may also crossed
[this](https://stackoverflow.com/questions/2673578/how-to-diff-just-the-source-files)
question at Stack Overflow. If you read carefully you may notice that there is
an answer of mine there. I take the harder path and patched diff. Sadly the
diff team reject my patch you can take a look at the thread
[here](http://lists.gnu.org/archive/html/bug-diffutils/2014-10/msg00000.html).

But happily [Andreas
Grünbacher](http://lists.gnu.org/archive/html/bug-diffutils/2014-10/msg00002.html),
gift us with a nice trick and here it is:

```
find a/ b/ -type f -printf "%P\0" | sort -zu | xargs -0 -n1 -i% diff -Nu a/% b/%
```

Here `a/` and `b/` are the original and patched tree, respectively. `-printf "%P\0"` will
print the relative file names delimited by null characters: `\0`. The sort options
are to handle the null delimited and remove duplicates, _unique_. `xargs` options
are `-0` handle null delimited, `-n1` is to limit arguments, `-i%` is to use `%` as
a placeholder for the argument and `diff -Nu` is to treat handle new files and include
context at the diff output. So basically this is _find all files at this two trees, order and
unique than, and show the diference for each one._. To filter this by extension is just a matter
of filtering at the find command, so for C source and header files: 

```
find a/ b/ -type f -name '*.[hc]' -printf "%P\0" | sort -zu | xargs -0 -n1 -I% diff -Nu a/% b/%
```

The `-I` option of `xargs` is deprecated in Linux but more portable than `-i` in lowercase. This is
because the _FreeBSD_ `xargs` for example doesn't have lowercase `-i`.

I hope this helps as helped me. Thank Andreas!

Cheers!

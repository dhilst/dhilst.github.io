---
layout: post
title: Interactive grep with Vim
tags: [vim]
---

Did you know that you can use `grep` from inside vim? Give it a
try `:grep nologin /etc/passwd`, then you open the quickfix with `:cw`
where you can navigate through the results.

I use grep a lot, usually in this format `grep -rn <PATTERN> . --include
*.<EXTENSION>`. This is fast, and powerfull, and with vim I can jump directly
to the results. The problem is that typing this everytime is anoying. So I wrote
a simple command to help me out. It will ask for a pattern and grep with defined
arguments.

In this example I was greping ansible playbooks, so I used the `*.yml` extension.

```vim
:command! -nargs=0 G exec 'grep -rn  ' input('Grep for: ') '. --include \*.yml'
```

Cheers

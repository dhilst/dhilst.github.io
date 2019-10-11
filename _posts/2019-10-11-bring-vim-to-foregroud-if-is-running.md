---
layout: post
title: 12738 vim jobs never more
tags: [vim, zhs]
---

I use vim on the terminal, but I face a problem from old ages. I never remember
if I have a vim running or not. When I'm using vim and want to run a command I
send it to foreground run the command and use fg to get back to vim. But the
problem is that sometimes I forgot to use fg and end up with logs of vims
running in background.

Emacs has a server mode that deals with this kind of problem but with a more
hardcore approach. What I want were much much simpler.

I want that, if I already have a vim running in this terminal as a job, the
vim command brings this up to foreground instead of starting a new vim. So
I can run vim as much times as I want and still have only a single vim really
running.

To do this I create a little python script that read the output of jobs
and tell what to do next. If there is a vim job running it will output
`fg %n` where `n` is a number telling us what job to bring
to foregroumd. Now, if there are no vim jobs it output `/usr/bin/env vim`.
So that `jobs | ./fg_jobs.py` always expand to `fg %n` or `/usr/bin/env vim`.

So far so good, now we can use this to create a alias for vim like this

```
alias vim='eval $(jobs | ~/.local/bin/fg_jobs.py)'
```

And voila, `vim` will always reuse the same vim instance again. It's a kind
of memoised command. Cool uh?

This is the python script: 

{% gist https://gist.github.com/dhilst/22eaf6089cc35fb8d43b4a49b680a5a4 %} 

I may rewrite this to something simpler, 

Installing:

```
wget https://gist.githubusercontent.com/dhilst/22eaf6089cc35fb8d43b4a49b680a5a4/raw/85a273391da614c3c10497e0b51668fc2828060d/gistfile1.txt -O ~/.local/bin/fg_jobs.py
chmod +x ~/.local/bin/fg_jobs.py
```

Cheers!

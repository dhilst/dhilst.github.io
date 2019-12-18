---
layout: post
title: How to mount local folder on remote system through ssfs
tags: [sshfs, devel]
---

You need first create a tunnel from a remote port to your 22 port. Then you
use this port for doing the reversed sshfs

```bash
mymachine $ > ssh root@remote -R 10000:localhost:22
remote # >
remote # >
remote # > sshfs -p 10000 myuser@localhost:/local/path /remote/mountpoint/path
```

I use this to mount frontend projects on remote systems so that I can run webpack
on my machine and have it deployed to a remote host with all the webpack-dev-server
stuff running locally, is very handy

I was working on local virtual machines, so everything was easy, but then I had to test
stuff on another virtual machines that are remote, behint VPN, NAT, and firewall, so this
solution fits as a glove.

The filesystem should be very slow, there are some overhead but it is still faster than the
build/deploy/fix loop that is usual when testing things on remote systems.

Cheers


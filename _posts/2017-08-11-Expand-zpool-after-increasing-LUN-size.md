---
layout: post
title: How to grow ZFS after increasing the disk size.
tags: [BSD, ZFS, zfs, FreeBSD, zpool, xen]
---

Hey! I've been building stuff. Stuff that take a lot of space
to complete. So I asked my fellow to increase the disk size
of the build partition and he answers me: _Do you deal with growing
the pool?_ and I _Okay!_.

This is more a reminder for latter reference. The procedure was
damn simple. Here it is. My poll is _build_ and has only one
disk, _ada2_. So I did `zpoll online -e build ada2` and BOOM, now
I have more 80G to expend. To get pool you can `zpool list -v`.

Cheers

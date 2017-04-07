---
layout: post
title: FreeBSD, `rm Operation not permitted'.
tags: [FreeBSD]
---

If you receice `rm: Operation not permitted` while trying to delete files on FreeBSD, check
this post out.

This happens because the file has been marked with `schg` flag. To proper remove the file
you need to remove the flags by running `chflags -R noschg <THE_FOLDER>` and then `rm -r <THE_FOLDER>`.

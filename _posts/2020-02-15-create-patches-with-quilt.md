---
layout: post
title: Create patches with quilt
tags: [quilt, patches]
---

[quilt](https://linux.die.net/man/1/quilt) make easy to
create a series of patches for things that are not in git

The usage is pretty simple, you do

    quilt new <patch_name>
    quilt add <some_file>
    # edit the file
    quilt refresh

And it's done. The patch can be found at `patches/` folder.
You can stack patchs with `push` and `pop`. It make really
easy to create patches from configuration files.

---
title: Fedora 25 conflict between 32 and 64 bits packages.
layout: post
tags: [fedora, linux, dnf]
---

I tryed to upgrade my system today and faced an ugly error about
32 bit packages conflicting with 64 bits.

The major part of the 32 bit packages come as dependencies of steam.
Since I'm not plain lately I decide to rip out all 32 bits packages from
my system, upgrade and, only after a succesfull upgrade reinstall it again.

To do so I ran:

```
sudo dnf repoquery --installed --arch i686 > reinstall 
cat reinstall | sudo xargs dnf remove -y 
sudo dnf upgrade --best
cat reinstall | sudo xargs dnf install -y
```

Regards.

---
layout: post
title: Free space by cleaning PackageKit cache on Fedora
tags: [space, fedora, packagekit]
---

From time to time I have to free some space on my Fedora machine. PackageKit
seems to take a lot of space for caching, you can free it by 

```
sudo pkcon refresh force
```

Regards

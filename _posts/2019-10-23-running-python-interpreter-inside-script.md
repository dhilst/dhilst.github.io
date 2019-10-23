---
layout: post
title: Running python interpreter inside script
---

Just add the bellow to the script

```
import code; code.interact(local=locals())
```

Cheers

---
layout: post
title: ls directories blue is too dark
tags: [shell, ls]
---

If you ever thought that directories blue at `ls --color` are too dark
this may help you.

Add this to your `.bashrc`

```
export LS_COLORS=$LS_COLORS:'di=0;35:'
```

And `source ~/.bashrc`. This will make the ls command use the _light blue_
instead of the ordinary blue. My eyes thank!

Cheers,

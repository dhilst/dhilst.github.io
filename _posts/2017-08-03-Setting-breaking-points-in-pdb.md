---
layout: post
tag: [python, pdb]
---

Just for further references.


To setup a break point in `pdb` in a unloaded file the
file need to be in the `sys.path`. It can be relative
and suffix can be ommited:

I work better with examples:
```
(pdb) b wtforms/form:310
```

Cheers

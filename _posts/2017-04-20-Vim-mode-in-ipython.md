---
layout: post
title: Vim mode in ipython
tags: [python, iphython, vim, vi]
---

Happy pythoning with ipython in vim mode.

```
cat <<EOF > ~/.ipython/profile_default/ipython_config.py
c.TerminalInteractiveShell.editing_mode = 'vi'
EOF
```

I got this in an coment from this [question](http://stackoverflow.com/questions/10394302/how-do-i-use-vi-keys-in-ipython-under-nix) at stackoverflow!

Thanks [imirc](http://stackoverflow.com/users/96213/imiric)!

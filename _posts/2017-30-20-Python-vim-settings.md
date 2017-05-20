---
layout: post
title: Python + vim settings
tags: [python, vim]
---

This are my current python settings for vim


``` vim
fun! PythonMode()
        setlocal ts=4 sw=4 et
        map <F9> :exec "!python -i " . bufname("%")<CR>
endfun
autocmd Filetype python call PythonMode()

```

Cheers

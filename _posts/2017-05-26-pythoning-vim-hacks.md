---
layout: post
title: Vim Pythoning plugins
tags:
    - vim
    - python
    - autocomplete
---

This are the plugins I'm using for python development in vim.

``` 
set nocompatible              " be iMproved, required
filetype off                  " required
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()

Plugin 'Valloric/YouCompleteMe'
Plugin 'kevinw/pyflakes-vim'

call vundle#end()            " required
filetype plugin indent on    " required

fun! PythonMode()
	setlocal ts=4 sw=4 et
	map <F9> :wa! \| !python %<CR>
	map <F8> :wa! \| !./manage.py runserver<CR>
	map <F7> call flake8#Flake8()
endfun
autocmd Filetype python call PythonMode()
autocmd Filetype htmldjango setlocal ts=4 sw=4 sts=4 et
```

Cheers

---
layout: post
title: How to setup vim to use clipboard on Fedora
tags: [vim, fedora]
---

* Install `vimx`: `sudo dnf install -y vim-X11`
* Add `set clipboard=unnamedplus` to your `.vimrc`
* Add `alias vim=vimx` to your `.bashrc` or `.zshrc`. This is important because `vim` binary isn't built with `+clipboard` support.
* To use mouse set `set mouse=a` in your `.vimrc`

Cheers

---
layout: post
title: Ansible tasks inside vim
tags: [ansible,vim]
---

I've been writing a lot of ansible playbooks recently. When programing on
dynamic languages is pretty common to have into the text editor the ability to
evaluate arbitrary code, being a whole file or a single line. Here is how to this with
ansible!

I wrote a simple vim plugin for enabling me to do so. It's usage is very simple, follow on

# Installation

If you're not using [vim-plug](https://github.com/junegunn/vim-plug), I really recommend you
to do so. Almost all vim plugins are compatible between plugin managers and this should not be
different. Just place this lines between `call plug#begin('~/.vim/plugged')` and `call plug#end()`
in your `.vimrc` and execute `:so %` to reload the file. Then run `:PlugInstall` and wait it to
install the plugin.

```
Plug 'dhilst/vim-ansible-execute-task'
```

# Usage

This plugin define 3 user commands

* `AnsibleExecuteTask`: Execute tasks in visual block (text selection for no-vimwers)
* `AnsibleExecuteFile`: Execute a file in a role (only tasks, not a playbook)
* `AnsibleExecutePlaybook`: Execute a playbook


Here is a asciinema of it
[![asciicast](https://asciinema.org/a/ezgOAViHxSNOjPaNf8vDhEqRx.svg)](https://asciinema.org/a/ezgOAViHxSNOjPaNf8vDhEqRx)

# Source code

https://github.com/dhilst/vim-ansible-execute-task

Regards,


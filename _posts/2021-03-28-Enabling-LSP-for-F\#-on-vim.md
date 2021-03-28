---
layout: post
title: Enabling F# intelisense support on neovim with LSP
tags: [vim, neovim, f#, fsharp, LSP, language-server-protocol, intelisense, ide]
---

# FINALLY!

Okay after a day struggling I could enable intelisense for F# files in vim
using [LanguageClient-neovim](https://github.com/autozimu/LanguageClient-neovim)
and [Ionide-vim](https://github.com/ionide/Ionide-vim). It was not easy beacuse
of the lack of the documentation.

### Install the plugins

I'm using [vim-plug](https://github.com/junegunn/vim-plug), to install the
required plugins I added this to my .vimrc

```
Plug 'autozimu/LanguageClient-neovim', {
    \ 'branch': 'next',
    \ 'do': 'bash install.sh',
    \ }
Plug 'ionide/Ionide-vim', {
      \ 'do':  'make fsautocomplete',
      \}
```

Run `so %`, then `PlugInstall`

_BUG?!: I had to change all permissions on Ionide-vim/fsac folder they were all `0000`,
so I runned this command: `find ~/.vim/plugged/Ionide-vim/ -perm 000 -exec chmod 755 {} \;`. This
seems to be a bug on the zip file that is downloaded, I don't really know for
sure._

Then add this to configure that LSP server command. Run this command on command
line and make sure that it works before trying it on vim.

```
" LanguageClient-neovim stuff
let g:LanguageClient_serverCommands = {
    \ 'fsharp': ['dotnet', expand('~/.vim/plugged/Ionide-vim/fsac/fsautocomplete.dll')]
    \ }
let g:LanguageClient_loggingLevel = 'INFO'
let g:LanguageClient_virtualTextPrefix = ''
let g:LanguageClient_loggingFile =  expand('~/.local/share/nvim/LanguageClient.log')
let g:LanguageClient_serverStderr = expand('~/.local/share/nvim/LanguageServer.log')
```

And thats it!

# LanguageClient-neovim vs ALE

I've been looking at LanguageClient-neovim, it happens that it provides linter
functionality as ALE do. At beggining I thought that LanugageClient-neovim were
a simple middleware for ALE or Syntastic, but is not!

The difference is that LSP is *ONE* lint (and more) tool, and ALE is capable of
enabling multiple linters, fixers, formaters and combine them together this is
realy cool but knowing that LaguangeClient-neovim is able to provide most wanted
linting, autocomplete etc enable having these functionality for languages that
support LSP but are not supported by ALE yet, and to create the ALE support for
it if I want, pretty cool.

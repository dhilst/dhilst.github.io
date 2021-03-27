---
layout: post
title: Adding new linter (F#) to ALE
tags: [vim, neovim, ale, linter, lint]
---

[ALE](https://github.com/dense-analysis/ale) is a linting engine for vim, it
works like a charm and I prefer it over
[Syntastic](https://github.com/vim-syntastic/syntastic) because it's
asynchronous which means it doesn't block while you're typing. Syntastic may
have support for async now but I'm still on ALE.

ALE has support for [a lot of
languages](https://github.com/dense-analysis/ale/blob/master/supported-tools.md),
the only exceptions that I faced were F# and Rust (Rust seems to work now), both
can work with Syntastic but since I like ALE so much I decided to try to add a
[FSharpLint](https://github.com/fsprojects/FSharpLint) support to it. And it
happens that was not difficult to get it working.

### Yeah nice, but how to do it!?

Basically you need to call `ale#linter#Define` with a file type and some
options. It works in two ways, by executing a command and using a vimscript
function to parse the output, or using [LSP](https://langserver.org/).

I choose using the command option because since FSharpLint was available it
seemed the natural way to me. Let's go in parts so my future self can follow

### Lintint a file with FSharpLint

I can use `dotnet fsharplint lint <file>` to lint a file from command line. By
the way to install `fsharplint` just run `dotnet tool install -g dotnet-fsharplint`.
Here is the output of the above command:

```
$ dotnet fsharplint lint Program.fs
========== Linting Program.fs ==========
Consider changing `path` to PascalCase.
Error on line 5 starting at column 5
type path = string
     ^
--------------------------------------------------------------------------------
========== Finished: 1 warnings ==========
========== Summary: 1 warnings ==========
```

The problem with the above command is that the output is not very parse
friendly, so looking at `--help` I found `--format msbuild`

```
$ dotnet fsharplint --format msbuild lint Program.fs
========== Linting Program.fs ==========
Program.fs(5,5,5,9):FSharpLint warning FL0038: Consider changing `path` to PascalCase.
========== Finished: 1 warnings ==========
========== Summary: 1 warnings ==========
```

Much better. Now ... the `Program.fs(...` line is the matter, I just need to
parse it and return on a dictionary. But first let me introduce
`ale#linter#Define(ftype, options)`.

### `ale#linter#Define(ftype, options)

This function will be called, usually by a plugin, to define a linter. Here is the
call that I'm using right now

```
call ale#linter#Define('fsharp', {
\   'name': 'FSharpLint',
\   'alias': ['fsharplint'],
\   'executable': 'dotnet',
\   'command': '%e fsharplint --format msbuild lint %t',
\   'callback': 'Fsharp_callback',
\   'lint_file': 1,
\ })
```

The first argument is the file type, you can get it by opening a file and then
running `:set ft?`. Now the dictionary with the options:

* `name`: Is the linter name, will be used in `g:ale_linters` to enable this
  linter.
* `alias`: Just aliases for using instead of `name`
* `executable`: And executable, ALE will call this to check if it's installed or
  not. If not installed you will receive an error.
* `command`: This is the command that will be called to lint the file.
  * `%e`: Will be replaced by the `exacutable` name
  * `%t`: Will be replace by a temporary file created by ALE during the lint,
    more on this latter too.
* `callback`: This is a function that will be called with the output of the
  `command` and should return a well formated dictionary, more on this next too.
* `lint_file`: This is a "boolean" to inform that ALE should write file to disk
  and pass it as argument (the `%t`) before running the command. The default
  behavior is to use stdio communication which is better because no disk is
  touched but `dotnet fsharplint` has not option for it.

Now basically the main things to pay attention are the command and the callback.
Just as side note, if you're implementing an _LSP_ linter you must not pass
`command` and use `lsp` option instead, you can check more info in
[ale#linters#Define](https://github.com/dense-analysis/ale/blob/master/doc/ale.txt#L3736)
docs.

Now, with linter defined it will call the command and pass the output to the
callback but how this callback looks like and what it needs to return. It has
the signature like this `function! Fsharp_callback(bufnr, lines) abort` (is just
an example). `bufnr` is the vim buffer number for the file being linted, and
lines is a list with the linter output lines.

It must return a list of dics with this keys

* `text`: The error message
* `detail`: Detailed error message
* `lnum`:  Error line number start
* `col`: Error column start
* `end_lnum`: Error line number end
* `end_col`: Error column number
* `filename`: The absolute path of the filename, you can get the absolute
  filename with `fnamemodify(relative_filename, ':p')`
* `type`: 'E' for error 'W' for warning

So we all we need to do is parse each line and create a dict like this, not that
hard uh? Here is how I did it. Some nodes

* `matchlist` return a list of regex groups matches, like \1 \2 ...
* `add` is the list append of vimscript, it would be better to use map here but
  I'm not very good on vimscript so this was easier to Google :P

The remaining of the function should be self explanatory, I ignore first and
last two lines since they are header/footer and not error messages

```
function! Fsharp_callback(bufnr, lines) abort
  " output example: Program.fs(7,5,7,9):FSharpLint warning FL0038: Consider changing `path` to PascalCase.
  let pattern = '\([^(]\+\)(\(\d\+\),\(\d\+\),\(\d\+\),\(\d\+\)):FSharpLint \(\w\+\) \(.*\)$'
  let lines = a:lines[1:-2]
  let result = []
  for line in lines
    let matches = matchlist(line, pattern)
    if len(matches) >= 7
      if matches[6] == 'error'
        let type = 'E'
      else
        let type = 'W'
      end
      let element = {
            \ 'text': matches[7],
            \ 'detail': matches[7],
            \ 'lnum':  matches[2],
            \ 'col': matches[3],
            \ 'end_lnum': matches[4],
            \ 'end_col': matches[5],
            \ 'filename': fnamemodify(matches[1], ':p'),
            \ 'type': type
            \ }
      call add(result, element)
    endif
  endfor
  return result
endfun
```

That's it! This was not exhaustively tested so there are bugs for sure!

Next I will try to add an LSP version of this and then open a PR for [Ionide-vim](https://github.com/ionide/Ionide-vim)

Cheers, drink water!

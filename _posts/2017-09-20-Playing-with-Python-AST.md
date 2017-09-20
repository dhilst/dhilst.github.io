---
layout: post
title: Playing with Python abstract syntax trees.
tags: [python,ast,AST,programming]
---

The code bellow is an hello world using python abstract
syntax tree. The code is built by hand craftng an AST, compiling
and executing. If you're going to build something that compiles
to python you'll hit this at some point. Also is very cool for
learning how the interpreter parses the code.

``` python
import ast

expr = ast.Call(ast.Name('print', ast.Load()), [ast.Str('Hello World')], [])
stmt = ast.Expr(expr)
mo = ast.Module([stmt])
ast.fix_missing_locations(mo)
exec(compile(mo, filename='<ast>', mode='exec'))
```


Cheers,

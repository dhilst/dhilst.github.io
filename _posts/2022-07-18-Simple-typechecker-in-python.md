---
layout : post
title : Simple Python typecheker in Python
tags: [typecheker, python]
---

Here is how to bootstrap a simple Python typechecker in Python.

The idea is using the
[ast](https://docs.python.org/3/library/ast.html) module of Python to
parse some code into a typed AST and then traverse the AST checking
the types.

In this example I will type check function calls only, to do this
the functions being called need to be annotated. 

Here is the code that we will typecheck 

```python
def inc(a: int, b: int) -> int:
    return a + 1

def foo(a: float) -> float:
    return inc(a, "a") # type error here
```

The first thing we need to do is to parse the code into an AST and
then traversing the AST. Parsing is easy just call [ast.parse](https://docs.python.org/3/library/ast.html#ast.parse)
and you're done. To visit we need to extend [ast.NodeVisitor](https://docs.python.org/3/library/ast.html#ast.NodeVisitor)
implementing the methods that we have interest. In this case I will
visit function definitions (to gather typing information) and function
calls, to effectively do the typechecking.

Here is a skeleton :

```python
import ast
class Typechecker(ast.NodeVisitor):
    def __init__(self):
        super().__init__()
        self.typeenv = {}

    def visit_FunctionDef(self, node):
        self.generic_visit(node)

    def visit_Call(self, node):
        self.generic_visit(node)
		
def typecheck(text, typeenv={}):
    tree = ast.parse(text)
    Typechecker().visit(tree)
```


In our `Typecheker` class we initialize a `typeenv` member that
will hold the type information against what we will typecheck. The
[generic_visit](https://docs.python.org/3/library/ast.html#ast.NodeVisitor.generic_visit) method will recurse into child nodes of the AST.

When visiting a [FunctionDef](https://docs.python.org/3/library/ast.html#ast.FunctionDef) we want to add the parameters to the type environment, then visit
children nodes (particularly the body of the function, to do the
typechecking), then remove the parameters from the type environment. We
do this by saving the type environment, extending it with the
parameters then restoring it after visiting the body.

```python
from typing import *
import ast
from dataclasses import dataclass

@dataclass(frozen=True)
class FuncSig:
    name : str
    args : list[str]
    ret: str

    def __repr__(self):
        args = " -> ".join(self.args + [self.ret]) 
        return f"{self.name} : {args}"

class Typechecker(ast.NodeVisitor):
    def __init__(self):
        super().__init__()
        # this is our type environment
        self.typeenv = {}

    def visit_FunctionDef(self, node):
        # save the type environment
        oldenv = self.typeenv.copy()
        # updathe the type environment with the types of the arguments 
        self.typeenv.update({arg.arg: arg.annotation.id for arg in node.args.args})
        # visit the body
        self.generic_visit(node)
        # take the signature of this function being defined
        signature = FuncSig(node.name, [arg.annotation.id for arg in node.args.args], 
                            node.returns.id)
        # restore the old type environment, without the type of the arguments
        self.typeenv = oldenv
        # extend it with the now defined function
        self.typeenv[node.name] = signature
```

Here `FuncSig` is just a dataclass that I use to hold the function
signature, with some pretty printing. The important thing to note is that
we put the arguments in the type environment, recurse into the children nodes
of the AST, and then remove the arguments from the type environment. This is
because the scope of the arguments is the function body so we need to remove them
once we leave the function.

Next we visit the
[Call](https://docs.python.org/3/library/ast.html#ast.Call). In this
case, to keep things simple we check only named functions, so lambda
calls will not be checked, and only functions that we have type
information. The first thing we do is to check if the function name is
in the type environment, if it is then we gather the call arguments
and compare to the expected arguments (in the type environment), if they
differ we raise a TypeError.

```python
    def visit_Call(self, node):
        if type(node.func) is ast.Name and node.func.id in self.typeenv:
            actual_args = []
            for arg in node.args:
                if type(arg) is ast.Constant:
                    actual_args.append(type(arg.value).__name__)
                elif type(arg) is ast.Name:
                    if arg.id in self.typeenv:
                        actual_args.append(self.typeenv[arg.id])
                    else:
                        # Cannot typecheck, no type information
                        return 
            expected_args = self.typeenv[node.func.id].args
            # dumb typechecking 
            if actual_args != expected_args:
                raise TypeError(f"Type error in call for {node.func.id}, "
                                f"expected : {expected_args}, found : {actual_args}")

        self.generic_visit(node)
```

Here we consider two kinds of arguments in the call, constants are
checked for its type, if it's a variable instead, we check in the type
environment for by its name, if no type is found in the type
environment we silently giveup. If we could gather all the type
information we need and the types differ we raise a `TypeError` and
that's it!

Putting all together, here is the full code : https://gist.github.com/dhilst/24bfd7904ccefb542abf7fa099e7e516

With this in hand you should be abble to tweak it and extend to it play
with typechecking ideas (like typechecking with generics or type inference)
without the need to bootstrap a whole grammar etc. Also you can use this
kind of technique to lint your Python code, forbidden some functions that
you consider unsafe for exmaple, ensure immutability, linearity, etc.

Cheers

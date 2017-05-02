---
layout: post
title: Python, recursive generators with python 3.3.
tags: [python, generators, recursion, programming]
---

Here is how to use `yield from` to implement recursive generators. You need
at least 3.3 version of python to use yield from.

``` python
def flat(arg):
    try:
        for a in arg:
            yield from flat(a)
    except TypeError:
        yield arg

``` 

Here is an test:

``` 
for a in flat([1,2,(a for a in [9,8,7,6]),[1,2,3,4],3,4,(5,6,(12,13),7),[[100]]]):
    print(a)

```

Result:
```
1
2
9
8
7
6
1
2
3
4
3
4
5
6
12
13
7
100
```

Cheers

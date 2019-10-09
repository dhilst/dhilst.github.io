---
layout: post
title: TCO studies
---

Tail Call Optimization considerations


If you have the call 

    def fact(a):
        if not a:
            return 1
        return a * fact(a-1)
        
    fact(3)
    
You expect this to expand to `3 * fact(n-1) * fact(n-2)`. But this
leaves `n` in the previous call stack. To fix this we need to take
the `3 * ` part and embbed it into the function call, so that all
variables are passed as arguments to function calls. To do this we
replace the `*` operator by `mul` function from `operators` it looks
like this

    from operators import mul
    
    def fact(a):
        if not a:
            return 1
        return mul(a, fact(a-1))
        
        
        

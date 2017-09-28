---
layout: post
title: Monkey patching decorators.
tags: [python, programming, monkey patching]
---

If you never heard of the _monkey patching_ term you are out of date. _Mokey patching_
Is the technique of changing things at runtime. The [mock library](https://docs.python.org/3/library/unittest.mock.html)
is a great tool for using _mokey patching_ for testing purposes. But there are other uses.

The _Do not change, but extend!_ pattern can be ultimately achieved with _mokey patcking_. Suppose
that you have a third party library but you need to add some validation to it. The canonical way
to do it is just change the library and submit the changes to the upstream. But suppose that the
changes are too much tied to your use, so that the upstream doesn't accept the changes. You still
want to keep updated with the upstream but if change the upstream code you will need to manually
merge it every time that upstream updates. Also, as the time passes by your code will diverge
from upstream needing more and more effort in the merge. The chance of breaking something is also
increasing proportionally to the size of your code base and the amount that you interfere with
the upstream logic. So things start to become hard to maintain.

This is the most common source of complexity in the maintenance of open source customizations. Can
we put it in some math?

```
maintenance effort = (size of upstream codebase + size of customizations) * divergence
```

I am not happy with this but it is still a good motivation for doing monkey patching. Before
showing the code I should advice. Monkey patching change the intuitive flow of the code but
doing runtime magic which is __BAD__. You need a good motivation for doing so, if you doesn't
have one, then don't use this and do things in the canonical way.


# Truly transparent proxying.

Suppose you have some package _loginpkg_ and it has some _login_ function that is called
by _userlogin_ in the same package. So `loginpkg.userlogin -- calls --> loginpkg.login`. You
want to put some validation at this function. You can

- Change `userlogin` to validate before or after the `login` call.
- Change `login` to validate.
- Create a decorator and annotate the `login` function with it.
- Monkey patch `login` putting a proxy in its place. 

We will use the 4th option, so no change in the `loginpkg` package is done, but you still
have your functionality there.

At your package  does this: 

``` python
from injector import inject_func

@inject_func('loginpkg.login')
def loginproxy(user, password):
	# do the validation
	return loginproxy.target(user, password)
```

Now suppose that instead of a function you have a class `Login`, you can then
do this

``` python
from injector import inject_class

@inject_class('loginpkg.Login')
class LoginProxy:
    def __init__(self, user):
        super().__init__(user)

	def login(self):
        # validation !?
        return super().login()
```

Pretty cool uh? But how these decorators are implemented?. Here it is the gist.

{% gist https://gist.github.com/dhilst/428f2fa4a0663150f20e1e0c4e445ef6 %}

Regards,
Daniel.

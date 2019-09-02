---
layout: post
title: Interative debugging
tags: [debug, ruby, python, php]
---

I use to code by writting tests and fixing errors. When things
get dirty, debug by printing make the whole code/fix flow really slow.
In this situations I call for interative debuggers. I don't really on
fancy IDE stuff, usually there are magic lines that you paste in the
code to get access to interactive debugging.

With python you can do

```python
import pdb; pdb.set_trace()
```

Google for `python pdb`

On ruby you can do

```ruby
binding.pry
```

Google for `ruby pry`

On php you can do

```php
\Psy\Shell::debug(get_defined_vars());
```

Google for `php psysh`

Cheers

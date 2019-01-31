---
layout: post
title: Method caller in ruby
tag: [ruby, python]
--- 

Python has this by default, a function that receives a method and arguments
and return a function that when called with an object call the method
with the provided args. Perfect for usign with map and reduce family of fuctions.

Here is how to achieve the same with ruby

```ruby
def methodcaller(method, *args)
  ->(object) { object.send(method, *args) }
end

['foo', 'boo', 'zoo'].map(&methodcaller(:gsub, 'oo', 'aa'))
```

Cheers

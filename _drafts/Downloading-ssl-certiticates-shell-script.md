---
layout:post
---

```
#!/bin/bash

echo \x00 | openssl s_client -showcerts -connect $1:443 2>/dev/null | awk '/BEGIN/{f=1}{if(f){print $0}}/END/{f=0}'
```

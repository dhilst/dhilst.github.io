---
layout:post
---

`awk '/BEGIN/{f=1}{if(f){print $0}}/END/{f=0}' < <(echo ^D | openssl s_client -showcerts -connect git.nisidata.com.br:443 2>/dev/null) > foo.pem`

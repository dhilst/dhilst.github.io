---
layout: post
title: SSL, Downloading certification chain using shell script.
tags: [shell, openssl, certificates]
---

Use the below shell script to donwload all the certificate chain. Pass the domain to it
and redirect output to a file.

```
#!/usr/bin/env sh

openssl s_client -showcerts -connect $1:443 < /dev/null 2> /dev/null | sed -n '/BEGIN CERTIFICATE/,/END CERTIFICATE/p'
```

Usage: `./download-certs.sh google.com > googlecertschain.pem`

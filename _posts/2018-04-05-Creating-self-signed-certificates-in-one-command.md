---
layout: post
title: Self signed certficate one liner.
tags: [openssl,ssl,certificate,https]
---

This is how to create a self signed certificate with one command:

```
openssl req -x509 -nodes -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -batch
```

- `365` days to expire.
- `4096` is the key lenght.

If you want to fill organization, country, common name and such, remove the `-batch` option.

Regards

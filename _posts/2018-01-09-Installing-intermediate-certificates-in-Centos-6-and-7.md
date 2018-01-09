---
layout: post
title: Installing intermediate Let's Encrypt certificated in Centos 6 & 7
tags: [centos,centos6,centos7,ssl,certificates,update-ca-trust, letsencript]
---

I got a Centos box that was not accepting some Let's Encrypt certificates, so I
had to install then by hand. Follow up to see how I did it.

First download the intermediate certificate, open the [Let's Encrypt](https://letsencrypt.org/certificates/)
certificates page and download the intermediate certificates. I donwloaded
[Let’s Encrypt Authority X3 (IdenTrust cross-signed)](https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem.txt)
but this link may change in some years so access the first one. Put the certificate at `/etc/pki/ca-trust/source/anchors/`
and then run `update-ca-trust`

Summing up:

```
cd  /etc/pki/ca-trust/source/anchors/ 
wget https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem.txt 
update-ca-trust
```

To test do `openssl s_client -connect THE_ADDRESS_YOUR_TRYING_TO_ACCESS:443`

If `update-ca-trust` don't work for you try to check if it's enabled with
`update-ca-trust check`. If it isn't try to enable it with `update-ca-trust
enable` or in some cases `update-ca-trust force-enable` and then run
`update-ca-trust` again.

`update-ca-trust` will bundle all certificates at `/etc/pki/tls/ca-bundle.crt`.
This file is loaded by tools that do certificate validation.

Regards,

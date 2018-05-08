---
layout: post
title: Ignore DNS from DHCP with NetworkManager.
tags: [RHEL, Centos, Network Manager, NetworkManager]
---

For the lazy, use this command:

```
nmcli con mod eth0 ipv4.ignore-auto-dns yes ipv4.dns <YOUR CUSTOM DNS>
```

Change `eth0` accordingly.

Cheers!

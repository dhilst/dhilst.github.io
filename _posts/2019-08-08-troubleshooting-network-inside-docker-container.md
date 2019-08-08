---
layout: post
title: Troubleshooting network problems inside Docker container
tags: [docker, network]
---

Containers need to be small for building performance and to safe space. To do
so they give on a lot of usefull tools that are valuable during
troubleshooting.  Because of this using troubleshooting network problems from
inside containers can be a PIAS. Luckly there is a container image with
network tools installed by default:

```
docker run -ti amouat/network-utils bash
```

Thanks [amouat](https://hub.docker.com/u/amouat) you helped a lot!

Cheers

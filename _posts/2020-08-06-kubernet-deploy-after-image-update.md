---
layout: post
title: How to redeploy on kubernets after an image update
tags: [kubernets, ks8, docker, image, deploy]
---

I'm working on a pretty new setup on Kubernets, we hadn't setup CI yet
so after updating an image I need tell Kubernets to take the new image

This command proved to be usefull

```
kubectl rollout restart deployment/my-deployment
```

This will restart the deployment updating the image that is use. I hope
we setup CI soon



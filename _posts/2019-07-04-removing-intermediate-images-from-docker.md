---
layout: post
title: Removing dangling (intermediate) images from Docker
tags: [docker]
---

If you're working with docker you may face _out of space_ problems.
You can free some space by removing the intermediate images that docker
users to create the final images.

This is the command

```
docker rmi $(docker images -f 'dangling=true' -q)
```

If you need free space this can be usefull too

```
docker system prune
```

Use it wisely

Cheers


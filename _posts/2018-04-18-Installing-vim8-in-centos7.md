---
layout: post
title: How to install vim 8 Centos 7.
tags: [vim, centos]
---

There is a package in [COPR](https://copr.fedorainfracloud.org/) for this:

```
yum-config-manager --add https://copr.fedorainfracloud.org/coprs/mcepl/vim8/repo/epel-7/mcepl-vim8-epel-7.repo
# Remove vim-minimal if is installed
yum remove -y vim-minimal
yum install vim
# If you removed vim-minimal, sudo may be removed to, install it again
yum install sudo
```

Thanks
[SysTutorials](https://www.systutorials.com/241762/how-to-upgrade-vim-to-version-8-on-centos-7/)
for pointing this out!

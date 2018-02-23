---
layout: post
title: Preventing Vagrant from asking password when using libvirt provider
tags: [vagrant, development, devel, dev, libvirt, polkit, password]
---

I messing up with a project that uses [Vagrant](https://www.vagrantup.com/) for
set up development environments. It's cool but it keeps asking me for password
everytime.  _Annoying!_. Here is how to avoid it. 

[libvirt](https://libvirt.org/) uses polkit for running privileged tasks and its
polkit who keeps asking for password. To avoid this you need to create a policy:

Add this to `/etc/polkit-1/rules.d/10.virt.rules`
```
polkit.addRule(function(action, subject) {
    if (action.id == "org.libvirt.unix.manage"
            && subject.local
            && subject.active
            && subject.isInGroup("libvirt")) {
        return polkit.Result.YES;
    }
});

```

Next add your user to libvirt group `sudo usermod -aG libvirt <YOUR_USER>`. And
that's it!

Cheers!

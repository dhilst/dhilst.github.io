---
layout: post
title: Enabling nested Virtualization on Centos.
tags: [vms, vm, virtualization, centos, rhel]
---

I will be bried. To enable nested virtualization you need to parameterize your
kvm driver. Sounds hard, but it just as simple as creating `/etc/modprobe.d/kvm-nested.conf`
file with the following contents:

### for Intel processors
```
options kvm-intel nested=1
```

### for AMD processors
```
options kvm-amd nested=1
```

Then reboot, or reload the drivers. Rebooting is just easier.

To check that it is enabled check the parameters at the _sys_ filesystem:

```
cat /sys/module/kvm_intel/parameters/nested
```

or

```
cat /sys/module/kvm_amd/parameters/nested
```

The output should be Y or 1.

Cheer,

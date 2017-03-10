---
title: Adding commands to Yocto's native SDK
layout: post
tags: [yocto, embedded, linux]
---

Sometimes you may need to add some command so that it is
shipped with the SDK. To this write the recipe as any another
recipe. Once the recipe is working you can add this to it:

```
BBCLASSEXTEND = "nativesdk"
```

And the build with:

```
bitbake nativesdk-foo
```

Once `foo` and `nativesdk-foo` targets are
building fine you can add the new command to the SDK by
making `nativesdk-packagegroup-sdk-host` depend on it. Create
an bbappend for it and add the following:

``` meta-foolayer/recipes-core/packagegroup/nativesdk-packagegroup-sdk-host.bbappend
RDENEPDS_${PN} += "nativesdk-foo"
```

Before compiling SDK, what may take a long time, test to see if
the bbappend has taken effect for Yocto. Run `bitbake-layers show-appends` 
and look for lines below `nativesdk-packagegroup-sdk-host:`. If you
can't see your bbappend then something is wrong. Fix it!

After that build the SDK with `bitbake meta-toolchain`. The
SDK will be generated at `tmp/deploy/sdk` folder, and has
a name like `poky-eglibc-x86_64-meta-toolchain-cortexa9hf-vfp-neon-toolchain-1.6.2.sh`.
Run the script to install it.

Once installed setup the environment and test. The location of the
installation should change at each release/machine/architecture etc.

```
. /opt/poky/1.6.2/environment-setup-cortexa9hf-vfp-neon-poky-linux-gnueabi
foo
```

Thats it!
Cheers


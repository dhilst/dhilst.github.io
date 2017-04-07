---
layout: post
title: Online debugging on FreeBSD.
tags: [debug, FreeBSD]
---

Create a new configuration file for kernel and add `KDB` and `DDB` options to it.

```
bash
cd /usr/src/sys/amd64/conf
cp GENERIC DBG
cat <<EOS >> DBG
options KDB
options DDB
EOS
```

Compile and install kernel. After that reboot.

```
cd ../../../
make buildkernel KERNCONF=DBG
make installkernel KERNCONF=DBG
reboot
```

If your `/usr/src` is newer than ports tree you may need to update ports. For
This please follow the [handbook guide](https://www.freebsd.org/doc/handbook/makeworld.html).

You may need to enable debugger by issuing the command `sysctl
debug.debugger_on_panic=1`.

At kernel panic the ddb prompt will arise. You can use `bt` command for getting
a stack backtrace. You may need to enable debugger by issuing the command
`sysctl debug.debugger_on_panic=1`.

Tested on: `FreeBSD 10.3-STABLE #0 r316608`.

References:
http://www.freebsd.org/doc/en/books/developers-handbook/kerneldebug-online-ddb.html
https://www.freebsd.org/cgi/man.cgi?ddb(4)

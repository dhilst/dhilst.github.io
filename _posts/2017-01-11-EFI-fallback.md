---
layout: post
title: EFI boot fallback
---

On tuesday I arrive at my home, talk to my wife and after
some while decided to turn the computer on to pay a bill.
To my surprise I faced a black screen with a little "A2"
at the bottom right corner. After pushing all the cables
off and pluging all then again: black screen. After replacing
the motherboard battery a little message at POST and: black screen.

So one night passed, yesterday I just arrive and sleep at the
couch. Today I decided to do some researching. After unpluging
the HDD cable and boot the machine I could get, at least, the
BIOS screen, if we can still call it BIOS... 

Okay now I known that there is nothing wrong with the hardware
some something in software world gone wild. I've just reseted
the BIOS (or motherboard's FW) to factory defaults, disabled
legacy boot, save, reboot... Okay now I see Windows booting up.
Things were already better... but I want my beloved Linux up
and running since Windows are for pussies (my wife agreeds, I guess).

To my happines was not too hard to recovery from that disaster.
The EFI stuff holds a `EFI` folder where you may find some little
program called `fallback.efi`. To run this you have to reboot
at EFI shell and run this commands:

```
fs0:
cd EFI\BOOT
fallback.efi
```

This little 3 commands had samed my day. This little savior
will search for `BOOT.CSV` file recovering what was damaged.
After that the Fedora's boot entry appears again at BIOS
(which is not BIOS anymore), and I have just to setup the
right order.

I found this at this page: https://fedoraproject.org/wiki/GRUB_2

Thank you internet for being a so good resource for troubleshooting!!!

Cheers,

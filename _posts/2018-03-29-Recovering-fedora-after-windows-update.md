---
title: Recovering Fedora EFI boot after Windows update.
layout: post
tags: [boot, recovery, grub2, windows update,fedora]
---

Sometimes the Windows update break the Linux boot. This happened to me about 3
times while using Fedora and uncountable times in my life.

To fix you need:

* Boot with a live cd/flashdrive.
* Chroot to your system.
* Reinstall grub.

# Booting with live.

Cars break, computers break, installation, sometimes, break too. I learned to
always have a live flashdrive ready to boot my machine when something goes wrong
and upgraded this knowledge to another level. After installing a machine, leave
the live flashdrive there, quietly attached to the backpanel, go to your BIOS
and setup hard disk to boot prior than the flashdrive, and forget about it.

When the things go wrong, simply use the boot menu to boot the live image. There
are great chances that you use the flashdrive for something else if you let it
hanging on your desk, so leaving it attached at backpanel of your machine will
save you from looking for a free flashdrive, donwloading the ISO, burn it on the
flashdrive and finally boot to it. It may seem a wast of flashdrive, but, IMHO,
my time and patience worth more than a flashdrive, for sure.

After two paragraphs of advices I say, this step has no secret, if you never
booted a live CD you may reading this from windows and never faced the problem
here addressed. So, go use linux; else, you do know how to boot a live image.

## Chroot to your system.

This is a simple and nice tricky. You need to know what is the disk from where
you want to boot, usually is `/dev/sda` but this may change. Once you know the
disk you need to know the root filesystem where `/` is mounted. You can use
`parted <YOUR_DISK> print` to get a grasp of your partitions, for example:
`parted /dev/sda print`. This will print all their partitions, if you created
the partitions during the installation you may recognize it; otherwise you may need
to guess. Now if you are completely lost, you can always mount the partitions and
inspect what is on it. The root filesystem will contain the typical _FHS_
folders like _etc, usr, var, lib_, etc. I'll call it `<ROOT_PARITION>` from now
on.

Now you need to find out what is the EFI partition, this is easy. Is a little
(about 512M or 1G) partition with FAT32 filesystem, usually this is the first
partition (`/dev/sda1`). I will call this `<EFI_PARITITON>`

With your filesystem layout in mind let's mount everything. Replace the `<>`
tags by proper values.
```
mount <ROOT_PARTITION> /mnt
mount <EFI_PARITITON> /mnt/boot/efi
mount --bind /proc /mnt/proc
mount --bind /dev/ /mnt/dev
mount -t sysfs sysfs /mnt/sys
mount  --bind /run /mnt/run
chroot /mnt
```

Now you are on your system. Yay!!. Test the connectivity, you may need it. If
you can't ping internet check `/etc/resolv.conf`... Let's reinstall grub.

## Reinstalling grub2

I'm assuming grub2 with EFI here. If you are in BIOS world, well you may
travelled in time to the past while taking one printed copy of this post with
you, send me the lottery numbers and I can help you, otherwise you surely using
grub2 and EFI.

There are two steps, create the configuration and reinstalling the grub, here it
is:

```
cp /etc/grub2.cfg /etc/grub2.cfg.bkp # backups never hurts
grub2-mkconfig -o /etc/grub2.cfg
grub2-install
```

If you face `grub2-install: error: /usr/lib/grub/x86_64-efi/modinfo.sh doesn't
exist. Please specify --target or --directory` error during the `grub2-install`
install the `grub2-efi-x64-modules` package and try again. 

Now, cross your fingers and reboot.

Cheers,

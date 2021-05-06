---
title: How to get ç with ' + c on Gnome
tags: [gnome, ç, Xcompose]
layout: post
---

Basically you use [XCompose](https://wiki.debian.org/XCompose) to change the keymap from ć to ç. Here is how:

Create a `.XCompose` file in your home with this

```
include "%L"
<dead_acute> <c> : "ç"
```

Also since I'm using gnome I needed this in my `.xprofile`

```
export GTK_IM_MODULE=xim
```

Thanks [@FelipeOLTavares](https://twitter.com/FelipeOLTavares/status/1390315885181734912?s=20) for helping me with this.

Also [archwiki](https://wiki.archlinux.org/title/Xorg/Keyboard_configuration) has a page on .XCompose and pointed out the `.xprofile` need

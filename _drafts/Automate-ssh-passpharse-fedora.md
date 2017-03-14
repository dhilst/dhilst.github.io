---
layout: post
title: Automate ssh passphrase on Fedora 25.
---


/etc/xdg/autostart/gnome-keyring-ssh.desktop

```
#X-GNOME-Autostart-Phase=PreDisplayServer
#X-GNOME-AutoRestart=false
#X-GNOME-Autostart-Notify=true
```

/etc/xdg/autostart/gnome-keyring-ssh.desktop


```
[Desktop Entry]
Type=Application
Name=SSH Agent
Exec=/usr/bin/ssh-agent -a /tmp/ssh-agent.sock
X-GNOME-Autostart-Phase=PreDisplayServer

```

~/.bashrc

```
export SSH_AUTH_SOCK=/tmp/ssh-agent.sock
```

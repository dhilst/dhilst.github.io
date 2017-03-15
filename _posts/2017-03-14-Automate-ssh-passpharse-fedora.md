---
layout: post
title: Automate ssh login in Fedora 25
tags: [linux, ssh]
---
In this post I show how to automate the ssh login so that you
don't need to retype the password or passphrase every time. Besides
being Fedora based this may work in any other distribution.

A little note here. You can do this using gnome's keyring daemon, but
this one doesn't support ed25519 keys. Using the below approach you can
use any key format that you want. We'll be using ssh-agent instead of
gnome's keyring daemon.

# Setting up

The first thing is to generate the keys. This can be accomplished
by using the following command:

```
ssh-keygen
```

If you don't change the location the keys are generated at ~/.ssh/. It should
have at least two files there: `id_rsa` and `id_rsa.pub`. The first is your
private key and you must protect it with your life. The second is your public
key. This is the one that will be copied to other hosts so that you can login
there without password, but a passphrase instead. The same that you typed at
`ssh-keygen` command. You didn't left a blank passphrase right?


As I said I'm using gnome. If you do too you need to disable the ssh-agent
functionality.  You can do this by commenting out this lines at
`/etc/xdg/autostart/gnome-keyring-ssh.desktop`

```
#X-GNOME-Autostart-Phase=PreDisplayServer
#X-GNOME-AutoRestart=false
#X-GNOME-Autostart-Notify=true
```

After that you create another desktop file to start ssh-agent and
save it to same location: `/etc/xdg/autostart/`. The file is
shown below. I saved it as `/etc/xdg/autostart/ssh-agent.desktop`.
The name is not really important but the extension and location are.

```
[Desktop Entry]
Type=Application
Name=SSH Agent
Exec=/usr/bin/ssh-agent -a /tmp/ssh-agent.sock
X-GNOME-Autostart-Phase=PreDisplayServer
```

This will start `ssh-agent` and create the file `/tmp/ssh-agent.sock` file.
This file is used by `ssh-add` to communicate with `ssh-agent`. The last
step is to add the below to your `~/.bashrc`.


```
export SSH_AUTH_SOCK=/tmp/ssh-agent.sock
```

This variable is used by `ssh-add` and must point to the _unix socket_ created
by `ssh-agent`.

# Using

Reboot and verify that `ssh-agent` is running, that the `/tmp/ssh-agent.sock`
was created and that `SSH_AUTH_SOCK` is defined.

```
ps -ef | grep ssh-agent
ls -l /tmp/ssh-agent
env | grep SSH_AUTH_SOCK
```

To login to some host you need to copy the public key to it. There is a simple
command for doing that: `ssh-copy-id <user>@<hostname>`. After copying the key
you need to add the passphrase to the `ssh-agent`. You do this by running
`ssh-add` and typying the passphrase. After that you can login to the same host,
from the same as well as any other terminal without need to retype the passphrase.

If you have problems you may use `desktop-file-validate` command to validate
the `ssh-agent.desktop` file. Or you may leave a comment so I may help you.

Cheers!





---
layout: post
title: Sudo, still asking for password.
tags: [sudo, NOPASSWD, linux, unix]
---

If you setup sudo to not ask for password but it still do checkout this
post.

There is great chances that there is other lines in your sudoers file overriden
the `NOSPASSWD` rule. To check out do this `sudo -l`. You should see something like

```
Matching Defaults entries for dhilst on localhost:
    !visiblepw, env_reset, env_keep="COLORS DISPLAY HOSTNAME HISTSIZE KDEDIR LS_COLORS", env_keep+="MAIL PS1 PS2 QTDIR USERNAME LANG LC_ADDRESS LC_CTYPE", env_keep+="LC_COLLATE LC_IDENTIFICATION LC_MEASUREMENT
    LC_MESSAGES", env_keep+="LC_MONETARY LC_NAME LC_NUMERIC LC_PAPER LC_TELEPHONE", env_keep+="LC_TIME LC_ALL LANGUAGE LINGUAS _XKB_CHARSET XAUTHORITY", secure_path=/sbin\:/bin\:/usr/sbin\:/usr/bin

User dhilst may run the following commands on localhost:
    (ALL) NOPASSWD: ALL
```

If there are more lines after the `NOPASSWD` one then you may be in a group
that has its own rules in sudoers file. Check the file. You may want to ignore
comments so do this `sudo sed '/^#/d; /^ *$/d' /etc/sudoers` for ignore
comments and blank lines. If you are in a group that has its own rule you have
two options: 

1. Remove the rule for the group.
2. Remove your rule and setup `NOPASSWD` for the group.

After that `sudo -l` should show only NOPASSWD rule and you will not be asked for password anymore. :-)

Cheers, 



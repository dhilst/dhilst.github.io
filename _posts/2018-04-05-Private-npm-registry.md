---
layout: post
title: Private npm registry with https.
tags: [npm, private, nodejs, node, javascript]
---

Sometimes you want to give your colleagues access to some library but can't make
the code public. One option is get the paid version of _npm_ registry. Other is to
raise up a private _npm_ registry.

[verdaccio](http://www.verdaccio.org) is a _npm_ proxy and cache that is easy to
deploy. You can simply use the docker image as specified in
[README](https://github.com/verdaccio/verdaccio/#running-verdaccio-using-docker).
But here is how to do it for a machine. I'm using Centos 7.4 example and
_Epel_'s _nodejs_. 

# Install epel and nodejs

```bash
root@localhost:~ # yum install epel-release
root@localhost:~ # yum install nodejs
```

# Create a user, setup sudo and install verdaccio

```bash
root@localhost:~ # useradd npmuser
root@localhost:~ # passwd npmuser
root@localhost:~ # usermod -aG wheel npmuser
```

# Log with and install verdaccio and create the config file

```bash
root@localhost:~ # su - npmuser
npmuser@localhost:~ $ npm install -g verdaccio
npmuser@localhost:~ $ # Run it so it create the default config file
npmuser@localhost:~ $ verdaccio
```

Wait it to start then stop it with _Ctrl+C_

# Create a self signed certificate

```bash
npmuser@localhost:~/verdaccio $ cd verdaccio
npmuser@localhost:~/verdaccio $ openssl req -x509 -nodes -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -batch
```

# Configure verdaccio

```bash
npmuser@localhost:~/verdaccio $ cat << EOF > config.yaml

listen: https://`hostname -f`:4873

https:
  key: ${HOME}/verdaccio/key.pem
  cert: ${HOME}/verdaccio/cert.pem
  ca: ${HOME}verdaccio/cert.pem
EOF
```

_Note: If you hasn't DNS configured replace ``hostname -f`` by your IP address._

# Enable the port in firewall

```bash
npmuser@localhost:~/verdaccio $ sudo firewall-cmd --zone public --add-port=4873/tcp --permanent
npmuser@localhost:~/verdaccio $ sudo systemctl restart firewalld
```

# Test it

```bash
npmuser@localhost:~/verdaccio verdaccio
```

Navigate to http://<YOUR_DOMAIN_OR_IP>:4873. You should see the front end page
saying _No Package Published Yet_. Stop it with _Ctrl+C_.

# Create the systemd service

```bash
npmuser@localhost:~/verdaccio $ sudo cat <<EOF > /etc/systemd/system/verdaccio.service
[Unit]
Description=Private NPM registry.

[Service]
User=${USER}
WorkingDirectory=${HOME}
ExecStart=/bin/verdaccio
ExecStop=/usr/bin/killall verdaccio
EOF
```

# Enable it and start it.

```bash
npmuser@localhost:~/verdaccio $ sudo systmectl enable verdaccio.service
npmuser@localhost:~/verdaccio $ sudo systmectl start verdaccio.service
```

That's it! You can check for the logs by `journalctl -xf --unit
verdaccio.service`

# Remove sudo if needed

```bash
npmuser@localhost:~/verdaccio $ sudo gpasswd -d npmuser wheel
```

Cheers,

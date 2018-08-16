---
layout: post
title: How to install perl modules locally to a folder.
tags: [perl,linux]
---

If you are going to install a module for any languages there is always the
chance to install to system folders and break software from distribution that
relly on that modules. This is also true for perl modules.

If you mess up with the system modules you may have problems where the package
manager overwrite what you installed _by hand_, or even you will overwrite
modules installed by package manager and possibly break other software.

To deal with this most languages have a way to install modules or library to
some arbitrary folder and then load them from there. To do this with perl
you can use the `cpanm` command and `local::lib` module. To install `cpanm` on
Centos 7.5 use `perl-App-cpanminus` package.

Once installed you need to setup your environment. You can do this my running
`eval $(perl -Mlocal::lib=/opt/perl5)` for example to user `/opt/perl5` folder
as perl library root. `local::lib` when called in this manner output environment
needed to be set up on your shell. After that you can do `cpanm Acme::EyeDrops`
for example.

Just remember that if you close your session you need to rerun `eval $(perl
-Mlocal::lib=/opt/perl5)` to set your session up again. You can setup this on
`.bashrc` or anything that you want. If you forget it the modules installed at
that folder will not be found by perl.

Cheers

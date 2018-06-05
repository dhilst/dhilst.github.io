---
title: RESTFull with social (Facebook) authentication using django-rest-auth.
tags: [django, REST, Facebook, OAuth2]
---

In this tutorial I will show how to setup social authentication for RESTFull
APIs using `django`, `django-rest-framework`, `django-rest-auth`,
`djangorestframework-jwt` and `allauth`.

# My environment

For this tutorial I'll use python 3.6 and pip, you may use
[pipenv](https://github.com/pypa/pipenv) without any problems but since
everybody is still using pip I'll keep it to avoid introducing new tools. I'm
assuming that you have python 3.6 and pip installed. At any time that you see
`python` keep in mind that is a python 3.6 running here.


Usually I use [fish](https://fishshell.com/), but for keep things simple and
improve broad use I will use bash for the examples.

I'm running all this on a [Fedora 27](https://getfedora.org/) but since I'm not
relyinhg on anything OS specific this would work on any distro/OS, even Windows
and macOS.

# Creating virtual enviroment and installing dependecies

```shell
mkdir authexample
cd authexample
python -m venv py3env
. py3env/bin/activate.sh
```

This would be enough to create the virutalenv. For installing dependencies:

```shell
pip install django-rest-auth[with_social] djangorestframework-jwt
```

This would install everything you need.

# Creating the project and application.

First lets create a folder to keep our project

```shell
mkdir authexample
cd authexample
```

Then inside that folder let's create our project

```shell
django-admin startproject authexample
```

This may look redundant but I do really like to separate things as much as I
can. Now you would have a folder authexample side by side your virtualenv
(`py3env`) created before. This ensure that virtual environment leaves outside
of your project folder.

Next we will create the application, I prefer to keep things inside application
instead of in the projects, and to create the applications that wouldn't be
reused inside the project folder, so that the full package name is
`<PROJECT>.<APP>`. I will call my application `api` since is a
REST application but you may call it anything. The package name of this
application will be `authexample.api` which looks nice in the code.

```shell
cd authexample
mkdir authexample/api
./manage.py startapp api authexample/api
```

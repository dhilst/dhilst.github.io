---
layout: post
title: How to delete OTRS Webservice
tags: [otrs, OTRS]
---

If you search for a delete option in the Webservice at OTRS UI you'll
find nothing. But there is a way.

There is a script that can do this:

```
su -c 'bin/otrs.Console.pl Admin::WebService::Delete --webservice-id <ID>' - otrs
```

Where `<ID>` is the webservice id. You can find a list of webservices IDs with
this select


```
cat <<EOS | mysql -u root -p otrs
select id, name from gi_webservice_config;
EOS
```

Cheers

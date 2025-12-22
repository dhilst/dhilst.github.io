---
layout: post
tags: [rhel, nginx, rpm]
title: Caching RPM repositories with Nginx
---

I've been work in a project that requires installation
of a huge amount of packages during testing. I usually
setup the upstream repostiories, the problem with this
is that it keep downloading the same package again and
again and a lot of time and network bandwith could be
saved if the packages were cached locally.

Today I decided to spend some minutes looking into how
to do it with nginx. And it is pretty simple.

Here is the snippet that you would need.

	proxy_cache_path /var/cache/nginx/yum
	    levels=1:2
	    keys_zone=yumcache:100m
	    max_size=20g
	    inactive=30d
	    use_temp_path=off;

	server {
	    listen 8080;
	    listen [::]:8080;
	    location /cache/ {
		proxy_pass https://example.com/;
		proxy_cache yumcache;
		proxy_cache_valid 200 301 302 30d;
		proxy_cache_lock on;
		proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
		proxy_set_header Host example.com;
		proxy_ignore_headers Cache-Control Expires;
		add_header X-Cache $upstream_cache_status;
	    }
	}

To test use

	curl -Is localhost:8080/cache/<some_path_in_the_upstream> 2>&1 | grep X-Cache

You'll see

	X-Cache: MISS

or
	
	X-Cache: HIT

And that's it!


---
layout: post
title: Get your internet IP with this oneliner
tags: [myip, shell, oneliner]
---

Long time since the last post. Let's go straight to the point.
Ofter we need to know or IP. I got a ISP that loves to change 
my IP ofentenly. After googling _what is my ip_ for hundren of
times I decided to take a better approach

Well https://myip.com has an API that is really easy to consume. This
oneliner help me lot:

```
curl https://api.myip.com -s | perl -lane 'print $1 if /"ip":"(.*?)"/g'
```

You can save it as a function

```shell
myip() { curl https://api.myip.com -s | perl -lane 'print $1 if /"ip":"(.*?)"/g'; }
```

And this will save you a lot of boring googling

Cheers,


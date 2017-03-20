---
layout: post
---

```
git for-each-ref --sort=committerdate --format "\
%(HEAD) \
%(align:20)%(refname:short)%(end) \
%(align:59)%(color:red)%(upstream:short)%(color:reset)%(end) \
%(align:30)%(committeremail)%(end) \
%(align:30)%(color:green)%(committerdate)%(color:reset)%(end)"
```

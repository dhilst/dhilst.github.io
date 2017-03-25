---
layout: post
---

This may be usefull to find out what branches have been updated!

```
sh -c 'printf "H %-30s %-30s %-30s %-30s\n\n" refname upstream commiteremail commiterdate;
git for-each-ref --sort=committerdate --format "\
%(HEAD) \
%(align:30)%(refname:short)%(end) \
%(align:30)%(color:red)%(upstream:short)%(color:reset)%(end) \
%(align:30)%(committeremail)%(end) \
%(align:30)%(color:green)%(committerdate)%(color:reset)%(end)"'
```

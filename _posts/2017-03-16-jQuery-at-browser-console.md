---
layout: post
title: How to load jQuery at browser's console oneliner.
tags: [javascript, oneliner]
---

To load jQuery at Firefox's console copy and paste this code there: 

```
var a = new XMLHttpRequest(); a.open('GET', 'https://code.jquery.com/jquery-3.1.1.min.js'); a.onreadystatechange = () => eval(a.resultText); a.send();
```

After that you can access jQuery using `$` prefix:

```
$.ajax('GET', {url:'http://www.google.com'});
```

Cheers,


---
layout: post
title: Django, logging to console.
tags: [django, debugging, logging]
---

This is how to setup console logging in django. 

Setup `DEBUG=True` at `settings.py` and also add this `LOGGING` configuration: 

```
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

Tested with Django 2.1

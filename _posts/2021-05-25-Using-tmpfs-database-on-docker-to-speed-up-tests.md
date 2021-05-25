---
layout: post
title: Faster tests with tmpfs Database and Docker
tags: [tests, database, docker, docker-compose, tmpfs]
---

Here is how to creating a Postgres database in memory
for testing!

On your docker-compose replace the volume folter by a tmpfs entry, and you're done.

```patch
diff --git a/src/docker-compose-dev.yml b/src/docker-compose-dev.yml
index ead4090..7a10881 100644
--- a/src/docker-compose-dev.yml
+++ b/src/docker-compose-dev.yml
@@ -82,4 +82,5 @@ services:
     volumes:
-      - pg_dbdata:/var/lib/postgresql/data
       - ${PWD}/scripts/db/init/:/docker-entrypoint-initdb.d/
+    tmpfs:
+      - /var/lib/postgresql/data
     networks:
```

There are some drawbacks, the database will be reseted when the host machine is
rebooted, but for automating test this is okay! :)

Cheers!

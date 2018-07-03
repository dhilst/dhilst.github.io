---
layout: post
title: What process is generating I/O?
tags: [linux,io,pidstat,troubleshooting]
---

_I/O_ is almost always *THE* bootleneck. Here is a simple command
to find out what process is generating reads and writes in your system.

```bash
pidof -dul 5
```

This command will show you something like this: 

```console
03:59:29 PM   UID       PID    %usr %system  %guest    %CPU   CPU  Command
03:59:34 PM     0         2    0.00    0.20    0.00    0.20     0  kthreadd
03:59:34 PM     0         9    0.00    0.60    0.00    0.60     3  rcu_sched
03:59:34 PM     0       292    0.00    0.20    0.00    0.20     1  xfsaild/vda3
03:59:34 PM     0       436   45.80    2.60    0.00   48.40     3  /sbin/depmod -naeE ...
03:59:34 PM   202       726    0.00    0.20    0.00    0.20     2  /usr/sbin/slurmctld
03:59:34 PM     0     31799    4.80   10.80    0.00   15.60     0  xcatd: UDP listener
03:59:34 PM     0     32173    0.20    0.80    0.00    1.00     2  pidstat -dul 5

03:59:29 PM   UID       PID   kB_rd/s   kB_wr/s kB_ccwr/s  Command
03:59:34 PM     0       436   3528.00      0.00      0.00  /sbin/depmod -naeE ...
```

The last line is the process generating I/O. The `5` is the interval, 5 seconds, the options are the following (from manual):

```
       -d     Report I/O statistics (kernels 2.6.20 and later only).  The
              following values may be displayed:

              UID The real user identification number of the task being
              monitored.

              USER The name of the real user owning the task being monitored.

              PID The identification number of the task being monitored.

              kB_rd/s Number of kilobytes the task has caused to be read from
              disk per second.

              kB_wr/s Number of kilobytes the task has caused, or shall cause
              to be written to disk per second.

              kB_ccwr/s Number of kilobytes whose writing to disk has been
              cancelled by the task. This may occur when the task truncates
              some dirty pagecache. In this case, some IO which another task
              has been accounted for will not be happening.

              Command The command name of the task.


       -l     Display the process command name and all its arguments.


       -u     Report CPU utilization.

              When reporting statistics for individual tasks, the following
              values may be displayed:

              UID The real user identification number of the task being
              monitored.

              USER The name of the real user owning the task being monitored.

              PID The identification number of the task being monitored.

              %usr Percentage of CPU used by the task while executing at the
              user level (application), with or without nice priority. Note
              that this field does NOT include time spent  running  a  virtual
              processor.

              %system Percentage of CPU used by the task while executing at the
              system level (kernel).

              %guest Percentage of CPU spent by the task in virtual machine
              (running a virtual processor).

              %CPU Total  percentage  of  CPU  time used by the task. In an SMP
              environment, the task's CPU usage will be divided by the total
              number of CPU's if option -I has been entered on the command
              line.

              CPU Processor number to which the task is attached.

              Command The command name of the task. 
```

Cheers

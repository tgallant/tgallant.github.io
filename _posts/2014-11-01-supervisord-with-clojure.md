---
title: Manage Clojure Processes with supervisord
layout: post
category: clojure
---

Writing init scripts can be a pain and running your apps in tmux or screen sessions, while easier, seems unprofessional. That's where supervisord comes in. Supervisord provides an easy way to define and manage processes. It seems to be more well known in the python world, but it can be used to run any command on your system path.

Installing supervisord is easy. You can run `apt-get install supervisor` or `yum install supervisor` if you're on debian/redhat. If your distribution doesn't offer supervisor in it's packcage manager, you can install it via `pip install supervisor`. More info about installation can be found [here](http://supervisord.org/installing.html).

To have supervisord manage a ring app, place the following in `/etc/supervisor/conf.d`. Be sure to change out the program name, paths, and user.

{% highlight bash %}
[program:blog-checker]
command= /usr/local/bin/java -jar target/blog-checker-0.1.0-SNAPSHOT-standalone.jar
directory=/usr/local/www/blog-checker
autostart=true
autorestart=true
startretries=3
user=www
{% endhighlight %}

The above configuration executes `/usr/local/bin/java -jar target/blog-checker-0.1.0-SNAPSHOT-standalone.jar` as the user `www` in the `/usr/local/www/blog-checker` directory. Lines 4-6 set this app to be run at startup and to autorestart if it fails. 

To start the app, run `supervisorctl reread && supervisorctl update && supervisorctl start <your_app_name_here>`.

You can also run `supervisorctl status` to check the status of your app or `supervisorctl restart <your_app_name_here>` to restart it.
    

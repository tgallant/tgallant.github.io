---
title: Manage Clojure Processes with supervisord
layout: post
---

Writing init scripts can be a pain and running your apps in tmux or screen sessions, while easier, seems unprofessional. That's where supervisord comes in. Supervisord provides an easy way to define and manage processes. It seems to be more well known in the python world, but it can be used to run any command on your system path.

Installing supervisord is easy. You can run `apt-get install supervisor` or `yum install supervisor` if you're on debian/redhat. If your distribution doesn't offer supervisor in it's packcage manager, you can install it via `pip install supervisor`. More info about installation can be found [here](http://supervisord.org/installing.html).

To have supervisord manage a ring app, place the following in `/etc/supervisor/conf.d`. Be sure to change out the program name, paths, and user.

{% gist tgallant/877bc1a7b921adc8b969 %}

The above configuration executes `/usr/local/bin/java -jar target/blog-checker-0.1.0-SNAPSHOT-standalone.jar` as the user `www` in the `/usr/local/www/blog-checker` directory. Lines 4-6 set this app to be run at startup and to autorestart if it fails. 

To start the app, run `supervisorctl reread && supervisorctl update && supervisorctl start <your_app_name_here>`.

You can also run `supervisorctl status` to check the status of your app or `supervisorctl restart <your_app_name_here>` to restart it.

<div id="disqus_thread"></div>
<script type="text/javascript">
/* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
var disqus_shortname = 'schemerocks'; // required: replace example with your forum shortname
/* * * DON'T EDIT BELOW THIS LINE * * */
(function() {
var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
})();
</script>
<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
    
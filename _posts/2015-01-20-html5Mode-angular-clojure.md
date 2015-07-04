---
title: html5Mode in Angular and Clojure
layout: post
category: clojure
---

-   benefits of angularjs html5mode
    -   native looking urls
-   drawbacks of html5mode
    -   not sharable
-   solutions
    -   send all traffic to index.hmtl
    -   <https://github.com/tgallant/angular-seed-clj>

Its probably a purely aesthetic thing, but I'm not a big fan of the
default angularjs urls. I feel having the '#' in there hinders
usability. A project's url structure is more discoverable when it is
familiar to the user. This is where html5Mode can be handy. It will
turn your urls from this

{% highlight bash %}
GET /home/#/dashboard
{% endhighlight %}

to this

{% highlight bash %}
GET /home/dashboard
{% endhighlight %}

This gets us the url structure we want, but these links are in fact
not sharable. If your application is using html5Mode, the url that
shows up in the browser can't be copy and pasted. Instead of bringing
up the requested page it will throw a 404. This is because the server
is not aware that angular is controlling all of the routes. To get
sharable links with html5Mode the server needs to let angular handle
the application routing.

In nginx this is done by using `try_files` like so

{% highlight nginx %}
location / {
  root /path/to/files;
  try_files $uri $uri/ /index.html;
}
{% endhighlight %}

If nginx doesn't get a valid response from the actual url path, it
will send the request to the index.html file, at which point angularjs
will initialize and handle the url parameters. This is a handy trick
that we can actually implement in our server-side code.

In compojure this is done by specifying a wildcard route like so

{% highlight clojure %}
(defroutes app-routes
  (GET "/" [] (index-page))
  (GET "/api/repo/" [] (api/repo-info))
  (POST "/api/init/" request (api/new-repo (get-in request [:body :name])))
  (GET "*" [] (index-page))
  (route/resources "/")
  (route/not-found "Not Found"))
{% endhighlight %}

In compojure the asterisk stands for the wildcard route. It will match
any route that has not yet been matched. When using wildcards it is
important to put them after all of your defined routes like in the
example above. If a route is defined after the wildcard it will never
be run.

I really like how this clojure/angularjs html5mode setup separates the
concerns of API routes and application routes. Angular takes care of
all browser facing routes while clojure deals with API routes and
database calls. All of this while maintaining our nice clean URI
structure. Hashtags belong on twitter, not in urls!

I've put together a github repo with all of this stuff already setup. Check it
out here <https://github.com/tgallant/angular-seed-clj>.
---
title: Grunt Livereload for Clojurescript
layout: post
---

[Link to Gruntfile.js if you know what you're doing](https://github.com/tgallant/cljs-livereload-example/blob/master/Gruntfile.js)

The front-end tooling ecosystem that has emerged around node allows for many modern niceties like npm, bower, and grunt. As helpful as these tools can be, they can also bring about a boiling, unfathomable rage when they stop working or, perhaps, don't work at all. See the following tweet from Joe Armstrong, creator of erlang and all-around badass

<center>
<blockquote class="twitter-tweet" lang="en"><p>&quot;Unable to find local grunt&quot; - but I just installed grunt - Aaaaaaggggg - &#10;having a bad day ...</p>&mdash; Joe Armstrong (@joeerl) <a href="https://twitter.com/joeerl/status/505337612513853441">August 29, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

Joe's Gruntrage&trade; led him to mention this experience in his aptly titled talk, [The Mess We're In](https://www.youtube.com/watch?v=lKXe3HUG2l4).

Now, this isn't a post about bashing grunt or node. I actually advocate for their use and think grunt can allow for some pretty awesome clojurescript workflows. I will show you how to get started with a livereload clojurescript workflow and make sure you don't have any "bad days."

<hr>

[Here](https://github.com/tgallant/cljs-livereload-example) is a working github repo if you need help or just want to get started right away.

Start by creating a new clojure project by running `lein new app example`. Once that is complete, edit `project.clj` so it looks like the following. Be sure to include any other dependencies you will need. The main things to keep an eye on here are the inclusion of `lein-cljsbuild` and the paths for `:output-to` and `:output-dir`.  

<script src="https://gist.github.com/tgallant/450b0361b06a5de7bcd8.js"></script>

Next, install node and npm if you don't have them already. For ubuntu/debian based distros, run `sudo apt-get install npm`. This will rope in node and all of the other packages you'll need to get started. Next, install grunt by running `sudo npm install -g grunt-cli`. Once you have node, npm, and grunt, create a file called `package.json` in your project directory and add the following:

<script src="https://gist.github.com/tgallant/e2935dc79395de03c9b4.js"></script>

This file lists the node dependencies you'll need to enable livereload. Run `npm install` in your project directory to install them locally. 

Now for the fun part. Create a file called `Gruntfile.js` in your project directory and add the following:

<script src="https://gist.github.com/tgallant/682ad1d6ee3fd63d42c2.js"></script>

This configuration will allow you to compile your clojurescript, automatically open the app in your browser, and recompile/refresh your browser when you make a change.

Let's write some really quick clojurescript to get you started.
<hr>

First, in your project directory, run `mkdir -p resources/public/scripts` and create a new file at `resources/public/index.html`. Make sure your index.html looks like this

<script src="https://gist.github.com/tgallant/b9229ffed14537ac6e5d.js"></script>

Then, create a new file at `src/example/core.cljs` and add the following

<script src="https://gist.github.com/tgallant/822f92bce8386d6171b0.js"></script>

Before you start the livereload, run `lein cljsbuild once` so you don't have to wait for the code to compile when you launch the server for the first time. Once that's complete, run `grunt server` in your project directory and let the grunt magic do the rest. Open the javascript console in your browser and you should see "Hello!". Modify `src/example/core.cljs`, save it, and watch your code compile and refresh in your browser! Pretty cool.

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
    

---
title: Grunt Livereload for Clojurescript
layout: post
category: clojure
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

<pre><code>
(defproject example "0.1.0-SNAPSHOT"
  :description "FIXME: write description"
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
 
  :jvm-opts ^:replace ["-Xmx1g" "-server"]
 
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2371"]]
 
  :plugins [[lein-cljsbuild "1.0.3"]]
 
  :source-paths ["src/"]
  :resource-paths ["resources"]
 
  :cljsbuild {
    :builds [{:id "dev"
              :source-paths ["src/"]
              :compiler {
                :output-to "resources/public/scripts/main.js"
                :output-dir "resources/public/scripts/out"
                :optimizations :none
                :source-map true}}]})
</code></pre>

Next, install node and npm if you don't have them already. For ubuntu/debian based distros, run `sudo apt-get install npm`. This will rope in node and all of the other packages you'll need to get started. Next, install grunt by running `sudo npm install -g grunt-cli`. Once you have node, npm, and grunt, create a file called `package.json` in your project directory and add the following:

<pre><code>
{
  "name": "example",
  "version": "0.0.1",
  "devDependencies": {},
  "dependencies": {
    "grunt": "~0.4.5",
    "grunt-contrib-watch": "~0.6.1",
    "grunt-express": "~1.4.1",
    "grunt-open": "~0.2.3",
    "matchdep": "~0.3.0"
  },
 "engines": {
   "node": ">=0.8.0"
 }
}
</code></pre>

This file lists the node dependencies you'll need to enable livereload. Run `npm install` in your project directory to install them locally. 

Now for the fun part. Create a file called `Gruntfile.js` in your project directory and add the following:

<pre><code>
// Gruntfile
module.exports = function(grunt) {
 
  require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);
 
  // Configure Grunt
  grunt.initConfig({
 
      // grunt-express will serve the files from the folders listed in `bases`
      // on specified `port` and `hostname`
      express: {
        all: {
          options: {
            port: 9000,
            hostname: "0.0.0.0",
            bases: ['resources/public/'],
            livereload: true
          }
        }
      },
 
      // grunt-watch will monitor the projects files
      watch: {
        all: {
          files: ['resources/public/*',
                  '!**/bower_components/**'],
          options: {
            livereload: true
          }
        }
      },
 
      // grunt-open will open your browser at the project's URL
      open: {
        all: {
          // Gets the port from the connect configuration
          path: 'http://127.0.0.1:<%= express.all.options.port%>'
        }
      }
  });
 
  // Creates the `lein` task
  grunt.registerTask('lein', 'compile cljs.', function() {
    var spawn = require('child_process').spawn;
    grunt.log.writeln('Compiling cljs.');
    var PIPE = {stdio: 'inherit'};
    spawn('lein', ['cljsbuild', 'auto'], PIPE);
  });
 
 // Creates the `server` task
  grunt.registerTask('server', [
    'lein',
    'express',
    'open',
    'watch'
  ]);
};
</code></pre>

This configuration will allow you to compile your clojurescript, automatically open the app in your browser, and recompile/refresh your browser when you make a change.

Let's write some really quick clojurescript to get you started.
<hr>

First, in your project directory, run `mkdir -p resources/public/scripts` and create a new file at `resources/public/index.html`. Make sure your index.html looks like this


    <!DOCTYPE html>
    <html>
      <body>
        <script src="scripts/out/goog/base.js" type="text/javascript"></script>
        <script src="scripts/main.js" type="text/javascript"></script>
        <script type="text/javascript">goog.require("example.core");</script>
      </body>
    </html>

Then, create a new file at `src/example/core.cljs` and add the following

<pre><code>
(ns example.core)
 
(enable-console-print!)
 
(.log js/console "Hello!")
</code></pre>

Before you start the livereload, run `lein cljsbuild once` so you don't have to wait for the code to compile when you launch the server for the first time. Once that's complete, run `grunt server` in your project directory and let the grunt magic do the rest. Open the javascript console in your browser and you should see "Hello!". Modify `src/example/core.cljs`, save it, and watch your code compile and refresh in your browser! Pretty cool.

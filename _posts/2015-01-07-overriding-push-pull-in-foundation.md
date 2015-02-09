---
title: Overriding Push/Pull in Foundation
layout: post
category: web
---

[example of the problem](http://jsfiddle.net/z54p61wh/1/)

[example of the solution](http://jsfiddle.net/p97zymha/)

If you are stuck using older versions of foundation, medium-push/pull
will override the default positioning for `large-#` blocks. To fix this
you can use media queries to set them back to normal.

In the example below, small and large screens will stack the divs
vertically. Then, medium screens will stack the divs horizontally with
their order switched.


    <div class="iBox">
      <div class="row" style="margin: 0;">
        <div class="imgWrapper small-12 medium-6 medium-push-6 large-12 columns">
          <h1>hello</h1>
        </div>
        <div class="contentWrapper small-12 medium-6 medium-pull-6 large-12 columns">
          <div class="content">
            <h1>there</h1>
          </div>
        </div>
      </div>
    </div>

<pre><code>
/*** Desktop ***/ 
@media only screen and (min-width: 64.063em) {
    .iBox .imgWrapper {
      left:0%;
    }
    .iBox .contentWrapper {
      right:0%;
    }
}
</code></pre>

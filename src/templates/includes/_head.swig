<head>
 	<meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
 	<meta name="viewport" id="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="">
  <meta name="author" content="Wild Dog Design">

  {# Will be picked up from ./data/pages.json #}
  {% for p in pages %}
    {% if page == p.page %}
      <title>{{p.title}} | {{config.title}}</title>
    {% endif %}
  {% endfor %}

  <!-- Set up preconnect -->
  <link href='//fonts.gstatic.com' rel='preconnect' crossorigin>

  {% if critical %}

    <!-- Inline critical styles -->
    <link href="assets/css/critical.css?__inline=true" rel="stylesheet" />

    <script id="criticalCss">
    /*!
    loadCSS: load a CSS file asynchronously.
    [c]2015 @scottjehl, Filament Group, Inc.
    Licensed MIT
    */
    (function(w,undefined){
      "use strict";
      var loadCSS=function(e,n,t){var o,l=w.document,r=l.createElement("link");if(n)o=n;else{var a=(l.body||l.getElementsByTagName("head")[0]).childNodes;o=a[a.length-1]}var d=l.styleSheets;r.rel="stylesheet",r.href=e,r.media="only x",o.parentNode.insertBefore(r,n?o:o.nextSibling);var i=function(e){for(var n=r.href,t=d.length;t--;)if(d[t].href===n)return e();setTimeout(function(){i(e)})};return r.onloadcssdefined=i,i(function(){r.media=t||"all"}),r};"undefined"!=typeof module?module.exports=loadCSS:w.loadCSS=loadCSS;

      @@critical

    }( typeof global !== "undefined" ? global : this ));
    </script>

    <noscript>
      <!-- When JavaScript is disabled, load the rest of the styles in a tag -->
  {% endif %}

  <link rel="stylesheet" href="assets/css/main.css" />

  {% if critical %}
    </noscript>
  {% endif %}

  <script src="assets/js/libs/modernizr-custom.js"></script>


</head>
const merge = require('webpack-merge');

// const AsyncStylesheetWebpackPlugin = require('async-stylesheet-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin-wilddog')
  .default;
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
// Runs images through imagemin when copying
const ImageminPlugin = require('imagemin-webpack-plugin').default;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin');
const criticalSplit = require('postcss-critical-split');
const common = require('./webpack.common.js');

const afterHTMLWebpackPlugin = [
  // new AsyncStylesheetWebpackPlugin({
  //   preloadPolyfill: true,
  // }),
  new PreloadWebpackPlugin(),
  new HTMLInlineCSSWebpackPlugin({
    filter(fileName) {
      return fileName.includes('critical.css');
    },
    replace: {
      target: '<!-- inline_css_plugin -->',
      position: 'before',
      removeTarget: true,
      leaveCssFile: true,
    },
  }),
  // new PreloadWebpackPlugin(),
];

module.exports = merge(common, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader?url=false',
          'sass-loader',
        ],
        // post css config in /src/sass/postcss.config.js
      },
    ],
  },
  plugins: [
    // Extracts the CSS into a file with the provided name
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: 'critical',
      pipeline: [
        criticalSplit({
          output: criticalSplit.output_types.CRITICAL_CSS,
        }),
      ],
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: '',
      predicate: (name) => /^((?!critical).)*$/.test(name),
      pipeline: [
        criticalSplit({
          output: criticalSplit.output_types.REST_CSS,
        }),
      ],
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: '',
      pipeline: [
        require('autoprefixer')(),
        require('cssnano')(),
        require('postcss-inline-svg')({ path: './src/css/' }),
        require('postcss-svgo')(),
      ],
    }),
    new ReplaceInFileWebpackPlugin([
      {
        dir: 'dist/',
        test: /\.html$/,
        rules: [
          {
            search: /\.\.\//gm,
            replace: '/assets/',
          },
        ],
      },
      {
        dir: 'dist/',
        test: /service-worker\.js$/,
        rules: [
          {
            search: /#VERSION_NO#/,
            replace: new Date().toISOString(),
          },
        ],
      },
      {
        dir: 'dist/',
        test: /\.html$/,
        rules: [
          {
            search: '<!-- critial_script_plugin -->',
            replace: `<script id="criticalCss">
    !function(a){"use strict";var b=function(b,c,d){function j(a){return e.body?a():void setTimeout(function(){j(a)})}function l(){f.addEventListener&&f.removeEventListener("load",l),f.media=d||"all"}var g,e=a.document,f=e.createElement("link");if(c)g=c;else{var h=(e.body||e.getElementsByTagName("head")[0]).childNodes;g=h[h.length-1]}var i=e.styleSheets;f.rel="stylesheet",f.href=b,f.media="only x",j(function(){g.parentNode.insertBefore(f,c?g:g.nextSibling)});var k=function(a){for(var b=f.href,c=i.length;c--;)if(i[c].href===b)return a();setTimeout(function(){k(a)})};return f.addEventListener&&f.addEventListener("load",l),f.onloadcssdefined=k,k(l),f};"undefined"!=typeof exports?exports.loadCSS=b:a.loadCSS=b}("undefined"!=typeof global?global:this),function(a){if(a.loadCSS){var b=loadCSS.relpreload={};if(b.support=function(){try{return a.document.createElement("link").relList.supports("preload")}catch(a){ }},b.poly=function(){for(var b=a.document.getElementsByTagName("link"),c=0;c<b.length;c++){var d=b[c];"preload"===d.rel&&"style"===d.getAttribute("as")&&(a.loadCSS(d.href,d),d.rel=null) }},!b.support()){b.poly();var c=a.setInterval(b.poly,300);a.addEventListener&&a.addEventListener("load",function(){a.clearInterval(c)}) }}}(this);
  </script>`,
          },
        ],
      },
    ]),
    new ImageminPlugin({
      test: 'assets/images/**',
    }),
  ].concat(afterHTMLWebpackPlugin),
});

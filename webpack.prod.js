const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin')
const AsyncStylesheetWebpackPlugin = require('async-stylesheet-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin-wilddog").default;

const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin');
const criticalSplit = require('postcss-critical-split');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcssInlineSvg = require('postcss-inline-svg');
const postcssSvgo = require('postcss-svgo');

const afterHTMLWebpackPlugin = [
  new WebappWebpackPlugin({
    favicons: {
      name: 'Colfe\'s Leisure',
      short_name: 'Colfes',
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      description: '',
      background_color: '#F44336',
    },
    prefix: 'assets/favicons',
    logo: path.resolve('src/misc/whippet.png'),
    cache: true
  }),
  new HtmlBeautifyPlugin(),
  new AsyncStylesheetWebpackPlugin(),
  new HTMLInlineCSSWebpackPlugin({
    filter(fileName) {
      return fileName.includes('critical.css');
    },
    replace: {
      target: '<!-- inline_css_plugin -->',
      position: 'before',
      removeTarget: true,
      leaveCssFile: true
    }
  }),
];

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new PostCssPipelineWebpackPlugin({
      suffix: 'critical',
      pipeline: [
        criticalSplit({
          output: criticalSplit.output_types.CRITICAL_CSS
        })
      ]
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: '',
      pipeline: [
        autoprefixer(),
        cssnano(),
        postcssInlineSvg(),
        postcssSvgo()
      ]
    })
  ].concat(afterHTMLWebpackPlugin)
});

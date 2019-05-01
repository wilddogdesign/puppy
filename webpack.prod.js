const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin')
const AsyncStylesheetWebpackPlugin = require('async-stylesheet-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin-wilddog").default;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PostCssPipelineWebpackPlugin = require('postcss-pipeline-webpack-plugin');
const criticalSplit = require('postcss-critical-split');

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
    logo: path.resolve('src/misc/favicon.png'),
    cache: true
  }),
  new HtmlBeautifyPlugin(),
  new AsyncStylesheetWebpackPlugin({
    preloadPolyfill: true,
  }),
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
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader?url=false', 'sass-loader'],
        // post css config in /src/sass/postcss.config.js
      },
    ]
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
          output: criticalSplit.output_types.CRITICAL_CSS
        })
      ]
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: '',
      pipeline: [
        require('autoprefixer')(),
        require('cssnano')(),
        require('postcss-inline-svg')({ path: './src/css/' }),
        require('postcss-svgo')(),
      ]
    })
  ].concat(afterHTMLWebpackPlugin)
});

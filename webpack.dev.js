const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Merge lets us merge to configs 🤷‍♂️
module.exports = merge(common, {
  mode: 'development',
  watchOptions: {
    ignored: /node_modules/
  },
  // Add inline source maps
  devtool: 'inline-source-map',
  // Setup the dev server
  devServer: {
    port: 8888,
    contentBase: path.join(__dirname, '/src'),
    stats: {
      hash: false,
      version: false,
      timings: false,
      assets: false,
      chunks: false,
      modules: false,
      reasons: false,
      children: false,
      source: false,
      errors: true,
      errorDetails: true,
      warnings: true,
      publicPath: false
    }
  },
});

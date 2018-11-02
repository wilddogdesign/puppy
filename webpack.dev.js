const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Merge lets us merge to configs 🤷‍♂️
module.exports = merge(common, {
  mode: 'development',
  // Add inline source maps
  devtool: 'inline-source-map',
  // Setup the dev server
  devServer: {
    port: 8888,
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

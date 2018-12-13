const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const os = require('os');

// Merge lets us merge two configs 🤷‍♂️
module.exports = merge(common, {
  mode: 'development',
  // Don't watch node_modules
  watchOptions: {
    ignored: /node_modules/
  },
  // Add inline source maps
  devtool: 'inline-source-map',
  // Setup the dev server
  devServer: {
    // Serve assets from src
    contentBase: path.join(__dirname, '/src'),
    // use machine name as URL for easy sharing around office.
    host: os.hostname().toLowerCase(),
    // Not a fan of a lot of this output
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

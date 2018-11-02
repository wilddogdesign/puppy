const merge = require('webpack-merge');
const common = require('./webpack.common.js');

// Merge lets us merge to configs 🤷‍♂️
module.exports = merge(common, {
  mode: 'development',
  // Add inline source maps
  devtool: 'inline-source-map',
  // Setup the dev server
  devServer: {
    port: 8888
  },
});

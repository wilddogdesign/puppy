// Critters will inline any CSS class used on the page.
const Critters = require('critters-webpack-plugin');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    // Is critters too heavy handed?
    new Critters(),
  ]
});

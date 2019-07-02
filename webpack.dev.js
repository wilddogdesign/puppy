const path = require('path');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const common = require('./webpack.common.js');

// Extracts our CSS into a file because webpack doesn't do that by default

// Merge lets us merge two configs 🤷‍♂️
module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      // Run sass through sass-loader, then postcss, then css loader before finally extracting.
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
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
  ],
  // Don't watch node_modules
  watchOptions: {
    ignored: /node_modules/,
  },
  // Add inline source maps
  devtool: 'inline-source-map',
  // Setup the dev server
  devServer: {
    // Serve assets from src
    contentBase: path.join(__dirname, '/src'),
    port: 8888,
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
      publicPath: false,
    },
  },
});

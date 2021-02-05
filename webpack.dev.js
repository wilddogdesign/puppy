const path = require('path');
const merge = require('webpack-merge');
const chokidar = require('chokidar');
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
          { loader: 'style-loader' },
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
              data: `$asset-dir: "${process.env.ASSET_DIR || '/assets'}";`,
            },
          },
        ],
        // post css config in /src/sass/postcss.config.js
      },
    ],
  },
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
    // port: 8888,
    clientLogLevel: 'error',
    // watch nunjucks and reload page now we have HMR on
    before(app, server) {
      chokidar.watch(['./src/templates/**/*.njk']).on('all', function () {
        server.sockWrite(server.sockets, 'content-changed');
      });
    },
    // passes url to afterStart command (if any)
    // replaces %URL% in the afterStart command with the URL of the instance
    // useful for things like booting all simulated devices to the same url
    after(app, server) {
      const url = `http://${server.options.host}:${server.options.port}${server.options.publicPath}`;
      const projectPackage = require('./package.json');
      const { exec } = require('child_process');
      const afterStartCommand = projectPackage.scripts.afterStart || false;
      if (afterStartCommand) {
        const command = projectPackage.scripts.afterStart.replace(
          /%URL%/g,
          url
        );
        exec(command); // fails silently
      }
    },
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

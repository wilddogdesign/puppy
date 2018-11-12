// Everything in webpack.common is shared between dev and prod

// Variables for use in the all template.
const projectTitle = 'Wile Webpack Whippet';
const now = new Date();

// Path and webpack are required
const path = require('path');
const webpack = require('webpack');
// Date formatting plugin for the all template
const dateFormat = require('dateformat');

// Import plugins for use later on

// Cleans folders (read deletes 😉)
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Copies file from one place to another without touching them
const CopyWebpackPlugin = require('copy-webpack-plugin');
// This stops webpack generating a js file if our entry point is a style file
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
// HTMLWebPackPlugin injects files etc into our HTML
const HtmlWebPackPlugin = require('html-webpack-plugin');
// Extracts our CSS into a file because webpack doesn't do that by default
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// Allows us to lint our sass
const SassLintPlugin = require('sass-lint-webpack');
// Adds async tags to our scripts
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// Allows us to make an SVG sprite for including SVGs on page
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
// Tidy the generated HTML
const HtmlBeautifyPlugin = require('html-beautify-webpack-plugin');
// Generates a progessive web app manifest file
const WebpackPwaManifest = require('webpack-pwa-manifest');

// this person is a hero
// https://dev.to/rodeghiero_/multiple-html-files-with-htmlwebpackplugin-19bf
// The first HTMLWebPackPlugin for generating the index.html via nunjucks-html-loader
const HtmlWebPackPluginConfig = new HtmlWebPackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: 'nunjucks-html-loader!./src/templates/index.njk',
});

// Our other pages.
const otherNunjucksFiles = require('./pages.js');

// Generate a new HTMLWebPackPlugin for each template because you have to.
// We append to plugins down the bottom.
const multipleFiles = otherNunjucksFiles.map((entry) => {
  return new HtmlWebPackPlugin({
    filename: `${entry.file}.html`,
    template: `nunjucks-html-loader!./src/templates/${entry.file}.njk`,
    inject: entry.file !== 'all',
  });
});

// Generate a manifest using the provided images and tidy the html AFTER Html
const afterHTMLWebpackPlugin = [new WebpackPwaManifest({
  name: 'Wile Webpack Whippet',
  short_name: 'WWWhippet',
  orientation: 'portrait',
  display: 'standalone',
  start_url: '.',
  inject: true,
  description: 'Some description about the Whippet',
  background_color: '#F44336',
  ios: {
    'apple-mobile-web-app-status-bar-style': 'black'
  },
  icons: [
    {
      src: path.resolve('src/misc/whippet.png'),
      sizes: [96, 128, 192, 256, 384, 512, 1024],
      destination: '/assets/favicons',
    },
  ],
}), new HtmlBeautifyPlugin()];

module.exports = {
  // Entry files are the files webpack will run against so we set our main js and sass
  // along with their output locations
  entry: {
    'assets/js/main': './src/js/main.js',
    'assets/css/main': './src/sass/main.scss',
  },
  // modules are how we want certain files to be interacted with / things to run them through
  module: {
    rules: [
      // run html and nunjucks through the nunjucks and html loader
      {
        test: /\.html$|njk|nunjucks/,
        use: [
          'html-loader',
          {
            loader: 'nunjucks-html-loader',
            options: {
              // where are the nunjucks files?
              searchPaths: ['./src/templates'],
              // content is passed into every nunjucks file to be used like {{ kenobi }}
              context: {
                nowYear: dateFormat(now, 'yyyy'),
                now: dateFormat(now, 'dd-mm-yyyy @ HH:MM'),
                pages: [{ file: 'index', name: 'Index' }].concat(otherNunjucksFiles),
                projectTitle,
              },
            },
          },
        ],
      },
      // run all images through image processing and if smaller than 10kb inline into HTML
      {
        test: /\.(png|jpe?g|gif|svg)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: './assets/images/[name].[ext]',
              limit: 10000,
            },
          },
          {
            loader: 'img-loader',
          },
        ],
      },
      // Run sass through sass-loader, then postcss, then css loader before finally extracting.
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        // post css config in /src/sass/postcss.config.js
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              include: [path.resolve(__dirname, 'src/assets/fonts')],
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        // Pre runs before other matching files
        enforce: 'pre',
        test: /\.js$/,
        // Do not eslint node_modules or flightplan
        exclude: [/node_modules/, /flightplan.js/],
        use: {
          loader: 'eslint-loader',
        },
        // eslint config in .eslintrc. Uses airbnb base but turns off a few pet peeves
      },
      // Runs our js through babel to make it friendly with all browsers
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    // Runs the first HTMLWebPackPlugin for index
    HtmlWebPackPluginConfig,
    // Adds async to all JS files inserted
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    // Runs sass lint against our sass files
    new SassLintPlugin({
      files: './src/sass/**/*.scss',
    }),
    // Run the plugin to stop a js file being generated for the CSS
    new FixStyleOnlyEntriesPlugin(),
    // Extracts the CSS into a file with the provided name
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    // Copy the service worker to dist root. We can't run it through webpack as it adds
    // code related to window etc.
    new CopyWebpackPlugin([
      { from: './src/js/service-worker.js' }
    ]),
    // Generate the SVG sprite
    new SVGSpritemapPlugin({
      src: './src/icons/*.svg',
      filename: 'assets/icons/icons.svg',
      styles: false,
      svgo: true,
    }),
    // Clean the dist folder before doing things
    new CleanWebpackPlugin(['dist'])
  // Add on the extra HTMLWebPackPlugins for the other pages
  // WebpackPwa has to be after all html webpack plugins
  ].concat(multipleFiles).concat(afterHTMLWebpackPlugin),
  // We want our files from the entry point to have names like this and go into dist
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

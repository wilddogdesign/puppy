// Everything in webpack.common is shared between dev and prod

// Variables for use in the all template.
const projectTitle = 'Puppy';
const now = new Date();

const { readdirSync, readFileSync } = require('fs');
// Path and webpack are required
const path = require('path');
const webpack = require('webpack');
// Date formatting plugin for the all template
const dateFormat = require('dateformat');

// Cleans folders (read deletes 😉)
const CleanWebpackPlugin = require('clean-webpack-plugin');
// Copies file from one place to another without touching them
const CopyWebpackPlugin = require('copy-webpack-plugin');
// This stops webpack generating a js file if our entry point is a style file
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
// HTMLWebPackPlugin injects files etc into our HTML
const HtmlWebPackPlugin = require('html-webpack-plugin');
// Allows us to lint our sass
const SassLintPlugin = require('sass-lint-webpack');
// Adds async tags to our scripts
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
// Allows us to make an SVG sprite for including SVGs on page
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
// Generates a progressive web app manifest file and favicons
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const envCallback = require('./nunjucks.env');

// this person is a hero
// https://dev.to/rodeghiero_/multiple-html-files-with-htmlwebpackplugin-19bf
// The first HTMLWebPackPlugin for generating the index.html via nunjucks-html-loader
const HtmlWebPackPluginConfig = new HtmlWebPackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: 'nunjucks-html-loader!./src/templates/index.njk',
  templateParameters: {
    envCallback,
  },
  // easier for back-end to copy html over.
  minify: false,
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
    templateParameters: {
      envCallback,
    },
  });
});

// Generate a manifest using the provided images and tidy the html AFTER Html
const afterHTMLWebpackPlugin = [
  // https://github.com/jantimon/favicons-webpack-plugin#advanced-usage
  new FaviconsWebpackPlugin({
    // https://github.com/itgalaxy/favicons#usage
    favicons: {
      name: 'Puppy',
      short_name: 'puppy',
      // lang: "en-GB",
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      description: '',
      background_color: '#F44336',
    },
    prefix: 'assets/favicons',
    logo: path.resolve('src/misc/favicon.png'),
    cache: true,
    publicPath: '/',
    outputPath: '/assets/favicons',
    inject: true,
  }),
];

// Get mock data from json files in src/mockData folder
const mockData = () => {
  const data = {};

  const dir = path.join(__dirname, 'src/mockData');
  const files = readdirSync(dir);

  files.forEach((file) => {
    const i = file.indexOf('.json');

    if (i > -1) {
      data[file.slice(0, i)] = JSON.parse(readFileSync(path.join(dir, file)));
    }
  });

  return data;
};

module.exports = {
  // Entry files are the files webpack will run against so we set our main js and sass
  // along with their output locations
  entry: {
    'assets/js/main': ['babel-polyfill', './src/js/main.js'],
    'assets/css/main': './src/css/styles.scss',
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
              // custom env manipulations
              envCallback,
              // content is passed into every nunjucks file to be used like {{ kenobi }}
              context: {
                nowYear: dateFormat(now, 'yyyy'),
                now: dateFormat(now, 'dd-mm-yyyy @ HH:MM'),
                pages: [{ file: 'index', name: 'Index' }].concat(
                  otherNunjucksFiles
                ),
                projectTitle,
                mockData: mockData(),
                isProduction:
                  process.argv[process.argv.indexOf('--mode') + 1] ===
                  'production',
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
        ],
        exclude: [path.resolve(__dirname, './src/fonts')],
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
    // Set custom env variables
    new webpack.DefinePlugin({
      API_URL: JSON.stringify(process.env.API_URL || ''),
      ASSET_DIR: JSON.stringify(process.env.ASSET_DIR || '/assets'),
    }),
    // Runs the first HTMLWebPackPlugin for index
    HtmlWebPackPluginConfig,
    // Adds async to all JS files inserted
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    // Runs sass lint against our sass files
    new SassLintPlugin({
      files: './src/css/**/*.scss',
    }),
    // Run the plugin to stop a js file being generated for the CSS
    new FixStyleOnlyEntriesPlugin(),
    // Copy the service worker to dist root. We can't run it through webpack as it adds
    // code related to window etc.
    // Also copy images and fonts this way.
    new CopyWebpackPlugin({
      patterns: [
        { from: './src/index' },
        { from: './src/js/service-worker.js' },
        { from: './src/fonts', to: './assets/fonts' },
        { from: './src/json', to: './assets/json' },
        { from: './src/images', to: './assets/images' },
        { from: './src/example-images', to: './assets/example-images' },
      ],
    }),
    // Generate the SVG sprite
    new SVGSpritemapPlugin({
      src: './src/icons/*.svg',
      filename: 'assets/icons/icons.svg',
      styles: false,
      svgo: true,
    }),
    // Clean the dist folder before doing things
    new CleanWebpackPlugin(['dist']),
    // Add on the extra HTMLWebPackPlugins for the other pages
    // WebappWebpackPlugin has to be after all html webpack plugins
  ]
    .concat(multipleFiles)
    .concat(afterHTMLWebpackPlugin),
  // We want our files from the entry point to have names like this and go into dist
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

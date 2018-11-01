const projectTitle = 'Wile Webpack Whippet';

const dateFormat = require('dateformat');
const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SassLintPlugin = require('sass-lint-webpack');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');

// this person is a hero
// https://dev.to/rodeghiero_/multiple-html-files-with-htmlwebpackplugin-19bf
// initial html webpack plugin config
const HtmlWebPackPluginConfig = new HtmlWebPackPlugin({
  filename: 'index.html',
  inject: 'body',
  template: 'nunjucks-html-loader!./src/templates/index.njk',
});

// other pages. Abstract to another file?
const otherNunjucksFiles = [
  {
    file: 'hello',
    name: 'Hello Template',
  },
  {
    file: 'all',
    name: 'All ',
  },
];

// a new plugin for each page
const multipleFiles = otherNunjucksFiles.map((entry) => {
  return new HtmlWebPackPlugin({
    filename: `${entry.file}.html`,
    template: `nunjucks-html-loader!./src/templates/${entry.file}.njk`,
  });
});

const now = new Date();

module.exports = {
  entry: {
    'assets/js/main.js': './src/js/main.js',
    'assets/css/main.css': './src/sass/main.scss',
  },
  module: {
    rules: [
      {
        test: /\.html$|njk|nunjucks/,
        use: [
          'html-loader',
          {
            loader: 'nunjucks-html-loader',
            options: {
              searchPaths: ['./src/templates'],
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
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        // do this first
        enforce: 'pre',
        test: /\.js$/,
        exclude: [/node_modules/, /.index.js/],
        use: {
          loader: 'eslint-loader',
        },
      },
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
    HtmlWebPackPluginConfig,
    new webpack.HotModuleReplacementPlugin(),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new SassLintPlugin({
      files: './src/sass/*.scss',
    }),
    new FixStyleOnlyEntriesPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
    new CleanWebpackPlugin(['dist']),
    new WebpackPwaManifest({
      name: 'Wile Webpack Whippet',
      short_name: 'WWWhippet',
      description: 'Some description about the Whippet',
      background_color: '#F44336',
      icons: [
        {
          src: path.resolve('src/misc/whippet.png'),
          sizes: [96, 128, 192, 256, 384, 512, 1024],
          destination: '/assets/favicons',
        },
      ],
    }),
  ].concat(multipleFiles),
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SassLintPlugin = require('sass-lint-webpack')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const webpack = require('webpack');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.html$|njk|nunjucks/,
        use: ['html-loader',{
          loader: 'nunjucks-html-loader',
          options: {
            searchPaths: ['./src/templates'],
          }
        }]
      },
      {
        test: /\.(png|jpe?g|gif|svg)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: './src/images/[name].[ext]',
              limit: 15000,
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
        exclude: [
          /node_modules/,
          /.index.js/
        ],
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
    new HtmlWebPackPlugin({
      filename: 'index.html',
      inject: 'body',
      template: 'nunjucks-html-loader!./src/templates/index.njk',
    }),
    new HtmlWebPackPlugin({
      filename: 'hello.html',
      inject: 'body',
      template: 'nunjucks-html-loader!./src/templates/hello.njk',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
    new SassLintPlugin({
      files: './src/sass/*.scss'
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
      chunkFilename: '[id].css',
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
        },
      ],
    })
  ],
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
};

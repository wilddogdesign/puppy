const merge = require("webpack-merge");
const path = require("path");

const HtmlBeautifyPlugin = require("html-beautify-webpack-plugin");
const WebappWebpackPlugin = require("webapp-webpack-plugin");
const AsyncStylesheetWebpackPlugin = require("async-stylesheet-webpack-plugin");
const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin-wilddog")
  .default;
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");
// Runs images through imagemin when copying
const ImageminPlugin = require("imagemin-webpack-plugin").default;

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PostCssPipelineWebpackPlugin = require("postcss-pipeline-webpack-plugin");
const criticalSplit = require("postcss-critical-split");
const common = require("./webpack.common.js");

const afterHTMLWebpackPlugin = [
  new WebappWebpackPlugin({
    favicons: {
      name: "Puppy",
      short_name: "puppy",
      orientation: "portrait",
      display: "standalone",
      start_url: ".",
      description: "Some description about puppy",
      background_color: "#F44336",
    },
    prefix: "assets/favicons",
    logo: path.resolve("src/misc/favicon.png"),
    cache: true,
  }),
  new HtmlBeautifyPlugin(),
  new AsyncStylesheetWebpackPlugin({
    preloadPolyfill: true,
  }),
  new HTMLInlineCSSWebpackPlugin({
    filter(fileName) {
      return fileName.includes("critical.css");
    },
    replace: {
      target: "<!-- inline_css_plugin -->",
      position: "before",
      removeTarget: true,
      leaveCssFile: true,
    },
  }),
];

module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader?url=false",
          "sass-loader",
        ],
        // post css config in /src/sass/postcss.config.js
      },
    ],
  },
  plugins: [
    // Extracts the CSS into a file with the provided name
    new MiniCssExtractPlugin({
      filename: "[name]-[contenthash].css",
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: "critical",
      pipeline: [
        criticalSplit({
          output: criticalSplit.output_types.CRITICAL_CSS,
        }),
      ],
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: "",
      predicate: (name) => /^((?!critical).)*$/.test(name),
      pipeline: [
        criticalSplit({
          output: criticalSplit.output_types.REST_CSS,
        }),
      ],
    }),
    new PostCssPipelineWebpackPlugin({
      suffix: "",
      pipeline: [
        require("autoprefixer")(),
        require("cssnano")(),
        require("postcss-inline-svg")({ path: "./src/css/" }),
        require("postcss-svgo")(),
      ],
    }),
    new ReplaceInFileWebpackPlugin([
      {
        dir: "dist/",
        test: /\.html$/,
        rules: [
          {
            search: /\.\.\//gm,
            replace: "/assets/",
          },
        ],
      },
      {
        dir: "dist/",
        test: /service-worker\.js$/,
        rules: [
          {
            search: /#VERSION_NO#/,
            replace: new Date().toISOString(),
          },
        ],
      },
    ]),
    new ImageminPlugin({
      test: "assets/images/**",
    }),
  ].concat(afterHTMLWebpackPlugin),
});

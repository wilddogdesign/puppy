module.exports = {
  plugins: [
    require("autoprefixer")(),
    require("cssnano")(),
    require("postcss-inline-svg")(),
    require("postcss-svgo")(),
  ],
};

# Wile Webpack Whippet

## Development

Run `npm start` to start dev server

## Production

Run `npm run build` to create final files

### Done

- Image optimisation w/ inline smaller < 15kb images
- Sass w/ autoprefixer, cssnano, inline-svg
- Babel ES6 transpilation
- Dev server
- inuit / sassmq
- Manifest.json w/ favicons (https://www.npmjs.com/package/webpack-pwa-manifest)
- Critical CSS (https://github.com/GoogleChromeLabs/critters) - maybe change to headless browser
- Async scripts (https://www.npmjs.com/package/script-ext-html-webpack-plugin)
- Versioning final CSS / JS (https://webpack.js.org/guides/caching/)
- ESlint - airbnb maybe disable this in class methods and () around single argument
- Sasslint? - turn off god damn property ordering
- hmr (https://webpack.js.org/guides/hot-module-replacement/)
- dev and prod modes (https://webpack.js.org/guides/production/)

### TODO

- actually, remove inuit and keep good bits like helpers, keep sassmq and the inuit bits to do with it (widths, layout)
- Landing page (use moment to pop in date) - try to use template files instead of data json
- Nunjucks templates (https://www.npmjs.com/package/nunjucks-to-html-loader)
- Sourcemaps on please
- SVG minification (replace all image minifcation with https://github.com/tcoopman/image-webpack-loader)
- PostCSS SVGo (https://github.com/ben-eb/postcss-svgo)
- Deployment with Flightplan
- Basic service worker (https://webpack.js.org/guides/progressive-web-application/)

### TODO much later

- Styleguide

### Thrown aside
- ~~Custom modernizr build (https://www.npmjs.com/package/modernizr-webpack-plugin)~~

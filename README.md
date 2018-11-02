# Wile Webpack Whippet

## Development

Run `npm start` to start dev server

## Production

Run `npm run build` to create final files

### Done

- Image optimisation w/ inline smaller < 10kb images
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
- Sourcemaps on please
- Nunjucks templates (https://github.com/at0g/nunjucks-loader/issues/35#issuecomment-335304596)
- PostCSS SVGo (https://github.com/ben-eb/postcss-svgo)
- Landing page (use moment to pop in date) - try to use template files instead of data json
- Deployment with Flightplan
- Basic service worker (https://webpack.js.org/guides/progressive-web-application/)
- DOCUMENT IT TRISTAN
- SVG sprites
- Manifest not injecting
- Get title of pages into a seperate file from webpack.common so there's a go to place to add more.
- Get titles into _head.njk

### TODO

- actually, remove inuit and keep good bits like helpers, keep sassmq and the inuit bits to do with it (widths, layout). And do a general starter layout using that
- Favicons

### TODO much later

- Styleguide
- Add filters to nunjucks

### Thrown aside

- ~~SVG minification (img-loader already runs through svgo)~~
- ~~Custom modernizr build (https://www.npmjs.com/package/modernizr-webpack-plugin)~~

# :dog: Wilddog Design Starting Web-Scaffold :+1:

## Prerequisites

### NVM

https://github.com/nvm-sh/nvm

To Install NVM run the following

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`

## Installing

First ensure you have the correct version of Node installed using `nvm install`.

Then Run `npm install` to get the whole shebang installed.

## Development

Run `npm start` to start dev server

## Production

Run `npm run build` to create final files

## Serve Production Build

Run `npm run build && npm run serve` and you'll build the project and serve it on 127.0.0.1:8888.

## Deploying (optional)

We use flightplan to deploy our static HTML to servers.

Amend flightplan.js file with correct remote server information (your public key has to be added to the remote user's shell for you to authorize the transfer and your personal key should be added to ssh-agent locally), and then run

`npm run deploy`

Keep in mind, that the script is not using sudo, so the deployer user has to have full permissions to the project and versions folders.

## The specifics - nunjucks

To add a new nunjucks page and have it appear in the all listings page

- add the filename and page title to pages.js

```
  {
    file: 'my-new-page',
    name: 'My new page',
  }
```

- Add the nunjucks file to src/templates
- Restart the dev server

## The specifics - what does it feature?

- Image optimisation with inlining of images smaller than 10kb
- Sass compilation w/ autoprefixer, cssnano, inline-svg
- Inuit / Sassmq
- Babel ES6 transpilation
- Dev server for live development
- Manifest.json w/ favicons (https://www.npmjs.com/package/webpack-pwa-manifest)
- Critical CSS (https://github.com/GoogleChromeLabs/critters)
- Async scripts (https://www.npmjs.com/package/script-ext-html-webpack-plugin)
- Versioning final CSS / JS (https://webpack.js.org/guides/caching/)
- ESlint
- Sasslint (but feel free to turn this sucker off)
- Dev and prod modes (https://webpack.js.org/guides/production/)
- Sourcemaps
- Nunjucks templates (https://github.com/at0g/nunjucks-loader/issues/35#issuecomment-335304596)
- PostCSS SVGo (https://github.com/ben-eb/postcss-svgo)
- Landing page (using moment to pop in date)
- Deployment with Flightplan
- Basic service worker (https://webpack.js.org/guides/progressive-web-application/)
- SVG sprites
- Manifest JSON

## Prettier

In vs code add to your settings

```
"[javascript]": {
  "editor.formatOnSave": false
},
// tell the ESLint plugin to run on save
"eslint.autoFixOnSave": true,
```

Other editors may vary

## SMACSS Sorting

Install this sucker: [PostCSS Sorting](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-postcss-sorting)

You'll notice sass-lint.yml now has a custom order in it, that's the most up to date smacss definition. Using `order: 'smacss'` was outdated it seems.

You'll see a .postcss-sorting.json config file which tells the plugin what order to sort properties in.

Anyway once you're Sass is wrote open the command palette and run `PostCSS Sorting: Run`.

It will do all the magic for you.

If you want to port to another project copy sass-lint.yml (or the order part) and the .postcss-sorting.json.

### TODO

- Styleguide
- Add filters to nunjucks

## Brought to you by

```
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZ WILD DOG DESIGN ZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ~ ...ZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ... ....ZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ. ..   ....+ZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZI.           .. ZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZ$+,.~IZZZZZZZZ?....       ... .ZZZZZZZ
ZZZZZZZZZZZZZZZZZZ$... ...     .... ..          .. .?ZZZZZZZ
ZZZZZZZZZZZZZZZZZ...                            .ZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZ....                            ~ZZZZZZZZZZZ
ZZZZZZZZZZZZZZZI.                             ..ZZZZZZZZZZZZ
ZZZZZZZZZZ$+:....                            ...ZZZZZZZZZZZZ
ZZZZZZZZ....  ...        .... .              ..,ZZZZZZZZZZZZ
ZZZZZ=...... ...        .......              ..ZZZZZZZZZZZZZ
ZZZZ......?:$ZZZ        ..,~...              ?ZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZ.   . ..ZZZZZZZZ7.. ..   ...ZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZ..   ...ZZZZZZZZZZZZ7..   ..ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZ+. ...~$ZZZZZZZZZZZZZZ..   ..ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZ... ZZZZZZZZZZZZZZZZZ .   . ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZ....ZZZZZZZZZZZZZZZZZZ7 .....ZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZ+. ...ZZZZZZZZZZZZZZZZZZZ+.....,ZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZ=+IZZZZZZZZZZZZZZZZZZZZZZ?:~+$ZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ
```

/* jshint ignore:start */

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cache = require('gulp-cache');
const criticalSplit = require('postcss-critical-split');
const cssnano = require('cssnano');
const customizr = require('customizr');
const data = require('gulp-data');
const del = require('del');
const eslint = require('gulp-eslint');
const favicons = require('gulp-favicons');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const inlineSvg = require('postcss-inline-svg');
const inject = require('gulp-inject');
const jpegrecompress = require('imagemin-jpeg-recompress');
const moment = require('moment');
const nunjucks = require('gulp-nunjucks-render');
const nunjucksDateFilter = require('nunjucks-date-filter');
const path = require('path');
const postcss = require('gulp-postcss');
const prettify = require('gulp-jsbeautifier');
const rename = require('gulp-rename');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const shell = require('gulp-shell');
const sourcemaps = require('gulp-sourcemaps');
const styledown = require('gulp-styledown');
const svgmin = require('gulp-svgmin');
const svgo = require('postcss-svgo');
const svgstore = require('gulp-svgstore');
const watch = require('gulp-watch');

const projectData = require('./data/pages.json');

const project = require('./data/pages.json');

const isDevelopment = !(process.argv.indexOf('build:production') > -1);

const args = {
  critical: !(process.argv.indexOf('--no-critical-css') > -1),
  minify: !(process.argv.indexOf('--no-minification') > -1),
};

const options = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp',
};

/* GENERAL */

gulp.task('cache:clear', cb => cache.clearAll(cb));

gulp.task('clean', () => del([
  options.dist,
  options.tmp,
]));

gulp.task('copy:index', () =>
  gulp
    .src(`${options.src}/index/**/*`)
    .pipe(gulp.dest(options.dist)));

gulp.task('favicons', () =>
  gulp
    .src(`${options.src}/misc/favicon.png`)
    .pipe(favicons({
      appName: project.config.title,
      appDescription: project.config.description,
      developerName: 'Wild Dog Design',
      developerURL: 'http://www.wilddogdesign.co.uk',
      background: '#fff',
      path: 'favicons/',
      display: 'standalone',
      orientation: 'portrait',
      logging: false,
      online: false,
      html: 'favicons.html',
      pipeHTML: true,
      replace: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: false,
        opengraph: false,
        twitter: false,
        windows: true,
        yandex: false,
      },
    }))
    .pipe(gulp.dest(`${options.dist}/favicons`)));

gulp.task('favicons:inject', () =>
  gulp
    .src(`${options.dist}/**/*.html`)
    .pipe(inject(gulp.src([`${options.dist}/favicons/favicons.html`]), {
      starttag: '<!-- inject:favicons -->',
      transform: (filePath, file) => file.contents.toString('utf8'),
    }))
    .pipe(gulp.dest(options.dist)));

gulp.task('fonts', () =>
  gulp
    .src(`${options.src}/fonts/**/*`)
    .pipe(gulp.dest(`${options.dist}/assets/fonts`)));

gulp.task('images', () => gulp
  .src(`${options.src}/images/**/*.+(png|jpg|jpeg|gif|svg)`)
  .pipe(imagemin([
    imagemin.gifsicle(),
    jpegrecompress(),
    imagemin.optipng(),
    imagemin.svgo(),
  ]))
  .pipe(gulp.dest(`${options.dist}/assets/images`)));

function modernizr(done) {
  customizr({
    dest: `${options.dist}/assets/js/vendor/modernizr-custom.js`,
    options: [
      'setClasses',
    ],
    tests: [
      'history',
      'inlinesvg',
      'touchevents',
      'srcset',
      'svg',
      // 'webworkers'
    ],
    excludeTests: [
      'hidden',
    ],
    uglify: true,
    files: {
      src: [
        `${options.src}/js/**/*.js`,
        `${options.src}/css/**/*.scss`,
      ],
    },
  }, () => {});
  done();
}

gulp.task(modernizr);

gulp.task('svgstore', () =>
  gulp
    .src(`${options.src}/icons/*.svg`)
    .pipe(svgmin((file) => {
      const prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: `${prefix}-`,
            minify: true,
          },
        }],
      };
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(`${options.dist}/assets/icons`)));

/* STYLES */

gulp.task('styles:lint', () =>
  gulp.src(`${options.src}/css/**/*.scss`)
    .pipe(sassLint({
      configFile: '.sass-lint.yml',
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError()));

gulp.task('styles', gulp.series(
  'styles:lint',
  () => {
    const output = isDevelopment ? `${options.dist}/assets/css` : `${options.tmp}/assets/css`;
    const sassOptions = {
      errLogToConsole: true,
      outputStyle: 'expanded',
    };
    const processors = [
      autoprefixer({ browsers: ['last 2 versions', '> 5%', 'safari 8'] }),
      inlineSvg(),
      svgo(),
    ];
    // if (args.minify && !isDevelopment) { processors.push(cssnano) }
    return gulp
      .src(`${options.src}/css/main.scss`)
      .pipe(gulpif(isDevelopment, sourcemaps.init()))
      .pipe(sass(sass(sassOptions).on('error', sass.logError)))
      .pipe(postcss(processors))
      .pipe(gulpif(isDevelopment, sourcemaps.write()))
      .pipe(gulp.dest(output));
  },
));

/* SCRIPTS */

gulp.task('scripts:lint', () =>
  gulp
    .src([
      `${options.src}/js/**/*.js`,
      '!node_modules/**',
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('scripts', gulp.series(
  'scripts:lint',
  () => {
    const output = `${options.dist}/assets/js`;
    return gulp
      .src(`${options.src}/js/**/*.js`)
      // .pipe(gulpif(isDevelopment,prettify(),uglify()))
      .pipe(gulp.dest(output));
  },
));

gulp.task('scripts:production', gulp.series(
  'scripts:lint',
  () => {
    const output = `${options.dist}/assets/js`;
    return gulp
      .src(`${options.src}/js/**/*.js`)
      // .pipe(gulpif(isDevelopment,prettify(),uglify()))
      .pipe(shell([
        `jspm bundle-sfx ${options.src}/js/main.js ${output}/main.js --skip-source-maps ${args.minify ? '--minify' : ''}`,
      ]));
  },
));

/* TEMPLATES */

gulp.task('templates', () => {
  const output = `${options.dist}`;

  const manageEnvironment = (environment) => {
    environment.addFilter('date', nunjucksDateFilter);
  };

  const now = moment().utc();

  return gulp
    .src(`${options.src}/templates/*.njk`)
    .pipe(data(() => projectData))
    .pipe(nunjucks({
      data: {
        now: now.valueOf(),
        critical: args.critical,
        isDevelopment,
      },
      manageEnv: manageEnvironment,
      path: ['src/templates/'],
    }))
    .pipe(prettify({
      indent_level: 2,
      unformatted: ['script'],
    }))
    .pipe(gulp.dest(output));
});

/* DEVELOPMENT */

gulp.task('build:dev', gulp.series(
  'clean',
  gulp.parallel(
    'copy:index',
    'fonts',
    'images',
    'modernizr',
    'scripts',
    'styles',
    'svgstore',
    'templates',
  ),
));

gulp.task(
  'certificates',
  shell.task([
    'openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj \'/CN=localhost\'',
  ]),
);

gulp.task('browser-sync', (cb) => {
  browserSync({
    port: 8888,
    // https: {
    //   key:  'localhost.key',
    //   cert: 'localhost.crt'
    // },
    server: {
      baseDir: options.dist,
      routes: {
        '/jspm_packages': 'jspm_packages',
        '/node_modules': 'node_modules',
        '/config.js': 'config.js',
      },
    },
    ui: {
      port: 8889,
    },
    files: [
      `${options.dist}/**/*`,
    ],
  }, cb);
});

gulp.task('watch:styles', () => {
  watch([
    `${options.src}/css/**/*.scss`,
    `${options.src}/css/**/*.css`,
  ], gulp.series('styles'));
});

gulp.task('watch:code', () => {
  watch(`${options.src}/templates/**/*.njk`, gulp.series('templates'));
  watch(`${options.src}/js/**/*.js`, gulp.series('scripts'));
});

gulp.task('watch:assets', () => {
  watch(`${options.src}/fonts/**/*`, gulp.series('fonts'));
  watch(`${options.src}/icons/*.svg`, gulp.series('svgstore'));
  watch(`${options.src}/index/**/*`, gulp.series('copy:index'));
  watch(`${options.src}/images/**/*.+(png|jpg|jpeg|gif|svg)`, gulp.series('images'));
});

gulp.task('watch', gulp.parallel(
  'watch:code',
  'watch:styles',
  'watch:assets',
));

/* PRODUCTION */

// Generate critical css
gulp.task('styles:critical', () => {
  const output = `${options.dist}/assets/css`;
  const processors = [
    criticalSplit({
      output: 'critical',
    }),
    cssnano({
      autoprefixer: false,
      reduceIdents: false,
    }),
  ];
  return gulp
    .src(`${options.tmp}/assets/css/main.css`)
    .pipe(postcss(processors))
    .pipe(rename('critical.css'))
    .pipe(gulp.dest(output));
});

// Generate non-critical css
gulp.task('styles:rest', () => {
  const output = `${options.dist}/assets/css`;

  const processors = [
    criticalSplit({
      output: 'rest',
    }),
  ];

  if (args.minify && !isDevelopment) {
    processors.push(cssnano({ autoprefixer: false, reduceIdents: false }));
  }
  return gulp
    .src(`${options.tmp}/assets/css/main.css`)
    .pipe(postcss(processors))
    .pipe(gulp.dest(output));
});

gulp.task('inject:critical', () =>
  gulp
    .src(`${options.dist}/**/*.html`)
    .pipe(inject(gulp.src([`${options.dist}/assets/css/critical.css`]), {
      starttag: '<!-- inject:critical -->',
      transform: (filePath, file) =>
        // return file contents as string
        `<style type='text/css'>${file.contents.toString('utf8').replace(/\.\.\/images/g, 'assets/images')}</style>`,
    }))
    .pipe(inject(gulp.src([`${options.dist}/assets/css/main-*.css`], { read: false }), {
      starttag: '<!-- inject:preconnect_css -->',
      relative: true,
      transform: filePath =>
        `<link rel='preload' href='${filePath.toString('utf8')}' as='style' onload='this.rel="stylesheet"'>`,
    }))
    .pipe(gulp.dest(options.dist)));

gulp.task('inject:assets', () => {
  const target = gulp.src(`${options.dist}/**/*.html`);
  const css = gulp.src(
    [
      `${options.dist}/assets/css/main-*.css`,
    ],
    { read: false },
  );
  const js = gulp.src(
    [
      `${options.dist}/assets/js/**/*.js`,
      `!${options.dist}/assets/js/vendor/modernizr-custom.js`,
    ],
    { read: false },
  );

  return target
    .pipe(inject(css, { relative: true }))
    .pipe(inject(js, {
      relative: true,
      transform: filepath => `<script src='${filepath}' async></script>`,
    }))
    .pipe(gulp.dest(options.dist));
});

gulp.task('rev', () =>
  // by default, gulp would pick `assets/css` as the base,
  // so we need to set it explicitly:
  gulp
    .src(
      [
        `${options.dist}/assets/css/main.css`,
        `${options.dist}/assets/js/main.js`,
      ],
      {
        base: `${options.dist}/assets`,
      },
    )
    .pipe(gulp.dest(`${options.dist}/assets`)) // copy original assets to build dir
    .pipe(rev())
    // write rev'd assets to build dir
    .pipe(gulp.dest(`${options.dist}/assets`)));

gulp.task('clean:unrevved', () =>
  del([
    `${options.dist}/assets/css/main.css`,
    `${options.dist}/assets/js/main.js`,
  ]));

gulp.task('build:production', gulp.series(
  'clean',
  gulp.parallel(
    'copy:index',
    'favicons',
    'fonts',
    'images',
    'modernizr',
    'scripts:production',
    'styles',
    'svgstore',
    'templates',
  ),
  'styles:critical',
  'styles:rest',
  'rev',
  'clean:unrevved',
  'inject:critical',
  'inject:assets',
  'favicons:inject',
));

/* STYLEGUIDE */

gulp.task('styleguide:html', () =>
  gulp
    .src([
      // `${options.src}/styleguide/config.md`,
      `${options.src}/css/partials/settings/_settings.local.scss`,
      `${options.src}/css/partials/base/*.scss`,
      `${options.src}/css/partials/objects/*.scss`,
      `${options.src}/css/partials/components/*.scss`,
      `${options.src}/css/partials/trumps/*.scss`,
      `${options.src}/css/plugins/*.scss`,
    ])
    .pipe(styledown({
      config: `${options.src}/styleguide/config.md`,
      filename: 'index.html',
    }))
    .pipe(gulp.dest(`${options.dist}/styleguide`)));

gulp.task('styles:styleguide', () => {
  const output = `${options.dist}/styleguide/assets/css`;
  const sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
  };
  const processors = [
    autoprefixer({ browsers: ['last 2 versions', '> 5%'] }),
    cssnano,
  ];
  return gulp
    .src(`${options.src}/styleguide/styleguide.scss`)
    .pipe(sass(sass(sassOptions).on('error', sass.logError)))
    .pipe(postcss(processors))
    .pipe(gulp.dest(output));
});

gulp.task('inject:styleguide', () => {
  const target = gulp.src(`${options.dist}/styleguide/index.html`);
  const css = gulp.src(
    [
      `${options.dist}/styleguide/assets/css/styleguide.css`,
      `${options.dist}/assets/css/**/*.css`,
    ],
    { read: false },
  );
  const js = gulp.src(
    [
      `${options.dist}/assets/js/**/*.js`,
      `!${options.dist}/assets/js/vendor/modernizr-custom.js`,
    ],
    { read: false },
  );

  return target
    .pipe(inject(css, { relative: true }))
    .pipe(inject(js, {
      relative: true,
      transform: filepath => `<script src='${filepath}' async></script>`,
    }))
    .pipe(gulp.dest(`${options.dist}/styleguide`));
});

gulp.task(
  'styleguide',
  gulp.series(
    'styleguide:html',
    'styles:styleguide',
    'inject:styleguide',
  ),
);

gulp.task(
  'serve',
  gulp.series(
    // 'certificates',
    'browser-sync',
    'watch',
  ),
);

/* DEFAULT */

gulp.task(
  'default',
  gulp.series(
    'build:dev',
    'serve',
  ),
);

'use strict'

const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cache = require('gulp-cache');
const cssnano = require('cssnano');
const data = require('gulp-data');
const del = require('del');
const eslint = require('gulp-eslint');
const favicons = require('gulp-favicons');
const gulp = require('gulp');
const gulpif = require('gulp-if');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const modernizr = require('gulp-modernizr');
const path = require('path');
const postcss = require('gulp-postcss');
const prettify = require('gulp-jsbeautifier');
const rev = require('gulp-rev');
const sass = require('gulp-sass');
const shell = require('gulp-shell');
const sourcemaps = require('gulp-sourcemaps');
const styledown = require('gulp-styledown');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const swig = require('gulp-swig');
const uglify = require('gulp-uglify');
const watch = require('gulp-watch');

const project = require('./data/pages.json');

var isDevelopment = process.argv.indexOf("build:production") > -1 ? false : true;

const args = {
  critical: process.argv.indexOf("--no-critical-css") > -1 ? false : true,
  minify:   process.argv.indexOf("--no-minification") > -1 ? false : true
};

const options = {
  src:  'src',
  dist: 'dist',
  tmp:  '.tmp'
};

/* GENERAL */

gulp.task('cache:clear', cb => cache.clearAll(cb));

gulp.task('clean', () => {
  return del([
    options.dist,
    options.tmp
  ]);
});

gulp.task('copy:index', () => {
  return gulp
    .src(`${options.src}/index/**/*`)
    .pipe(gulp.dest(options.dist))
});

gulp.task('favicons', () => {
  return gulp
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
          yandex: false
      }
    }))
    .pipe(gulp.dest(`${options.dist}/favicons`));
});

gulp.task('favicons:inject', () => {
  return gulp
    .src(`${options.dist}/**/*.html`)
    .pipe(inject(gulp.src([`${options.dist}/favicons/favicons.html`]), {
      starttag: '<!-- inject:favicons -->',
      transform: (filePath, file) => {
        // return file contents as string
        return file.contents.toString('utf8');
      }
    }))
    .pipe(gulp.dest(options.dist))
});

gulp.task('fonts', () => {
  return gulp
    .src(`${options.src}/fonts/**/*`)
    .pipe(gulp.dest(`${options.dist}/assets/fonts`))
});

gulp.task('images', () => {
  return gulp
    .src(`${options.src}/images/**/*.+(png|jpg|jpeg|gif|svg)`)
    .pipe(cache(imagemin()))
    .pipe(gulp.dest(`${options.dist}/assets/images`))
});

gulp.task('modernizr', () => {
  return gulp
    .src([
      `${options.src}/js/**/*.js`,
      `${options.src}/css/**/*.scss`
    ])
    .pipe(modernizr('modernizr-custom.js',{
      'options' : [
        'setClasses'
      ],
      'excludeTests': [
        'hidden'
      ],
      'tests' : [
        'inlinesvg',
        'touchevents',
        'srcset',
        'svg',
        'webworkers'
      ],
    }))
    .pipe(uglify())
    .pipe(gulp.dest(`${options.dist}/assets/js/vendor`))
});

gulp.task('svgstore', () => {
  return gulp
    .src(`${options.src}/icons/*.svg`)
    .pipe(svgmin( file => {
      let prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(svgstore())
    .pipe(gulp.dest(`${options.dist}/assets/icons`));
});

/* STYLES */

gulp.task('styles', () => {
  let output = `${options.dist}/assets/css`;
  let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  let processors = [
    autoprefixer({browsers: ['last 2 versions', '> 5%']})
  ];
  if (args.minify && !isDevelopment) { processors.push(cssnano) }
  return gulp
    .src(`${options.src}/css/main.scss`)
    .pipe(gulpif(isDevelopment,sourcemaps.init()))
      .pipe(sass(sass(sassOptions).on('error', sass.logError)))
      .pipe(postcss(processors))
    .pipe(gulpif(isDevelopment,sourcemaps.write()))
    .pipe(gulp.dest(output));
});

/* SCRIPTS */

gulp.task('lint', () => {
  return gulp
    .src([
      `${options.src}/js/**/*.js`,
      '!node_modules/**'
    ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scripts', gulp.series(
  'lint',
  () => {
    let output = `${options.dist}/assets/js`;
    return gulp
      .src(`${options.src}/js/**/*.js`)
      // .pipe(gulpif(isDevelopment,prettify(),uglify()))
      .pipe(gulp.dest(output));
  })
);

gulp.task('scripts:production', gulp.series(
  'lint',
  () => {
    let output = `${options.dist}/assets/js`;
    return gulp
      .src(`${options.src}/js/**/*.js`)
      // .pipe(gulpif(isDevelopment,prettify(),uglify()))
      .pipe(shell([
        `jspm bundle-sfx ${options.src}/js/main.js ${output}/main.js --skip-source-maps ${args.minify ? '--minify' : ''}`
      ]));
  })
);

/* TEMPLATES*/

gulp.task('templates', () => {
  let output = `${options.dist}`;
  return gulp
    .src(`${options.src}/templates/*.swig`)
    .pipe(data( file => require('./data/pages.json') ))
    .pipe(swig({
      data: {
        now: new Date(),
        critical: args.critical,
        isDevelopment: isDevelopment
      },
      defaults: {
        cache: false
      }
    }))
    .pipe(prettify({
      indent_level: 2,
      unformatted: ['script']
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
    'templates'
  )
));

gulp.task('certificates',
  shell.task([
    `openssl req -x509 -newkey rsa:2048 -keyout localhost.key -out localhost.crt -days 30 -nodes -subj '/CN=localhost'`
  ])
);

gulp.task('browser-sync', cb => {
  browserSync({
    port: 8888,
    // https: {
    //   key:  "localhost.key",
    //   cert: "localhost.crt"
    // },
    server: {
      baseDir: options.dist,
      routes: {
        "/jspm_packages": "jspm_packages",
        "/config.js": "config.js",
        "/bower_components": "bower_components"
      }
    },
    ui: {
      port: 8889
    },
    files: [
      `${options.dist}/**/*`
    ]
  }, cb);
});

gulp.task('watch:styles', () => {
  watch([
    `${options.src}/css/**/*.scss`,
    `${options.src}/css/**/*.css`
  ],gulp.series('styles'));
});

gulp.task('watch:code', () => {
  watch(`${options.src}/templates/**/*.swig`,gulp.series('templates'));
  watch(`${options.src}/js/**/*.js`,gulp.series('scripts'));
});

gulp.task('watch:assets', () => {
  watch(`${options.src}/fonts/**/*`,gulp.series('fonts'));
  watch(`${options.src}/icons/*.svg`,gulp.series('svgstore'));
  watch(`${options.src}/index/**/*`,gulp.series('copy:index'));
  watch(`${options.src}/images/**/*.+(png|jpg|jpeg|gif|svg)`,gulp.series('images'));
});

gulp.task('watch', gulp.parallel(
  'watch:code',
  'watch:styles',
  'watch:assets'
));

/* PRODUCTION */

gulp.task('styles:critical', () => {
  let output = `${options.tmp}/assets/css`;
  let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  let processors = [
    autoprefixer({browsers: ['last 2 versions', '> 5%']}),
    cssnano
  ];
  return gulp
    .src(`${options.src}/css/critical.scss`)
    .pipe(sass(sass(sassOptions).on('error', sass.logError)))
    .pipe(postcss(processors))
    .pipe(gulp.dest(output));
});

gulp.task('inject:critical', () => {
  return gulp
    .src(`${options.dist}/**/*.html`)
    .pipe(inject(gulp.src([`${options.tmp}/assets/css/critical.css`]), {
      starttag: '<!-- inject:critical -->',
      transform: (filePath, file) => {
        // return file contents as string
        return `<style type="text/css">${file.contents.toString('utf8')}</style>`;
      }
    }))
    .pipe(inject(gulp.src([`${options.dist}/assets/css/*.css`], {read:false}), {
      starttag: '/* inject:css */',
      endtag: '/* endinject */',
      relative: true,
      transform: (filePath, file) => {
        // return file contents as string
        // return file.contents.toString('utf8')
        return `loadCSS('${filePath.toString('utf8')}', document.getElementById('criticalCss') );`;
      }
    }))
    .pipe(gulp.dest(options.dist));
});

gulp.task('inject:assets', () => {
  let target = gulp.src(`${options.dist}/**/*.html`);
  let css = gulp.src(
    [
      `${options.dist}/assets/css/**/*.css`
    ],
    {read: false}
  );
  let js = gulp.src(
    [
      `${options.dist}/assets/js/**/*.js`,
      `!${options.dist}/assets/js/vendor/modernizr-custom.js`
    ],
    {read: false}
  );

  return target
    .pipe(inject(css, {relative:true}))
    .pipe(inject(js, {
      relative: true,
      transform: (filepath, file, i, length) => {
        return `<script src="${filepath}" async></script>`;
      }
    }))
    .pipe(gulp.dest(options.dist));
});

gulp.task('rev', () => {
    // by default, gulp would pick `assets/css` as the base,
    // so we need to set it explicitly:
    return gulp
      .src([
          `${options.dist}/assets/css/main.css`,
          `${options.dist}/assets/js/main.js`
        ],
        {
          base: `${options.dist}/assets`
        }
      )
      .pipe(gulp.dest(`${options.dist}/assets`))  // copy original assets to build dir
      .pipe(rev())
      .pipe(gulp.dest(`${options.dist}/assets`))  // write rev'd assets to build dir
      // .pipe(rev.manifest())
      // .pipe(gulp.dest('build/assets')); // write manifest to build dir
});

gulp.task('clean:unrevved', () => {
  return del([
    `${options.dist}/assets/css/main.css`,
    `${options.dist}/assets/js/main.js`
  ])
});

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
    'styles:critical',
    'svgstore',
    'templates'
  ),
  'rev',
  'clean:unrevved',
  'inject:critical',
  'inject:assets',
  'favicons:inject'
));

/* STYLEGUIDE */

gulp.task('styleguide:html', () => {
  return gulp
    .src([
      // `${options.src}/styleguide/config.md`,
      `${options.src}/css/partials/settings/_settings.local.scss`,
      `${options.src}/css/partials/base/*.scss`,
      `${options.src}/css/partials/objects/*.scss`,
      `${options.src}/css/partials/components/*.scss`,
      `${options.src}/css/partials/trumps/*.scss`,
      `${options.src}/css/plugins/*.scss`
    ])
    .pipe(styledown({
      config: `${options.src}/styleguide/config.md`,
      filename: 'index.html'
    }))
    .pipe(gulp.dest(`${options.dist}/styleguide`));
});

gulp.task('styles:styleguide', () => {
  let output = `${options.dist}/styleguide/assets/css`;
  let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  let processors = [
    autoprefixer({browsers: ['last 2 versions', '> 5%']}),
    cssnano
  ];
  return gulp
    .src(`${options.src}/styleguide/styleguide.scss`)
    .pipe(sass(sass(sassOptions).on('error', sass.logError)))
    .pipe(postcss(processors))
    .pipe(gulp.dest(output));
});

gulp.task('inject:styleguide', () => {
  let target = gulp.src(`${options.dist}/styleguide/index.html`);
  let css = gulp.src(
    [
      `${options.dist}/styleguide/assets/css/styleguide.css`,
      `${options.dist}/assets/css/**/*.css`
    ],
    {read: false}
  );
  let js = gulp.src(
    [
      `${options.dist}/assets/js/**/*.js`,
      `!${options.dist}/assets/js/vendor/modernizr-custom.js`
    ],
    {read: false}
  );

  return target
    .pipe(inject(css, {relative:true}))
    .pipe(inject(js, {
      relative: true,
      transform: (filepath, file, i, length) => {
        return `<script src="${filepath}" async></script>`;
      }
    }))
    .pipe(gulp.dest(`${options.dist}/styleguide`));
});

gulp.task('styleguide',
  gulp.series(
    'styleguide:html',
    'styles:styleguide',
    'inject:styleguide'
  )
);

/* DEFAULT */

gulp.task('default',
  gulp.series(
    'build:dev',
    // 'certificates',
    'browser-sync',
    'watch'
  )
);
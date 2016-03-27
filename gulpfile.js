'use strict'

const gulp = require('gulp');
const del = require('del');
const watch = require('gulp-watch');
const eslint = require('gulp-eslint');
const data = require('gulp-data');
const swig = require('gulp-swig');
const modernizr = require('gulp-modernizr');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');
const shell = require('gulp-shell');
const browserSync = require('browser-sync');

const options = {
  src:  'src',
  dist: 'dist'
}

/* GENERAL */

gulp.task('clean', () => {
  return del([
    options.dist
  ]);
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
    .pipe(gulp.dest(`${options.dist}/assets/js/vendor`))
});

/* STYLES */

gulp.task('styles', () => {
  let output = `${options.dist}/assets/css`;
  let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  let processors = [
    autoprefixer({browsers: ['last 2 versions', '> 5%']}),
    cssnano
  ];
  return gulp
    .src(`${options.src}/css/main.scss`)
    .pipe(sourcemaps.init())
      .pipe(sass(sass(sassOptions).on('error', sass.logError)))
      .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(output));
});

/* SCRIPTS */

gulp.task('lint', () => {
  return gulp.src([`${options.src}/js/**/*.js`,'!node_modules/**'])
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
      .pipe(gulp.dest(output));
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
        now: new Date()
      },
      defaults: {
        cache: false
      }
    }))
    .pipe(gulp.dest(output));
});

gulp.task('build', gulp.series(
  'clean',
  gulp.parallel(
    'styles',
    'scripts',
    'templates',
    'modernizr'
  )
));

/* DEVELOPMENT */

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

gulp.task('watch', gulp.parallel(
  'watch:code',
  'watch:styles'
));

/* PRODUCTION */


/* DEFAULT */

gulp.task('default',
  gulp.series(
    'build',
    // 'certificates',
    'browser-sync',
    'watch'
  )
);
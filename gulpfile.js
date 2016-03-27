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
const imagemin = require('gulp-imagemin');
const cache = require('gulp-cache');
const path = require('path');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const browserSync = require('browser-sync');

const options = {
  src:  'src',
  dist: 'dist'
};

/* GENERAL */

gulp.task('cache:clear', cb => cache.clearAll(cb));

gulp.task('clean', () => {
  return del([
    options.dist
  ]);
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

/* DEVELOPMENT */

gulp.task('build:dev', gulp.series(
  'clean',
  gulp.parallel(
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
  watch(`${options.src}/images/**/*.+(png|jpg|jpeg|gif|svg)`,gulp.series('images'));
});

gulp.task('watch', gulp.parallel(
  'watch:code',
  'watch:styles',
  'watch:assets'
));

/* PRODUCTION */


/* DEFAULT */

gulp.task('default',
  gulp.series(
    'build:dev',
    // 'certificates',
    'browser-sync',
    'watch'
  )
);
'use strict'

var gulp = require('gulp');
var data = require('gulp-data');
var nunjucks = require('gulp-nunjucks-render');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');

var css = {
  input:  './src/css/main.scss',
  output: './src/.tmp/assets/css'
}

var html = {
  input: './src/templates/*.nunjucks',
  output: './src/.tmp'
}

gulp.task('styles', () => {
  let sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
  };
  let processors = [
    autoprefixer({browsers: ['last 2 versions', '> 5%']}),
    //cssnano
  ];
  return gulp
    .src(css.input)
    .pipe(sourcemaps.init())
      .pipe(sass(sass(sassOptions).on('error', sass.logError)))
      .pipe(postcss(processors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(css.output));
});

gulp.task('templates', () => {
  return gulp
    .src(html.input)
    .pipe(data( file => require('./data/pages.json') ))
    .pipe(nunjucks())
    .pipe(gulp.dest(html.output));
});

gulp.task('watch', () => {
  return gulp
    .watch(css.input, ['styles'])
    .on('change', event => {
      console.log(`File ${event.path} was ${event.type}, running tasks...`);
    });
});
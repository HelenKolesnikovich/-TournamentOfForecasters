'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const htmlmin = require('gulp-htmlmin');
const scss = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');

// Compile Server
gulp.task('server', function() {
  browserSync.init({
    server: {
      port: 3000,
      baseDir: "build"
    }
  });

  gulp.watch("build/**/*").on("change", browserSync.reload);
});

//Compile HTML
gulp.task("templates:compile", function(){
  return gulp.src("source/template/index.pug")
    .pipe(pug({
      pretty: true
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build'));
});

// Compile CSS (scss)
gulp.task("styles:compile", function() {
  return gulp.src('source/styles/main.scss')
  .pipe(sourcemaps.init())
  .pipe(scss.sync({
    outputStyle: 'expanded',            
  }).on('error', notify.onError()))
  .pipe(rename( { 
    suffix: '.min',
  } ))
  .pipe(autoprefixer({
    cascade: false,
  }))
  .pipe(cleanCSS({
    level: 2,
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('build'))
  .pipe(browserSync.stream());
});

// Compile JS
gulp.task("js:compile", function () {
	return gulp.src('source/scripts/main.js')
		.pipe(rename('main.min.js'))
    .pipe(sourcemaps.init())
		.pipe(uglify())
    .pipe(sourcemaps.write())
		.pipe(gulp.dest('build'));
});

// Compile Fonts
gulp.task('fonts:woff', function() {
  return gulp.src('./source/fonts/**/*.ttf')
    .pipe(ttf2woff())
    .pipe(gulp.dest('./build/fonts/'));
});
gulp.task('fonts:woff2', function() {
  return gulp.src('./source/fonts/**/*.ttf')
    .pipe(ttf2woff2())
    .pipe(gulp.dest('./build/fonts/'));
});
gulp.task('fonts:copy', function() {
  return gulp.src([
    './source/fonts/**/*.woff',
    './source/fonts/**/*.woff2'
  ])
    .pipe(gulp.dest('./build/fonts/'));
});
  

// Compile Copy Images
gulp.task('copy:images', function() {
  return gulp.src('./source/images/**/*.*')
    .pipe(imagemin([
      imagemin.gifsicle({interlaced: true}),
      imagemin.mozjpeg({quality: 75, progressive: true}),
      imagemin.optipng({optimizationLevel: 5}),
      imagemin.svgo({
        plugins: [
          {removeViewBox: true},
          {cleanupIDs: false}
        ]
      })
    ]))
    .pipe(gulp.dest('build/images'));
});

// Compile Copy Fonts and Images
gulp.task('copy', gulp.parallel('fonts:woff', 'fonts:woff2', 'fonts:copy', 'copy:images'));

// Compile delete files
gulp.task('clean', function del(cb) {
  return rimraf('build', cb);
});

// Watchers
gulp.task('watch', function() {
  gulp.watch('source/template/**/*.pug', gulp.series('templates:compile'));
  gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
  gulp.watch('source/scripts/**/*.js', gulp.series('js:compile'));
});

// Default Task
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'js:compile', 'copy'),
  gulp.parallel('watch', 'server')
));
var gulp = require('gulp');
var sass = require('gulp-sass');
var scss = require('gulp-scss');
var watch = require('gulp-watch');
var sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var useref = require('gulp-useref');
const imagemin = require('gulp-imagemin');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');


gulp.task('scss', function () {
  return gulp.src('src/scss/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js/'))
    .pipe(browserSync.stream());
});

gulp.task('clean', function() {
  return gulp.src('dist', {
      read: false
    })
    .pipe(clean());
});

gulp.task('html', function() {
  return gulp.src('src/*.html')
    .pipe(useref())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('img', () =>
  gulp.src('src/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('dist/img'))
  .pipe(browserSync.stream())
);

gulp.task('fonts', function() {
  gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts/'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  watch('src/*.html', function() {
    gulp.start('html');
  });
  watch('src/scss/**/*.scss', function() {
    gulp.start('scss');
  });
  watch('src/js/**/*.{js,json}', function() {
    gulp.start('js');
  });
  watch('src/img/**/*.{png,jpg,svg}', function() {
    gulp.start('img');
  });
  watch('src/fonts/**/*.{png,jpg,svg}', function() {
    gulp.start('fonts');
  });
});

gulp.task('dev', ['scss', 'html', 'js', 'img', 'fonts'], function() {
  browserSync.init({
    server: 'dist'
  });
  gulp.start('watch');
});

gulp.task('build', function() {
  runSequence('clean', ['scss', 'html', 'js', 'img', 'fonts']);
});

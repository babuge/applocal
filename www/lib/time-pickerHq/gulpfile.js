var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngHtml2Js = require("gulp-ng-html2js");
var minifyHtml = require("gulp-minify-html");
var css2js = require("gulp-css2js");
var  gutil =require("gulp-util");
// var watch = require("gulp-watch");

gulp.task('html2js', function () {
  return gulp.src(['./src/*.html'])
    .pipe(minifyHtml())
    .pipe(ngHtml2Js({
      moduleName: "time-hq.templates"
    }))
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(concat("templates.js"))
    
    //.pipe(uglify())
    .pipe(gulp.dest("./dist"));
});

gulp.task('css2js', function () {
  return gulp.src("./src/*.css")
    .pipe(css2js())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    //.pipe(uglify())
    .pipe(gulp.dest("./dist/"))
    
});

gulp.task('make-bundle', ['del', 'html2js', 'css2js'], function () {
  return gulp.src(['./dist/*', './src/*.js'])
    .pipe(concat('time-hq.bundle.min.js'))
    .pipe(uglify())
    .on('error', function (err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(gulp.dest('./dist/'));
});

gulp.task('del-temp-files', ['make-bundle'], function () {
  del(['./dist/templates.js', './dist/time-hq.styles.js']);
});

gulp.task('del', function () {
  del(['./dist/*']);
});

gulp.task('watch',function(){
  return gulp.watch(["./src/*.js","./src/*.css","./src/*.html"],['build'])
  .on('error', function (err) {
    gutil.log(gutil.colors.red('[Error]'), err.toString());
  });  
});

gulp.task('build', ['del-temp-files']);
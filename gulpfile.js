var gulp = require('gulp');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');

gulp.task('scripts', function() {
    gulp.src(['assets/js/**/*.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('public/assets/js'))
})

gulp.task('styles', function() {
    gulp.src(['assets/less/*.less'])
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(gulp.dest('public/assets/css'))
})

gulp.task('default', function() {
    gulp.run('scripts', 'styles');

    gulp.watch('assets/js/**', function(event) {
        gulp.run('scripts');
    })

    gulp.watch('assets/less/**', function(event) {
        gulp.run('styles');
    })
})
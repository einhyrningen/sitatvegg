const { src, dest, parallel } = require("gulp");
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCSS = require("gulp-clean-css");

function scripts() {
    return src(['assets/js/**/*.js'])
        .pipe(concat('scripts.js'))
        .pipe(dest('public/assets/js'))
}

function styles() {
    return src(['assets/scss/*.sass'])
        .pipe(sass())
        .pipe(minifyCSS())
        .pipe(dest('public/assets/css'))
}

exports.default = parallel(scripts, styles);

// function default() {
//     gulp.run('scripts', 'styles');

//     gulp.watch('assets/js/**', function(event) {
//         gulp.run('scripts');
//     })

//     gulp.watch('assets/sass/**', function(event) {
//         gulp.run('styles');
//     })
// }
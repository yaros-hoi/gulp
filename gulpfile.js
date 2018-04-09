var source = 'source';
var dest = 'dist';

var gulp = require('gulp'),
    jade = require('gulp-jade'),
    w3cjs = require('gulp-w3cjs'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    jshint = require('gulp-jshint'),
    del = require('del'),
    notify = require('gulp-notify'),
    webserver = require('gulp-webserver'),
    connect = require('gulp-connect'),
    path = require("path");

function notification(message) {
    return {
        "onLast": true,
        "icon": __dirname + '/' + "/icon.png",
        "message": message
    };
}

gulp.task('clean', function () {
    del(dest + '/**/*.*');
});

gulp.task('jade', function () {
    gulp.src([source + '/**/*.jade', '!' + source + '/includes/**/*.jade'])
        .pipe(jade({pretty: true}))
        .pipe(notify(notification("Jade have been compiled successfully!")))
        //.pipe(w3cjs())
        .pipe(connect.reload())
        .pipe(gulp.dest(dest))
});

gulp.task('sass', function () {
    gulp.src(source + '/styles/scss/style.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(autoprefixer({
            browsers: ['last 3 versions'],
            cascade: false
        }))
        .pipe(notify(notification("Base SASS have been compiled successfully!"))).on("error", notify.onError("Error: <%= error.message %>"))
        .pipe(connect.reload())
        .pipe(gulp.dest(dest + '/css'));
});

gulp.task('css', function () {
    gulp.src(source + '/styles/css/**/*.css')
        .pipe(notify(notification("Styles have been copied successfully!")))
        .pipe(connect.reload())
        .pipe(gulp.dest(dest + '/css/'))
});

gulp.task('js', function () {
    gulp.src(source + '/js/**/*.*')
        .pipe(jshint())
        .pipe(jshint.reporter('default')).on("error", notify.onError("Error: <%= error.message %>"))
        .pipe(notify(notification("JS have been copied successfully!")))
        .pipe(connect.reload())
        .pipe(gulp.dest(dest + '/js'))
});

gulp.task('fonts', function () {
    gulp.src(source + '/fonts/**/*.{woff2,woff,ttf}')
        .pipe(notify(notification("Fonts have been copied successfully!")))
        .pipe(connect.reload())
        .pipe(gulp.dest(dest + '/fonts'));
});

gulp.task('images', function () {
    gulp.src(source + '/img/**/*.{png,jpg,gif,webp,svg}')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        })).on("error", notify.onError("Error: <%= error.message %>"))
        .pipe(notify(notification("Images have been copied and minimized successfully!")))
        .pipe(connect.reload())
        .pipe(gulp.dest(dest + '/img'));
});

gulp.task('copy', function () {
    gulp.src(source + '/root/**/*.*')
        .pipe(notify(notification("Root files have been copied successfully!")))
        .pipe(connect.reload())
        .pipe(gulp.dest(dest));
});

gulp.task('webserver', function () {
    connect.server({
        root: path.resolve(__dirname + '/' + dest),
        port: 8888,
        livereload: true
    });
});

gulp.task('watch', function () {
    gulp.watch(['**/*.jade', '!includes/**/*.jade'], ['jade']);
    gulp.watch(source + '/styles/**/*.scss', ['sass']);
    gulp.watch(source + '/styles/**/*.css', ['css']);
    gulp.watch(source + '/js/**/*.js', ['js']);
    gulp.watch(source + '/fonts/**/*.{woff2,woff,ttf}', ['fonts']);
    gulp.watch(source + '/img/**/*.{png,jpg,gif,webp,svg}', ['images']);
    gulp.watch(source + '/root/**/*.*', ['copy']);
});

gulp.task('default', ['clean', 'jade', 'sass', 'css', 'js', 'fonts', 'images', 'copy', 'watch', 'webserver']);
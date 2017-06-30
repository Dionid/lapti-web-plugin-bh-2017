var gulp = require('gulp'),

    autoprefixer = require('gulp-autoprefixer'),
    cleanCss = require('gulp-clean-css'),
    concat = require('gulp-concat'),
    declare = require('gulp-declare'),
    handlebars = require('gulp-handlebars'),
    htmlmin = require('gulp-htmlmin'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    wrap = require('gulp-wrap'),

    connect = require('gulp-connect'),
    watch = require('gulp-watch'),

    paths = {

        testHtml: 'test/index.html',
        templates: 'tmpl/**/*.hbs',

        lessIndex: 'less/index.less',
        less: 'less/**/*.less',

        js: [
            'node_modules/lapti-api/dist/api.js',
            'js/data.js',
            'js/main.js'
        ]

    };

gulp.task('once', function () {
    return gulp.src(paths.testHtml)
        .pipe(gulp.dest('dist'));
});

gulp.task('html', function () {
    return gulp.src(paths.templates)
        .pipe(htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true
        }))
        .pipe(handlebars({
            handlebars: require('handlebars')
        }))
        .pipe(wrap('Handlebars.template(<%= contents %>)'))
        .pipe(declare({
            namespace: 'LaptiTemplates',
            noRedeclare: true
        }))
        .pipe(concat('templates.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('less', function () {
    return gulp.src(paths.lessIndex)
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleanCss())
        .pipe(rename('lapti.css'))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(uglify())
        .pipe(concat('lapti-plugin.js'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function () {
    gulp.watch(paths.templates, ['html']);
    gulp.watch(paths.less, ['less']);
    gulp.watch(paths.js, ['js']);
});

gulp.task('connect', function () {
    connect.server({
        root: './dist'
    });
});

gulp.task('default', ['once', 'html', 'less', 'js', 'watch', 'connect']);
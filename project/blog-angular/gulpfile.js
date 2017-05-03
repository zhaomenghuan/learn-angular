var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var gulpsync = require("gulp-sync")(gulp);
var jade = require('gulp-jade');             // 解析jade
var less = require('gulp-less');             // 解析less
var minifycss = require('gulp-minify-css');  // 压缩css
var uglify = require("gulp-uglify");         // 压缩代码
var concat = require("gulp-concat");         // 合并文件
var del = require("del");                    // 删除文件
var gulpif = require('gulp-if');             // 条件判断
var stripDebug = require('gulp-strip-debug');// 删除日志
var minimist = require('minimist');
var jshint = require('gulp-jshint');         // 代码检查
var markdown = require('gulp-markdown');     // markdown

var options = minimist(process.argv.slice(2), {
    string: 'env',
    default: {env: process.env.NODE_ENV || 'production'}
});

// VENDOR CONFIG
var vendor = {
    scripts: require('./vendor.config.json'),
    styles: [
        'node_modules/angular-material/angular-material.min.css'
    ]
};

// SOURCES CONFIG
var source = {
    scripts: [
        './src/*.js',
        './src/common/**/*.js',
        './src/pages/**/*.js'
    ],
    styles: [
        './src/index.less',
        './src/pages/**/*.less'
    ],
    templates: [
        {src: './src/index.jade', dist: './app/'},
        {src: './src/pages/**/*.jade', dist: './app/pages/'}
    ],
    copyfile: [
        {src: './src/favicon.ico', dist: './app/'},
        {src: './src/assets/images/*.{png,jpg,gif,ico,svg}',dist: './app/assets/images'},
        {src: './src/components/**', dist: './app/components/'},
        {src: './build/**/*', dist: './app/resource/'},
        {src: './api/*', dist: './app/api/'}
    ],
    markdown: {
        src: './build/blog/md/*.md',
        dist: './build/blog/html/'
    }
};

// JS vendor
gulp.task('scripts:vendor', function () {
    return gulp.src(vendor.scripts)
        .pipe(concat('lib.min.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(uglify()) // 执行 JavaScript 压缩
        .pipe(gulp.dest('./app/js/'))
        .pipe(reload({
            stream: true
        }));
});

// JS source
gulp.task('scripts:source', function () {
    return gulp.src(source.scripts)
        .pipe(concat('all.min.js')) // 合并 JavaScript ，并设置合并后的文件名
        .pipe(gulpif(options.env === 'production', uglify())) // 仅在生产环境时候进行压缩
        .pipe(gulpif(options.env === 'production', stripDebug())) // 仅在生产环境时去掉console.log
        .pipe(jshint())
        .pipe(gulp.dest('./app/js/'))
        .pipe(reload({
            stream: true
        }));
});

// CSS vendor
gulp.task('styles:vendor', function () {
    return gulp.src(vendor.styles) // 压缩的文件
        .pipe(minifycss()) //执行压缩
        .pipe(concat('lib.min.css'))
        .pipe(gulp.dest('./app/css/')) //输出到指定目录
        .pipe(reload({
            stream: true
        }));
});

// CSS source
gulp.task('styles:source', function () {
    return gulp.src(source.styles) // 压缩的文件
        .pipe(less())
        .pipe(minifycss()) // 执行压缩
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest('./app/css/')) //输出到指定目录
        .pipe(reload({
            stream: true
        }));
});

// jade templates
gulp.task('templates', function () {
    source.templates.forEach(function (item) {
        gulp.src(item.src)
            .pipe(jade({
                pretty: true
            }))
            .pipe(gulp.dest(item.dist))
            .pipe(reload({
                stream: true
            }));
    })
});

// markdown
gulp.task('md', function () {
    gulp.src(source.markdown.src)
        .pipe(markdown())
        .pipe(gulp.dest(source.markdown.dist));
});

// copyfile
gulp.task('copyfile', function () {
    source.copyfile.forEach(function (item) {
        gulp.src(item.src)
            .pipe(gulp.dest(item.dist));
    });
});

// 热更新服务
gulp.task('browsersync', function () {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

// 清空输出
gulp.task('clean', function (cb) {
    del(['app'], cb);
});

gulp.task('watch', function () {
    gulp.watch(['./src/*.jade', './src/components/**/*.jade', './src/pages/**/*.jade'], ['templates']); // jade模板
    gulp.watch(vendor.styles, ['styles:vendor']);
    gulp.watch(source.styles, ['styles:source']);
    gulp.watch(vendor.scripts, ['scripts:vendor']); // js库
    gulp.watch(source.scripts, ['scripts:source']); // 组件，页面脚本
    source.copyfile.forEach(function (item) {
        gulp.watch(item.src, ['copyfile']);
    })
});

gulp.task('default', gulpsync.sync([
    'scripts:vendor',
    'scripts:source',
    'styles:vendor',
    'styles:source',
    'templates',
    'copyfile'
]));

gulp.task('serve', gulpsync.sync([
    'default',
    'watch',
    'browsersync'
]), function () {
    console.log('serve run...');
});
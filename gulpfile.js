var gulp = require('gulp');
var del = require('del');
var merge = require('merge-stream');
var plugins = require('gulp-load-plugins')();
var Server = require('karma').Server;

gulp.task('clean', function (cb) {
    return del(['tmp', 'dist'], cb);
});

gulp.task('build-css', ['clean'], function () {
    return gulp.src('./styles/*')
        .pipe(plugins.sass())
        .pipe(plugins.minifyCss())
        .pipe(plugins.rename({
            extname: '.min.css'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build-tmp', ['build-css'], function () {
    var builderStream = buildTemp('src/builder/', 'mwFormBuilder');
    var viewerStream = buildTemp('src/viewer/', 'mwFormViewer');
    var utilsStream = buildTemp('src/utils/', 'mwFormUtils');
    return merge(builderStream, viewerStream, utilsStream);
});

gulp.task('default', ['build-tmp'], function () {
    var i18n = gulp.src('i18n/**/*.json').pipe(plugins.jsonminify()).pipe(gulp.dest('dist/i18n/'));

    var builderStream = buildModuleStream('form-builder.min.js', 'mwFormBuilder');
    var viewerStream = buildModuleStream('form-viewer.min.js', 'mwFormViewer');
    var utilsStream = buildModuleStream('form-utils.min.js', 'mwFormUtils');
    return merge(builderStream, viewerStream, utilsStream, i18n);
});

gulp.task('watch', function() {
    return gulp.watch(['i18n/**/*.json','./src/**/*.html', './styles/*.*css', 'src/**/*.js'], ['default']);
});

function buildTemp(src, moduleName) {

    var tmpDir = 'tmp/'+moduleName;

    var copy = gulp.src(src + '**/*.js').pipe(gulp.dest(tmpDir));

    var templates =  gulp.src(src + '**/*.html')
        .pipe(plugins.minifyHtml())
        .pipe(plugins.angularTemplatecache({
            module: moduleName,
            filename: 'templates.js'
        }))
        .pipe(gulp.dest(tmpDir));

    return merge(copy, templates);
}

function buildModuleStream(dest, moduleName) {

    var tmpDir = 'tmp/'+moduleName;

    return gulp.src(tmpDir + '/**/*.js')
        .pipe(plugins.angularFilesort())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify())
        .pipe(plugins.concat(dest))
        .pipe(gulp.dest('dist'));


}

gulp.task('test', function (done) {
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, function() {
        done();
    }).start();
});
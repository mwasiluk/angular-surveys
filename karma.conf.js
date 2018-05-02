module.exports = function(config) {
    config.set({
        frameworks: ['jasmine'],
        plugins: [
            'karma-phantomjs-launcher',
            'karma-jasmine'
        ],
        files:[
            'bower_components/jquery/dist/jquery.min.js',
            'bower_components/jquery-ui/jquery-ui.min.js',
            'bower_components/angular/angular.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-bootstrap/ui-bootstrap.min.js',
            'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'bower_components/angular-sanitize/angular-sanitize.min.js',
            'bower_components/angular-translate/angular-translate.min.js',
            'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
            'bower_components/Sortable/Sortable.min.js',
            'bower_components/Sortable/ng-sortable.js',
            'bower_components/angular-elastic/elastic.js',
            'dist/form-builder.min.js',
            'dist/form-builder-bootstrap-tpls.min.js',
            'dist/form-viewer.min.js',
            'dist/form-viewer-bootstrap-tpls.min.js',
            'test/*.js'


        ],
        // start these browsers
        browsers: ['PhantomJS'],
        reporters: ['progress'],
        logLevel: config.LOG_INFO,
        singleRun: false
    });
};
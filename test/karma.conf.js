// Karma configuration
// Generated on 2016-10-14

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      'jasmine'
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-material/angular-material.js',
      'bower_components/ng-file-upload/ng-file-upload.js',
      'bower_components/angular-route-segment/build/angular-route-segment.js',
      'bower_components/ngstorage/ngStorage.js',
      'bower_components/moment/moment.js',
      'bower_components/mdPickers/dist/mdPickers.min.js',
      'bower_components/velocity/velocity.js',
      'bower_components/velocity/velocity.ui.js',
      'bower_components/lumx/dist/lumx.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/angular-material-data-table/dist/md-data-table.js',
      'bower_components/angular-material-sidemenu/dest/angular-material-sidemenu.js',
      'bower_components/material-design-lite/material.min.js',
      'bower_components/angular-money-directive/dist/angular-money-directive.js',
      'bower_components/angular-ivh-treeview/dist/ivh-treeview.js',
      'bower_components/x2js/xml2json.min.js',
      'bower_components/angular-x2js/dist/x2js.min.js',
      'bower_components/angular-io-barcode/build/angular-io-barcode.js',
      'bower_components/angular-moment/angular-moment.js',
      'bower_components/angular-google-chart/ng-google-chart.js',
      'bower_components/chart.js/dist/Chart.js',
      'bower_components/angular-currency-filter/src/currency-filter.js',
      'bower_components/Chart.js/dist/Chart.js',
      'bower_components/ng-chartjs/dist/angular-chartjs.min.js',
      'bower_components/material-steppers/dist/material-steppers.js',
      'bower_components/angular-socket-io/socket.js',
      'bower_components/angucomplete-alt/angucomplete-alt.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-soundmanager2/dist/angular-soundmanager2.js',
      'bower_components/angular-material-accordion/dist/angular-material-accordion.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      'app/scripts/**/*.js',
      'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      'PhantomJS'
    ],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine'
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};

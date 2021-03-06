// Karma configuration
// Generated on Thu Aug 24 2017 12:11:02 GMT+0800 (中国标准时间)
var path = require('path');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
    './index.js'
    ],

    webpack: {
			devtool: 'eval',
			output: {
				pathinfo: true
			},
			eslint: {
				configFile: '.eslintrc',
				emitWarning: true,
				emitError: true,
				formatter: require('eslint-friendly-formatter')
			},
			module: {
				preLoaders: [{
					test: /\.js$/,
					loader: 'eslint-loader',
					exclude: /node_modules/,
					include: [path.join(__dirname, './src')]
				}],
				loaders: [{
					test: /\.js$/,
					loaders: ['babel'],
					exclude: /node_modules/,
					include: [path.join(__dirname, './src')]
				}],
				postLoaders: [{
					test: /\.js$/,
					loader: 'istanbul-instrumenter',
					exclude: /node_modules|_spec\.js$/,
					include: [path.join(__dirname, './src')]
				}]
			}

		},
      webpackMiddleware: {
          noInfo: true
      },

    // list of files to exclude
    exclude: [
    'karma.config.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    	'./index.js':['webpack']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}

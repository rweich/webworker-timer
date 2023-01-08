module.exports = function (config) {
  config.set({
    frameworks: ['mocha', 'karma-typescript'],

    files: [{ pattern: 'src/**/*.ts' }, { pattern: 'test/**/*.ts' }],

    preprocessors: {
      '**/*.ts': ['karma-typescript'],
    },

    reporters: ['dots', 'karma-typescript'],

    browsers: ['ChromeHeadlessThatWorks', 'FirefoxHeadless'],

    singleRun: true,

    karmaTypescriptConfig: {
      coverageOptions: {
        // code coverage breaks our webworker code (for some reason), so we'll disable it
        instrumentation: false,
      },
    },

    customLaunchers: {
      ChromeHeadlessThatWorks: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox']
      },
      FirefoxHeadless: {
        base: 'Firefox',
        flags: ['-headless'],
      }
    },
  });
};

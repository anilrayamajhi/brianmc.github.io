exports.config = {
  allScriptsTimeout: 110000,

  specs: [
   // 'e2e/scenarios.js'
      'e2e/local-test.js'
  ],

  capabilities: {
    'browserName': 'internet explorer',


  },

    multiCapabilities: [

    {
        browserName: 'firefox'
    },

    {
        browserName: 'chrome'
    }],

   chromeOnly: true,

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 300000,
    isVerbose: true,
    showColors: true

  }
};

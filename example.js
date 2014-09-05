var runner = require('./co-webdriver-runner')
  , browsers = [ 'internet explorer/10', 'internet explorer/9' ]
  , runTest = function* (test, browser) {
      // test is an instance of gap,
      // browser is an initialized co-wd instance
      test('title', function* (t) {
        yield browser.get('http://davidbjorklund.com')
        var title = yield browser.title()

        t.equal(title, 'David Björklund')
      })
    }

runner({
    // use baseConfig will be used in browser.init
    baseConfig: { public: 'public', name: 'davidbjorklund.com' }
    // list of browsers to run tests on
  , browsers: browsers
  , test: runTest
    // local === true means that the tests will be ran using chromedriver
    //  the baseConfig & browsers attributes are in this case ignored
  , local: true
})
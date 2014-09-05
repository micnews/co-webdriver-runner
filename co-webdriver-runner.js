var chalk = require('chalk')
  , chromedriver = require('chromedriver')
  , co = require('co')
  , each = require('co-each')
  , extend = require('xtend')
  , gap = require('gap')
  , getBrowsers = require('get-saucelabs-browsers')
  , read = require('co-read')
  , tape = require('tape')
  , thunkify = require('thunkify')

  , build = process.env.TRAVIS_BUILD_NUMBER || (new Date()).toJSON()

  , startServer = function (done) {
      var server = require('./utils/server')()
      server.listen(0, function () { done(null, server) })
    }

  , saucelabsRunner = function* (baseConfig, browsers, runTest) {
      var browsers = yield thunkify(getBrowsers)(browsers)
        , browserConfigs = browsers.map(function (config) {
            return extend(baseConfig, config)
          })

      yield each(
          browserConfigs
        , function* (config) {
            var browser = require('co-wd').remote('ondemand.saucelabs.com', 80)
              , testOutput = []
              , harness = tape.createHarness()
              , test = gap.inject(harness)
              , buf
              , stream
              , log = function (msg) {
                  var string = config.browserName + ' ' + config.version + ': ' + msg
                  console.log(chalk.magenta(string))
                }

            log('Queued')
            yield browser.init(config)

            log('Started')
            yield runTest(test, browser)

            // harness.createStream starts running the tests setup in runTest
            stream = harness.createStream()

            while(buf = yield read(stream)) {
              testOutput.push(buf.toString())
            }

            // fail test on sauce labs if the test fail
            if (harness._results.fail > 0)
              yield browser.sauceJobStatus(false)

            yield browser.quit()
            log('Finished')
            console.log(testOutput.join(''))
          }
      )
    }
  , localRunner = function* (runTest) {
      chromedriver.start()

      var browser = require('co-wd').remote('http://localhost:9515/')
        , harness = tape.createHarness()
        , test = gap.inject(harness)
        , buf
        , stream

      yield browser.init()

      yield runTest(test, browser)

      // harness.createStream starts running the tests setup in runTest
      stream = harness.createStream()
      while(buf = yield read(stream)) {
        process.stdout.write(buf)
      }
      yield browser.quit()
      chromedriver.stop()
    }

  , runner = function (options) {
      co(function* () {
        if (options.local) {
          yield localRunner(options.test)
        } else {
          yield saucelabsRunner(options.baseConfig, options.browsers, options.test)
        }
      })()
    }

module.exports = runner
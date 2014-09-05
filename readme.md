# co-webdriver-runner

Write browser tests using webdriver/selenium/chromedriver using generators/tap.

[![NPM](https://nodei.co/npm/co-webdriver-runner.png?downloads&stars)](https://nodei.co/npm/co-webdriver-runner/)

[![NPM](https://nodei.co/npm-dl/co-webdriver-runner.png)](https://nodei.co/npm/co-webdriver-runner/)

## Example
### Input
```js
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
    // baseConfig will be used in browser.init
    baseConfig: { public: 'public', name: 'davidbjorklund.com' }
    // list of browsers to run tests on
  , browsers: browsers
  , test: runTest
    // local === true means that the tests will be ran using chromedriver
    //  the baseConfig & browsers attributes are in this case ignored
  , local: true
})
```

### Output
```
TAP version 13
# title
ok 1 should be equal

1..1
# tests 1
# pass  1

# ok
```

## Installation

```
npm install co-webdriver-runner
```

## Licence

Copyright (c) 2014 Mic Network, Inc

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

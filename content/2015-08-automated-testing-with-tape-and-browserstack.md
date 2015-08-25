title: Automated JavaScript testing with Tape and Browserstack
date: Mon Aug 24 2015 21:23:13 GMT-0500 (CDT)

I've been using Travis CI for automated testing of my node modules for a little while, and it works dandily.  I love the Github integration.

Testing in node isn't enough, though - publishing client-side modules needs automated browser testing.  Since Testling [dropped off the internet](https://github.com/substack/testling/issues/88) and left a big testing-shaped hole in the client-side node community, I wasn't sure what the best option was as an open-source developer.

I tried [Saucelabs](https://saucelabs.com/) first, using [Zuul](https://github.com/defunctzombie/zuul) to launch tests.  It seemed all right, though just doing initial setup and debugging I quickly hit the testing time limit for free open-source accounts, making it a no-go for automated testing.

I figured I'd try Browserstack.  Initial testing with a trial account using their in-browser VM and a local network tunnel proved sweet-ass, so I asked for one of their free accounts for open source projects.  At time of writing there are no test limits on the open source accounts, though they are limited to two active VMs at a time.

Here's how to use tape with Browserstack!

## package.json/setup

Install these dev dependencies:

- `tape`
- `browserstack-tape-reporter`
- `browserstack-runner`
- `tape-catch`

Make sure to use tape >=4.1.0 as [that is the first version](https://github.com/substack/tape/pull/170) that exposes the main test harness results so that they can be reported to testing services programmatically.

To get that programmatic reporting to actually happen, I wrote [browserstack-tape-reporter](https://github.com/TehShrike/browserstack-tape-reporter).  The browserify build of your tests will need to include:

```sh
browserify test.js node_modules/browserstack-tape-reporter/index.js -o test.build.js -d
```

Make sure to use at least version 0.3.7 of browserstack-runner, as it is the [first version that doesn't default to expecting qunit](https://github.com/browserstack/browserstack-runner/pull/127).

With this recent version, you can leave the `test_framework` property out of your `browserstack.json` and the browserstack-tape-reporter will handle everything.

### Other nicities

[tape-catch](https://github.com/michaelrhodes/tape-catch) is merely a strong recommendation - if you have JavaScript errors in some browsers, those errors will get caught and immediately reported as failures, instead of leaving you with a blank screen and waiting for a timeout.

Also, if you're testing in IE9+, [tap-browser-color](https://github.com/kirbysayshi/tap-browser-color) will give you pretty red/green screenshots in Browserstack.

### Example package.json scripts section

For your copy/pasting pleasure, here's an exmaple of the simple scripts boilerplate my browserstack-tested modules are using so far:

```js
"scripts": {
	"test": "npm run localtest && npm run browserstack",
	"localtest": "node test/automated-test.js",
	"watch": "watchify test/browser-test.js -o browser-test.js -d",
	"browserstackbuild": "browserify test/browser-test.js node_modules/browserstack-tape-reporter/index.js -o browser-test.js -d",
	"browserstack": "npm run browserstackbuild && browserstack-runner"
}
```

## browserstack.json

```js
{
	"test_path": [ "index.html" ],
	"timeout": 600,
	"browsers": [
		"chrome_latest",
		"firefox_latest",
		"safari_latest",
		"chrome_latest",
		"ie_9",
		"ie_10",
		"ie_11"
	]
}
```

index.html is a file in the root directory of my project, with these contents: `<!DOCTYPE html><html><body></body><script src="test.build.js"></script></html>`

I bumped the `timeout` from the default of 300 seconds to 600.  When I launched Browserstack tests from my Macbook Pro they would generally finish in time, though browserstack-runner would peg my local processor.  Launched from travis-ci, jobs would frequently hit the 300 second limit and time out, presumably something to do with the low-processor Travis VMs.

The full list of valid options for the browser array aren't listed anywhere that I could find.  I've gotten by with inferring values from [the browserstack-runner readme](https://github.com/browserstack/browserstack-runner#compact-browsers-configuration) and the [full list of supported OSs and browsers](https://www.browserstack.com/list-of-browsers-and-platforms?product=live) on the Browserstack site that doesn't list the short/programmatic names.

## .travis.yml

For those sweet automated tests.  With browser testing, you'll only need one node version:

```yaml
language: node_js
node_js:
- iojs
```

I use [travis encrypt](https://github.com/travis-ci/travis.rb#encrypt) from the commandline to add the `BROWSERSTACK_USERNAME` and `BROWSERSTACK_KEY` environment variables to Travis.

## So far so good

Travis is triggering browser testing, and the tests usually complete without timing out.  Wheee!

[Ping me on Twitter](https://twitter.com/TehShrike) if you run into any issues with browserstack-tape-reporter, or if you can give me any tips on browser testing!

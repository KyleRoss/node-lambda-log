# [2.4.0](https://github.com/KyleRoss/node-lambda-log/compare/v2.3.1...v2.4.0) (2020-05-15)


### Bug Fixes

* check for "falsey" values for LAMBDALOG_SILENT ([187f755](https://github.com/KyleRoss/node-lambda-log/commit/187f755f4f54fdf2ba1a2946a73144757468cb33))


### Features

* allow globally overriding silent via env var LAMBDALOG_SILENT ([aecbfba](https://github.com/KyleRoss/node-lambda-log/commit/aecbfba8bde04f19a6b38f4580d5e66d69586543))

## [2.3.1](https://github.com/KyleRoss/node-lambda-log/compare/v2.3.0...v2.3.1) (2019-09-03)


### Bug Fixes

* change debug log method ([#21](https://github.com/KyleRoss/node-lambda-log/issues/21)) ([2348d8b](https://github.com/KyleRoss/node-lambda-log/commit/2348d8b))
* change debug log method ([#21](https://github.com/KyleRoss/node-lambda-log/issues/21)) ([#22](https://github.com/KyleRoss/node-lambda-log/issues/22)) ([db33618](https://github.com/KyleRoss/node-lambda-log/commit/db33618))

# [2.3.0](https://github.com/KyleRoss/node-lambda-log/compare/v2.2.0...v2.3.0) (2019-06-21)


### Bug Fixes

* add .DS_Store to gitignore ([968bd50](https://github.com/KyleRoss/node-lambda-log/commit/968bd50))


### Features

* add `log.result()` method ([3b98ec3](https://github.com/KyleRoss/node-lambda-log/commit/3b98ec3))


### Performance Improvements

* switch to fast-safe-stringify to increase performance ([3f5fa59](https://github.com/KyleRoss/node-lambda-log/commit/3f5fa59))

# [2.2.0](https://github.com/KyleRoss/node-lambda-log/compare/v2.1.0...v2.2.0) (2019-03-20)


### Features

* **logmessage:** allow overriding LogMessage ([8a867ac](https://github.com/KyleRoss/node-lambda-log/commit/8a867ac))

## 2.1.0 (12/19/2018)
* **BREAKING:** Removed `stdoutStream` and `stderrStream` options.
* **NEW:** Added `logHandler` option which takes a `console`-like object to send logs through. (#11)

## 2.0.1 (12/7/2018)
* Fix console logging pointing to global `console` instead of custom console instance for streaming. (@sh1n1chi8acker - #10)
* Update mocha to v5.2.0
* Added `package-lock.json` to .gitignore as it's not needed for this module.

## 2.0.0 (7/15/2018)
The new major release for lambda-log which contains many new extensibility features and a handful of new usability features. There are a few breaking changes from version 1.4.0 to keep in mind when migrating. All breaking changes will be noted in the changelog below:

#### Internal/Module Changes
* Moved `LambdaLog` class out of `index.js` into `lib/LambdaLog.js` for organization purposes.
* **NEW:** Utilize `console` module (native Node) instead of the global `console` object for logging. This allows more control of where logs are redirected to for custom advanced integrations.
* **NEW:** Log messages are now an instance of the `LogMessage` class which allows custom methods and better control over log messages.

#### LambdaLog Class/Configuration
* **NEW:** Added ability to configure the logger via the constructor (#3).
* **NEW:** Added ability to configure the log levels and methods via the constructor.
* **NEW:** Added `stdoutStream` and `stderrStream` configuration options to configure the desired output of log messages. By default it redirects to `process.stdout` and `process.stderr`.
* **NEW:** Added `dynamicMeta` configuration option which will allow dynamic metadata to be added to each log on creation.
* **NEW:** Added `replacer` configuration option for `JSON.stringify`.
* **BREAKING:** Static method `isError()` has been moved to the `LogMessage` class and is no longer accessible in the `LambdaLog` class.

#### Logging Functions
* **NEW:** All log functions now accept an array of tags to append to a log.
* **FIX:** Metadata passed into a log function will now be wrapped in a plain object if the provided value is not an object.
* **BREAKING:** All log functions now return an instance of `LogMessage` instead of a plain log object which allows directly calling additional methods of `LogMessage` (chaining). See documentation for more information.

#### Events
* **BREAKING:** The `log` event now provides an instance of `LogMessage` instead of a plain object.

#### Misc.
* Updated tests.
* Updated documentation/readme.

## 1.5.0 (7/15/2018)
* Added `json-stringify-safe` to prevent issues with circular references. (@jogold)

## 1.4.0 (5/31/2018)
* **New:** Added `log.assert()`.
* Updated README formatting.
* Added Travis for automated test running.

## 1.3.0 (1/2/2018)
* **New:** Added `_logLevel` as property to logged messages to allow easier searching in Cloudwatch Logs.
* Added missing tests.

## 1.2.1 (5/11/2017)
* Fix issue with `console.debug` not existing in Lambda.

## 1.2.0 (5/4/2017)
* **Breaking Change:** `log` event now returns object containing `level`, `log` and `meta`.

## 1.1.0 (5/2/2017)
* **New:** Added `log.debug()` method for debug messages.
* **New:** Added `config.debug` to enable and disable debug log messages (default is `false`).

## 1.0.0 (4/11/2017)
* Initial release

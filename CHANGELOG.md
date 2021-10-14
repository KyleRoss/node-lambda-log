# [3.1.0](https://github.com/KyleRoss/node-lambda-log/compare/v3.0.2...v3.1.0) (2021-10-14)


### Bug Fixes

* add redirect to github pages for old site to new domain ([bae1b15](https://github.com/KyleRoss/node-lambda-log/commit/bae1b159d7f2f0264547c8ae913dba514728cac6))
* add step to workflow to purge expired artifacts ([f051daf](https://github.com/KyleRoss/node-lambda-log/commit/f051daf70f3cae689958476a6cf5ff4953da44df))


### Features

* deprecate `addLevel()` method ([86897b1](https://github.com/KyleRoss/node-lambda-log/commit/86897b1d011e9c19c4c105040503c37a73ad4ac2))
* deprecate custom log levels ([abba03a](https://github.com/KyleRoss/node-lambda-log/commit/abba03a4753f97fca9c6891d8219bb33a2ad4fda))
* rebuild site using Next.js with new design and more documentation ([4304c1d](https://github.com/KyleRoss/node-lambda-log/commit/4304c1d38c830096dbcf69190033cff36a4e51bc))

## [3.0.2](https://github.com/KyleRoss/node-lambda-log/compare/v3.0.1...v3.0.2) (2021-10-01)


### Bug Fixes

* skip adding a toJSON method to errors that already have one ([#61](https://github.com/KyleRoss/node-lambda-log/issues/61)) ([5b03656](https://github.com/KyleRoss/node-lambda-log/commit/5b03656ee98d06a5f445e27933413d9189cc53da))

## [3.0.1](https://github.com/KyleRoss/node-lambda-log/compare/v3.0.0...v3.0.1) (2021-09-27)


### Bug Fixes

* include error name in metadata ([5a1214c](https://github.com/KyleRoss/node-lambda-log/commit/5a1214c95d3a10fbf997f136275e5bde55144598)), closes [#52](https://github.com/KyleRoss/node-lambda-log/issues/52)

# [3.0.0](https://github.com/KyleRoss/node-lambda-log/compare/v2.4.0...v3.0.0) (2021-04-12)


### Bug Fixes

* add `.npmignore` file to help reduce the size of the package ([c21bd7f](https://github.com/KyleRoss/node-lambda-log/commit/c21bd7f1b1577b6d9293e3a6c9173f01eea9e3b3))
* add `.npmignore` file to help reduce the size of the package ([9ccdc69](https://github.com/KyleRoss/node-lambda-log/commit/9ccdc69f5175692b19a37c405c50f768187b5abc))
* do not use husky when on a CI environment ([a17ac76](https://github.com/KyleRoss/node-lambda-log/commit/a17ac76362ff039ae2cc8ef0075b15b44e6edaab))
* reverse the check for LAMBDALOG_SILENT env variable ([95828b1](https://github.com/KyleRoss/node-lambda-log/commit/95828b1c4d4a7c339c46d4ee9f00c81e31b541a4))
* reverse the check for LAMBDALOG_SILENT env variable ([5ab6dc5](https://github.com/KyleRoss/node-lambda-log/commit/5ab6dc5a781d5c071524a9145c51761e26012d46))


### Code Refactoring

* move message.tags to a getter and setter ([201a6fe](https://github.com/KyleRoss/node-lambda-log/commit/201a6fe7f146d640b76de3d4be83fdb1d7c5ffa0))


### Features

* add ability for tags to be functions ([459380f](https://github.com/KyleRoss/node-lambda-log/commit/459380f7fa8031c893464bd480362578fd244c28))
* add ability for tags to be functions ([87ea24d](https://github.com/KyleRoss/node-lambda-log/commit/87ea24dbb369dd30eb659ebe0c1611e1d1d63715))
* add ability to change the key names of the message output ([4a71909](https://github.com/KyleRoss/node-lambda-log/commit/4a71909f89f7f14117a8ea876e2c610c6d4335fc))
* add ability to change the key names of the message output ([bc1169b](https://github.com/KyleRoss/node-lambda-log/commit/bc1169b74e432622297a1c8c2737cdc0df1b992a))
* add new method `addLevel()` to LambdaLog ([9fde2e3](https://github.com/KyleRoss/node-lambda-log/commit/9fde2e3181b243682a658a67b929a88ed039050f))
* add new method `addLevel()` to LambdaLog ([f7dbfd0](https://github.com/KyleRoss/node-lambda-log/commit/f7dbfd0b760b936b3d8949b9251d2eff705db68a))
* add new options `levelKey`, `messageKey`, and `tagsKey` ([bb5ba70](https://github.com/KyleRoss/node-lambda-log/commit/bb5ba709d3fd31e95049533d952d81dd8137d39f))
* add new options `levelKey`, `messageKey`, and `tagsKey` ([4d10968](https://github.com/KyleRoss/node-lambda-log/commit/4d10968e006ed93df13b9c6728446e2ee19b76fd))
* add new website! ([44a15dc](https://github.com/KyleRoss/node-lambda-log/commit/44a15dca138373be208072a1e527bc8e8767adf7))
* add new website! ([9aa6e2e](https://github.com/KyleRoss/node-lambda-log/commit/9aa6e2e1b2072780cd425ddf8cb5ea1f71933685))
* add symbols for referencing private properties in LogMessage ([f4b1c99](https://github.com/KyleRoss/node-lambda-log/commit/f4b1c995ecb07b180efd5b2989b9cef94005dd28))
* add symbols for referencing private properties in LogMessage ([beb5e39](https://github.com/KyleRoss/node-lambda-log/commit/beb5e3907a8b20ebb287a6c6ce498528fbb176a3))
* add symbols to reference certain private properties ([b502366](https://github.com/KyleRoss/node-lambda-log/commit/b50236600f3b4d33ba443b161e28cfd025189d7f))
* add symbols to reference certain private properties on LogMessage class ([952b62d](https://github.com/KyleRoss/node-lambda-log/commit/952b62dda4a3ef38d8631589fcccec0f4db8f74c))
* convert Errors in metadata to plain objects [#31](https://github.com/KyleRoss/node-lambda-log/issues/31) ([f55d474](https://github.com/KyleRoss/node-lambda-log/commit/f55d474e8d2405756c933042aba496b329a027ca))
* convert Errors in metadata to plain objects [#31](https://github.com/KyleRoss/node-lambda-log/issues/31) ([576052a](https://github.com/KyleRoss/node-lambda-log/commit/576052a10f9ae7da69ee6eaade5eaa34774106f9))
* remove default tags and add tag variable support [#29](https://github.com/KyleRoss/node-lambda-log/issues/29) ([a43b0ae](https://github.com/KyleRoss/node-lambda-log/commit/a43b0aecd996bccb2cd079a25ec16cc7d549ea94))
* remove default tags and add tag variable support [#29](https://github.com/KyleRoss/node-lambda-log/issues/29) ([ae686ef](https://github.com/KyleRoss/node-lambda-log/commit/ae686efa13482b3a72bb50a321820f4bbdc4753e))
* set node engine to >= 10.0.0 ([0b5e564](https://github.com/KyleRoss/node-lambda-log/commit/0b5e56414e90c8e0ce1c237110754a62aabcd0c1))
* set node engine to >= 10.0.0 ([2d022ec](https://github.com/KyleRoss/node-lambda-log/commit/2d022ecb2a22fe7cc8a70fd1763dea7a3f9a5fab))
* switch from travis to github actions ([6ca053f](https://github.com/KyleRoss/node-lambda-log/commit/6ca053f080038e7744a17f9fc3013c87859a0082))
* use jest for testing and coverage ([216141d](https://github.com/KyleRoss/node-lambda-log/commit/216141da899f7563f1f6fc73d80e0870a46ffd63))
* **internal:** add function to stub errors with a toJSON method ([b5e3dbe](https://github.com/KyleRoss/node-lambda-log/commit/b5e3dbe1b0ab5918e589bd842e10d75ae521ce7a))
* switch from travis to github actions ([f2d418e](https://github.com/KyleRoss/node-lambda-log/commit/f2d418ef8d35633bfdce41026f43c5e172a52b43))
* use jest for testing and coverage ([fafed5d](https://github.com/KyleRoss/node-lambda-log/commit/fafed5d2d90de4f8f91445e56cc7f661ffd48f3d))
* **internal:** add function to stub errors with a toJSON method ([d0707bd](https://github.com/KyleRoss/node-lambda-log/commit/d0707bd8371f584869b56252dcb27c01c9691655))


### BREAKING CHANGES

* There are no longer any built-in tags added to the tags array for each log message.
* `message.tags` is no longer a property of the LogMessage class that can be directly changed.
* Whenever an Error object is passed into the metadata for a log message, it will automatically be converted to a plain object as stringifying the an Error object will always yield `{}`.
* Previously you could directly access the private properties of LogMessage. In order to add some integrity, they are no longer using standard property names starting with an underscore and are instead referenced using symbols instead. For advanced usage, these symbols are exported as a static property on the LogMessage class under `LogMessage.symbols`.
* Previously you could directly access the private properties of LambdaLog. In order to add some integrity, they are no longer using standard property names starting with an underscore and are instead referenced using symbols instead. For advanced usage, these symbols are exported as a static property on the LambdaLog class under `LambdaLog.symbols`.

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

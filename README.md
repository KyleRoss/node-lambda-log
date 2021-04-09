# lambda-log

[![npm](https://img.shields.io/npm/v/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![npm](https://img.shields.io/npm/dt/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![David](https://img.shields.io/david/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://david-dm.org/KyleRoss/node-lambda-log) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/KyleRoss/node-lambda-log/module?style=for-the-badge) [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/KyleRoss/node-lambda-log?style=for-the-badge)](https://codeclimate.com/github/KyleRoss/node-lambda-log) [![license](https://img.shields.io/github/license/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) [![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/KyleRoss/node-lambda-log?style=for-the-badge)](https://codeclimate.com/github/KyleRoss/node-lambda-log) [![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/KyleRoss/node-lambda-log?style=for-the-badge)](https://www.codefactor.io/repository/github/kyleross/node-lambda-log) [![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/lambda-log?style=for-the-badge)](https://snyk.io/advisor/npm-package/lambda-log)

A [Node.js package](https://www.npmjs.com/package/lambda-log) to facilitate and enforce logging standards from processes and applications running within Lambda Functions, various AWS Services, and wherever JSON logs are desired. Lambda Log formats your log messages as JSON for simple parsing and filtering within tools such as CloudWatch Logs. Supports **Node 10+**.

> This module is not just for Lambda! You can use this is many different environments that support reading JSON from logs. While the name remains `lambda-log`, it's really a universal JSON logger.

**Why another lambda logger?**
There are others out there, but seemed to be convoluted, included more functionality than needed, not maintained, or not configurable enough. I created lambda-log to include the important functionality from other loggers, but still keeping it simple with minimal dependencies.

### Features

Anyone can log JSON to the `console`, but with Lambda Log you also get:

- Metadata and tags that may be set globally or individually for each log message.
- Error and Error-like objects logged include stacktraces in the metadata automatically.
- Each log message emits an event to allow third-party integration.
- Pluggable and customizable by extending the LambdaLog class.
- Pretty-printing of the JSON log message in dev mode.
- Well documented, commented, and maintained source code.
- Over 1 million downloads and more than 20k weekly downloads.
- Small footprint.

#### New in Version 3.0.0

Version 3.0.0 of Lambda Log brings a bunch of changes, new features, and a [new website](https://kyleross.github.io/node-lambda-log).

**Broad Changes:**

* Refactor all code to meet new ESLint specifications and to stay up-to-date with newer ecmascript specifications.
* New website with better documentation.
* Tests are now using Jest instead of Mocha.
* Switched from TravisCI to Github Actions.

**New Features:**

- Added `levelKey` configuration option to be able to change the key name for log levels.
- Added `messageKey` configuration option to be able to change the key name for log messages.
- Added `tagsKey` configuration option to be able to change the key name for tags.
- Added ability to remove log level and tags from the outputted log JSON.
- Added `addLevel()` method to quickly add a custom log level to an instance of LambdaLog.
- Tags can now be functions that return a dynamic tag for log messages.
- Tags now have variable support.
- Tags that are `null`, `undefined` or `""` are now removed from the tags array.
- Metadata that contains `Error` objects are now automatically converted to a plain object.

**Breaking Changes:**

- All of the private properties of both the LambdaLog and LogMessage classes are stored using Symbols. This may break some advanced uses of Lambda Log from version 2.
- Tags no longer contain any default, built-in tags and are empty by default.
- Some of the properties of LogMessage have been moved from the constructor to their own getter functions.



## Documentation

Documentation for Lambda Log has moved to our [new website](https://kyleross.github.io/node-lambda-log).



## Tests

See [Development Documentation](https://kyleross.github.io/node-lambda-log/docs/development).



## Contributing

See [Contributing Documentation](https://kyleross.github.io/node-lambda-log/docs/contributing).



## License

MIT License. See [License](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) in the repository.

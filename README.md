# lambda-log

[![npm](https://img.shields.io/npm/v/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![npm](https://img.shields.io/npm/dt/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/KyleRoss/node-lambda-log/module?style=for-the-badge) [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/KyleRoss/node-lambda-log?style=for-the-badge)](https://codeclimate.com/github/KyleRoss/node-lambda-log) [![license](https://img.shields.io/github/license/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) [![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/KyleRoss/node-lambda-log?style=for-the-badge)](https://codeclimate.com/github/KyleRoss/node-lambda-log) [![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/KyleRoss/node-lambda-log?style=for-the-badge)](https://www.codefactor.io/repository/github/kyleross/node-lambda-log) [![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/lambda-log?style=for-the-badge)](https://snyk.io/advisor/npm-package/lambda-log)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

LambdaLog is a [Node.js package](https://www.npmjs.com/package/lambda-log) facilitates and enforces logging standards in Node.js processes or applications **anywhere** by formatting your log messages as JSON for simple parsing and filtering within log management tools, such as CloudWatch Logs. _Works with all of the supported versions of Node.js on Lambda._

Originally created for AWS Lambda Functions, LambdaLog is a lightweight and feature-rich library that has **no** dependency on AWS or Lambda, meaning you can use it in any type of Node.js project you wish. **It's really a universal JSON logger.**


**Why another lambda logger?**
There are plenty of other logging libraries in the NPM ecosystem but most are convoluted, included more functionality than needed, not maintained, or are not configurable enough. I created LambdaLog to include the important functionality from other loggers, but still maintaining simplicity with minimal dependencies.

### Features

Anyone can log JSON to the `console`, but with Lambda Log you also get:

- Metadata and tags that may be set globally or individually for each log message.
- Error and Error-like objects logged include stacktraces in the metadata automatically.
- Each log message emits an event to allow third-party integration.
- Pluggable and customizable by extending the LambdaLog class.
- Pretty-printing of the JSON log message in dev mode.
- Well documented, commented, and maintained source code.
- Over 1.5 million downloads and more than 35k weekly downloads.
- Small footprint.

#### New in Version 3.0.0

Version 3.0.0 of Lambda Log brings a bunch of changes, new features, and a [new website](https://lambdalog.dev).

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

Documentation for Lambda Log has moved to our [new website](https://lambdalog.dev).



## Tests

See [Development Documentation](https://lambdalog.dev/docs/latest/development).



## Contributing

See [Contributing Documentation](https://lambdalog.dev/docs/latest/contributing).



## License

MIT License. See [License](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) in the repository.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://kyleross.me/"><img src="https://avatars.githubusercontent.com/u/2508347?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kyle Ross</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/commits?author=KyleRoss" title="Code">💻</a> <a href="https://github.com/KyleRoss/node-lambda-log/commits?author=KyleRoss" title="Documentation">📖</a> <a href="#maintenance-KyleRoss" title="Maintenance">🚧</a></td>
    <td align="center"><a href="https://github.com/jogold"><img src="https://avatars.githubusercontent.com/u/12623249?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Jonathan Goldwasser</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/commits?author=jogold" title="Code">💻</a> <a href="https://github.com/KyleRoss/node-lambda-log/issues?q=author%3Ajogold" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/gagres"><img src="https://avatars.githubusercontent.com/u/10873171?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Gabriel</b></sub></a><br /><a href="#ideas-gagres" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="https://github.com/sh1n1chi8acker"><img src="https://avatars.githubusercontent.com/u/9838599?v=4?s=100" width="100px;" alt=""/><br /><sub><b>sh1n1chi8acker</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/issues?q=author%3Ash1n1chi8acker" title="Bug reports">🐛</a></td>
    <td align="center"><a href="https://github.com/pleonasm"><img src="https://avatars.githubusercontent.com/u/619447?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Matt Nagi</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/commits?author=pleonasm" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/nickcox"><img src="https://avatars.githubusercontent.com/u/135552?v=4?s=100" width="100px;" alt=""/><br /><sub><b>nickcox</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/commits?author=nickcox" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/taschmidt"><img src="https://avatars.githubusercontent.com/u/228736?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Tim Schmidt</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/commits?author=taschmidt" title="Code">💻</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://mineiros.io"><img src="https://avatars.githubusercontent.com/u/918717?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Marius Tolzmann</b></sub></a><br /><a href="https://github.com/KyleRoss/node-lambda-log/issues?q=author%3Amariux" title="Bug reports">🐛</a></td>
    <td align="center"><a href="http://www.jengibre.com.ar"><img src="https://avatars.githubusercontent.com/u/192908?v=4?s=100" width="100px;" alt=""/><br /><sub><b>AndresQ</b></sub></a><br /><a href="#ideas-tulsidas" title="Ideas, Planning, & Feedback">🤔</a></td>
    <td align="center"><a href="http://mike.fogel.ca"><img src="https://avatars.githubusercontent.com/u/69902?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Mike Fogel</b></sub></a><br /><a href="#ideas-mfogel" title="Ideas, Planning, & Feedback">🤔</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

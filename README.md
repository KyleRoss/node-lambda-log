# lambda-log

[![npm](https://img.shields.io/npm/v/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![npm](https://img.shields.io/npm/dt/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/KyleRoss/node-lambda-log/module?style=for-the-badge) [![Code Climate coverage](https://img.shields.io/codeclimate/coverage/KyleRoss/node-lambda-log?style=for-the-badge)](https://codeclimate.com/github/KyleRoss/node-lambda-log) [![license](https://img.shields.io/github/license/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) [![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/KyleRoss/node-lambda-log?style=for-the-badge)](https://codeclimate.com/github/KyleRoss/node-lambda-log) [![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/KyleRoss/node-lambda-log?style=for-the-badge)](https://www.codefactor.io/repository/github/kyleross/node-lambda-log) [![Snyk Vulnerabilities for npm package](https://img.shields.io/snyk/vulnerabilities/npm/lambda-log?style=for-the-badge)](https://snyk.io/advisor/npm-package/lambda-log)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-10-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

## CAUTION!

This branch and release (`@next`) is under heavy development. This exists for testing and anyone who is willing to help out with testing. **DO NOT USE IN PRODUCTION!** 

If you do decide to try out this brand new version of LambdaLog, please report any issues you face as I can only catch so much. Any help would be greatly appreciated, especially if you are more versed in TypeScript than I am!



### What's new?

This is the next major release of LambdaLog (v4.0.0) which contains many major breaking changes, new features, and TypeScript support.

#### Breaking Changes

- Complete rewrite of most of the core functionality into TypeScript.
- Custom Log Levels has been removed.
- Log levels are now hardcoded and cannot be changed. This greatly simplifies the code and allows us to support TypeScript.
- Use of `Symbol` has been removed along with any static properties on the classes to retrieve the symbols.
- The `debug` option has been removed.
- The default key name for `levelKey` has changed from `_logLevel` to `__level`.
- The default key name for `tagsKey` has changed from `_tags` to `__tags`.
- The shortcut log methods are now hardcoded instead of dynamically generated.
- Removed `addLevel()` method from LambdaLog class.
- Removed `isError()` and `stubError()` static methods from the LogMessage class and moved them into utility functions.
- Environment variables that configure different options now take precedence over locally configured options.
- Internally used properties on the LogMessage class have been renamed.

#### New Features

- You can now configure the verbosity of your log messages through the new `level` option or `LAMBDALOG_LEVEL` env variable.
- Added `fatal` and `trace` log levels.
- Added `onParse` option that allows for custom parsing of log messages.
- Added `onCompile` option that allows for custom structuring of the object that is logged to the console.
- Added `onFormat` option that allows for custom formatting of the logged message. This gives the ability to render log messages in any format, not just JSON. (#75)
  - Added `clean` formatter that logs a message in a readable format.
  - Added `minimal` formatter that logs a message in a readable format without tags and metadata.
  - Ability to provide your own custom formatter as a function.
- Added ability to configure the `level`, `dev`, and `silent` options via environment variables.
- Full written in TypeScript with complete type definitions. (#63, #64)
- The package now provides an ESM and CommonJS version to support your project.

#### Fixes

- Fixed issue where directly setting `log.options.logHandler` did not work (#45).

#### Misc. Changes

- Rewrote most tests into TypeScript and still maintaining 100% coverage.



### What's left?

It has been a pretty large undertaking for me, but one that this package desperately needed. This was my first real dive into TypeScript, so I'm sure there are things than can be written better. **If there is anyone with more advanced TypeScript knowledge, I'm in great need of someone who can review the code and suggest any changes or help refactor the code to get this production-ready.** _(I'll even add you as a maintainer!)_

- Testing package implementation in Node for both vanilla JavaScript and TypeScript.
- Testing ESM support with Node and ensuring CommonJS works correctly as well.
- Ensuring the end-user has access to all the proper files and functionality.
- Documentation.



### Release Date

As much as I am trying to rush this out the door to get these features in the hands of all you awesome developers/engineers, I'm also limited on time (eg. I'm currently writing this documentation at midnight knowing that I have to wake up at 5:30am). Not only that, but I want to ensure I ship this next version of LambdaLog with performance, features, and stability in mind. I hope this will be the last major version for awhile.

Enough with all of that cheesy sob-story, let's talk about when this will be released, well, what I'm aiming for at this point. I hope to finish up most of my to-do list in the next couple of weeks and try to solicit some outside help for testing/analysis. Once that is complete, I hope to get this released as the latest stable version towards the end of 2021 or at the beginning of 2022. That's not guarantee at this point, but it will definitely be feasible if anyone in the community can help out!

---

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



## Documentation

Documentation for Lambda Log has moved to our [new website](https://lambdalog.dev).

*Note: The documentation has NOT been updated for this new release yet. I'm working on it!*



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

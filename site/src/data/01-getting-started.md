---
title: 'Getting Started'
slug: 'getting-started'
order: 1
---

# Getting Started
Lambda Log is a powerful logging mechanism for **Node 10+** that will work virtually anywhere, but best known for AWS Lambda Functions. In simple terms, this package provides functionality to log messages in a standardized JSON format that is easily read by any log system, including CloudWatch Logs.

Since the inception of Lambda Log, this project has expanded far beyond the bounds of Lambda Functions and includes many features in a lightweight, well-documented, heavily-tested, and enterprise-ready* package.

<small>* Lambda Log and all production dependencies are MIT licensed and tested for vulnerabilities.</small>

## What's New in Version 3
Version 3.0.0 of Lambda Log brings a bunch of changes, new features, and a new website.

**Broad Changes:**
- Refactor all code to meet new ESLint specifications and to stay up-to-date with newer ecmascript specifications.
- New website with better documentation.
- Tests are now using Jest instead of Mocha.
- Switched from TravisCI to Github Actions.

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

## Install
To get started, install Lambda Log using NPM or Yarn to your project:

```shell
npm install --save lambda-log
```

```shell
yarn add lambda-log
```

## Usage
In the most simplest form:

```js
const log = require('lambda-log');

log.info('Hello from Lambda Log!');
```

or for a more in-depth example in a Lambda Function:
```js
const log = require('lambda-log');

exports.handler = function(event, context, callback) {
    // set some optional metadata to be included in all logs (this is an overkill example)
    log.options.meta.event = event;
    // add additional tags to all logs
    log.options.tags.push(event.env);

    // Log info message
    log.info('my lambda function is running!');
    //=> { _logLevel: 'info' msg: 'my lambda function is running!', event:..., _tags: ['log', 'info', ...] }

    if(somethingHappenedButNotFatal) {
        log.warn('something is missing, but it is OK');
        //=> { _logLevel: 'warn', msg: 'something is missing, but it is OK', event:..., _tags: ['log', 'warn', ...] }
    }

    // Debug messages are not generated or displayed unless enabled in the config
    log.debug('some debug message');
    //=> false

    // Enable debug messages
    log.options.debug = true;
    log.debug('some debug message again');
    //=> { _logLevel: 'debug', msg: 'some debug message again', event:..., _tags: ['log', 'debug', ...] }

    someAsyncTask(function(err, results) {
        if(err) {
            log.error(err);
            //=> { _logLevel: 'error', msg: 'Error from someAsyncTask', stack: ..., event: ..., _tags: ['log', 'error', ...]}
        } else {
            log.info('someAsyncTask completed successfully!', { results });
            //=> { _logLevel: 'info', msg: 'someAsyncTask completed successfully!', results:..., event: ..., _tags: ['log', 'info', ...]}
        }
    });

    // New in version 1.4.0 - assert
    someAsyncTask(function(err, results) {
        if(err) {
            log.error(err);
            //=> { _logLevel: 'error', msg: 'Error from someAsyncTask', stack: ..., event: ..., _tags: ['log', 'error', ...]}
        } else {
            // Will only log if no results are returned
            log.assert(results, 'No results returned from someAsyncTask');
        }
    });
};
```

Check out the [API Reference](/docs/api) for more examples.

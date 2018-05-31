# lambda-log
[![npm](https://img.shields.io/npm/v/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![npm](https://img.shields.io/npm/dt/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![David](https://img.shields.io/david/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://david-dm.org/KyleRoss/node-lambda-log) [![Travis](https://img.shields.io/travis/KyleRoss/node-lambda-log/master.svg?style=for-the-badge)](https://travis-ci.org/KyleRoss/node-lambda-log) [![license](https://img.shields.io/github/license/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) [![Beerpay](https://img.shields.io/beerpay/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://beerpay.io/KyleRoss/node-lambda-log)

Basic logging mechanism for **Node 6.10+** Lambda Functions which properly formats various logs into JSON format for easier reading through Cloudwatch Logs. The module includes functionality to include custom metadata and tags for each log, allowing increased filtering capabilities within Cloudwatch.

**Why another lambda logger?**  
There are others out there, but seemed to be convoluted, included more functionality than needed, not maintained, or not configurable enough. I created lambda-log to include the important functionality from other loggers, but still keeping it simple and dependency-free.

### Features

* Global metadata and tags that are included with every log.
* Pluggable by wrapping/extending the LambdaLog class.
* Emits event on log to allow third-party integration.
* Error and Error-like objects logged include stacktraces in the metadata automatically.
* Pretty-printing of JSON object in [dev](#lambdalogconfig) mode.
* Well-documented and commented source.
* Small footprint and dependency-free!

---

## Getting Started
### Requirements
Node v6.10+ is required. You need to ensure that your Lambda function is running with the correct Node version.

### Install
Install via NPM:

```bash
$ npm install lambda-log --save
```

### Usage
Here is a basic usage example, read the API documentation below to learn more.

```js
const log = require('lambda-log');

exports.handler = function(event, context, callback) {
    // set some optional metadata to be included in all logs (this is an overkill example)
    log.config.meta.event = event;
    // add additional tags to all logs
    log.config.tags.push(event.env);
    
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
    log.config.debug = true;
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

---

## API Documentation

### lambdalog
Instance of the `LambdaLog` class which is exported when calling `require('lambda-log')`.

### lambdalog.config
Configuration object for LambdaLog. These options can be changed at any time.

* meta _(object)_ - Global metadata to be included in all logs. (Default: `{}`)
* tags _(Array)_ - Global tags to be included in all logs. (Default: `[]`)
* debug _(Boolean)_ - Enables `lambdalog.debug()`. (Default: `false`)
* dev _(Boolean)_ - Enable development mode which pretty-prints JSON to the console. (Default: `false`)
* silent _(Boolean)_ - Disables logging to `console` but messages and events are still generated. (Default: `false`)

### lambdalog.log(level, msg[, meta={}])
Generates JSON log message based on the provided parameters and the global configuration. Once the JSON message is created, it is properly logged to the `console` and emitted through an event. If and `Error` or `Error`-like object is provided for `msg`, it will parse out the message and include the stacktrace in the metadata. 

| Argument | Type   | Required? | Description                                                                     |
|----------|--------|-----------|---------------------------------------------------------------------------------|
| `level`  | String | Yes       | Log level to create log for. Must be either `info`, `debug`, `warn` or `error`. |
| `msg`    | Any    | Yes       | Message to log. Can be of any type, but string or `Error` is recommended.       |
| `meta`   | Object | No        | Optional metadata object to include into the log JSON.                          |

**Example:**
```js
const log = require('lambda-log');

log.log('info', 'This is a test info message');
log.log('info', 'This is a test info message', { someKey: 'with some optional metadata!' });
```

###### Throws: - _Error_
> If improper log level is provided.  
###### Returns: _[logResponse](#logresponse)_
> The generated log message or `false` if `level="debug"` and `config.debug=false`.

### lambdalog.info(msg[, meta={}])
Shorthand method for calling `lambdalog.log('info')`.

| Argument | Type   | Required? | Description                                                                 |
|----------|--------|-----------|-----------------------------------------------------------------------------|
| `msg`    | Any    | Yes       | Message to log. Can be of any type, but string or `Error` is recommended.   |
| `meta`   | Object | No        | Optional metadata object to include into the log JSON.                      |

**Example:**
```js
const log = require('lambda-log');

log.info('This is a test info message');
log.info('This is a test info message', { someKey: 'with some optional metadata!' });
```

###### Returns: _[logResponse](#logresponse)_
> The generated log message.

### lambdalog.warn(msg[, meta={}])
Shorthand method for calling `lambdalog.log('warn')`.

| Argument | Type   | Required? | Description                                                                 |
|----------|--------|-----------|-----------------------------------------------------------------------------|
| `msg`    | Any    | Yes       | Message to log. Can be of any type, but string or `Error` is recommended.   |
| `meta`   | Object | No        | Optional metadata object to include into the log JSON.                      |

**Example:**
```js
const log = require('lambda-log');

log.warn('This is a test warn message');
log.warn('This is a test warn message', { someKey: 'with some optional metadata!' });
```

###### Returns: _[logResponse](#logresponse)_
> The generated log message.

### lambdalog.error(msg[, meta={}])
Shorthand method for calling `lambdalog.log('error')`.

| Argument | Type   | Required? | Description                                                                 |
|----------|--------|-----------|-----------------------------------------------------------------------------|
| `msg`    | Any    | Yes       | Message to log. Can be of any type, but string or `Error` is recommended.   |
| `meta`   | Object | No        | Optional metadata object to include into the log JSON.                      |

**Example:**
```js
const log = require('lambda-log');

log.error('This is a test error message');
log.error('This is a test error message', { someKey: 'with some optional metadata!' });

let err = new Error('Some error happened!');
log.error(err);
```

###### Returns: _[logResponse](#logresponse)_
> The generated log message.

### lambdalog.debug(msg[, meta={}])
_(Since v1.1.0)_ Shorthand method for calling `lambdalog.log('debug')`. By default, debug messages are not generated, displayed or emitted. To enable this functionality, you must set `config.debug` to `true`.

| Argument | Type   | Required? | Description                                                                 |
|----------|--------|-----------|-----------------------------------------------------------------------------|
| `msg`    | Any    | Yes       | Message to log. Can be of any type, but string or `Error` is recommended.   |
| `meta`   | Object | No        | Optional metadata object to include into the log JSON.                      |

**Example:**
```js
const log = require('lambda-log');

// This log will return false and not display any message since config.debug is false by default
log.debug('This is a test debug message');
//=> false

// But if we enable config.debug, it will act the same as the other log methods:
log.config.debug = true;
log.debug('This is a test debug message');
//=> { msg: "This is a test debug message" ... }
```

###### Returns: _[logResponse](#logresponse)_
> The generated log message or `false` if `config.debug` is not enabled.

### lambdalog.assert(test, msg[, meta={}])
_(Since v1.4.0)_ Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to wrap them in an if statement.

| Argument | Type   | Required? | Description                                                                 |
|----------|--------|-----------|-----------------------------------------------------------------------------|
| `test`   | Any    | Yes       | Value to test if is falsy.                                                  |
| `msg`    | Any    | Yes       | Message to log. Can be of any type, but string or `Error` is recommended.   |
| `meta`   | Object | No        | Optional metadata object to include into the log JSON.                      |

**Example:**
```js
const log = require('lambda-log');

let results = null;
// This log will be displayed since `results` is a falsy value.
log.assert(results, 'No results provided!');
//=> { msg: "No results provided!" ... }

// But if they are truthy, the log is ignored:
results = [1, 2, 3];
log.assert(results, 'No results provided!');
//=> false
```

###### Returns: _[logResponse](#logresponse)_
> The generated log message or `false` if `config.debug` is not enabled.

### lambdalog.LambdaLog([meta={}, tags=[]])
Provides access to uninstantiated LambdaLog class. If you want to customize the logger or build a wrapper around LambdaLog, you have access to the class via `lambdalog.LambaLog`.

| Argument | Type   | Required? | Description                                       |
|----------|--------|-----------|---------------------------------------------------|
| `meta`   | Object | No        | Optional metadata object to include in every log. |
| `tags`   | Array  | No        | Optional tags array to include in every log.      |

**Example:**
```js
const LambdaLog = require('lambda-log').LambdaLog;

class MyLogger extends LambdaLog {
    constructor() {
        super({ someKey: 'Global metadata' }, ['custom-tag']);
    }
    
    // overwrite lambdalog.error() to do some custom things
    error(msg, meta={}) {
        // turn message into Error object (to generate stacktraces automatically)
        let err = new Error(msg);
        return this.log('error', err, meta);
    }
}
```

###### Returns: _this_
> Instance of LambdaLog.

### logResponse
**Type:** Object | Boolean

The data returned from any log method. If the using `log.debug()` and `config.debug` is disabled, the response will be `false`.

**Default Properties:**
* `_logLevel` _(String)_ - The log level (ex. error, warn, info, debug) _Since 1.3.0_
* `msg` _(String)_ - The message of the log
* `_tags` _(Array[String])_ - Array of tags applied to the log

**Conditional Properties:**
* `*` _(Any)_ - Any metadata provided to the log as individual properties
* `stack` _(String)_ - Stack trace of an error if `Error` was provided


### Event: log
The `log` event is emitted (using EventEmitter) for every log generated. This allows for custom integrations, such as logging to a thrid-party service. This event is emitted with the log data object generated by `lambdalog.log()` along with level and metadata. You may control events using all the methods of EventEmitter.

**Event Attributes:**
* `level` _(String)_ - The level of the log (error, warn, ...)
* `log` _(Object)_ - The generated log object that contains `msg`, `_tags` and any metadata
* `meta` _(Object)_ - Metadata for the log

**Example:**
```js
const log = require('lambda-log');

// ES6 Destructuring
log.on('log', function({ level, log, meta }) {
    // ... do what you want with the log data, such as integrating with third-party service
    console.log(log.msg);
    console.log(log._tags);
    console.log(level);
    console.log(meta);
});

log.on('log', function(data) {
    // ... do what you want with the log data, such as integrating with third-party service
    console.log(data.log.msg);
    console.log(data.log._tags);
    console.log(data.level);
    console.log(data.meta);
});
```

---

## Tests
Tests are written and provided as part of the module. It requires mocha to be installed which is included as a `devDependency`. You may run the tests by calling:

```bash
$ npm run test
```

## Contributing
Feel free to submit a pull request if you find any issues or want to integrate a new feature. Keep in mind, this module should be lightweight and advanced functionality should be published to NPM as a wrapper around this module. Ensure to write and run the tests before submitting a pull request. The code should work without any special flags in Node 6.10.

## License
MIT License. See [License](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) in the repository.

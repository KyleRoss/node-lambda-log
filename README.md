# lambda-log
[![npm](https://img.shields.io/npm/v/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![npm](https://img.shields.io/npm/dt/lambda-log.svg?style=for-the-badge)](https://www.npmjs.com/package/lambda-log) [![David](https://img.shields.io/david/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://david-dm.org/KyleRoss/node-lambda-log) [![Travis](https://img.shields.io/travis/KyleRoss/node-lambda-log/master.svg?style=for-the-badge)](https://travis-ci.org/KyleRoss/node-lambda-log) [![Coveralls](https://img.shields.io/coveralls/github/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://coveralls.io/github/KyleRoss/node-lambda-log) [![license](https://img.shields.io/github/license/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE) [![Beerpay](https://img.shields.io/beerpay/KyleRoss/node-lambda-log.svg?style=for-the-badge)](https://beerpay.io/KyleRoss/node-lambda-log)

Basic logging mechanism for **Node 6.10+** Lambda Functions which properly formats various logs into JSON format for easier reading through Cloudwatch Logs. The module includes functionality to include custom metadata and tags for each log, allowing increased filtering capabilities within Cloudwatch.

> This module is not just for Lambda! You can use this is many different environments that support reading JSON from logs. While the name remains `lambda-log`, it's really a universal JSON logger.

**Why another lambda logger?**  
There are others out there, but seemed to be convoluted, included more functionality than needed, not maintained, or not configurable enough. I created lambda-log to include the important functionality from other loggers, but still keeping it simple and dependency-free.

### Features

* Global metadata and tags that are included with every log.
* Pluggable by wrapping/extending the LambdaLog class.
* Emits event on log to allow third-party integration.
* Error and Error-like objects logged include stacktraces in the metadata automatically.
* Pretty-printing of JSON object in [dev](#lambdalogconfig) mode.
* Well-documented and commented source.
* Small footprint!

#### New in Version 2.0.0
* Dynamic metadata can be added to every log (ex. timestamp).
* ~~Logs can be piped to a custom stream instead of stdout/stderr.~~
  * In 2.1.0, you can override the logging mechanism with a `console`-like object.
* Log levels and their corresponding console method can be customized.
* Logs are now an instance of a class with a simple API.
* When logs are converted to JSON, you can customize/mask certain data using a replacer function.
* And a bunch more...

There are a few breaking changes in version 2.0.0. If you are upgrading from the previous version, please read the Changelog and documentation to see how these changes could affect your implementation.

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

---

# API Documentation
<a name="module_lambda-log"></a>

## lambda-log
<a name="exp_module_lambda-log--log"></a>

### log : [<code>LambdaLog</code>](#LambdaLog) ⏏
Instance of the [LambdaLog](#lambdalog) class which is exported when calling `require('lambda-log')`. 
For more advanced usage, you can create a new instance of the LambdaLog class via `new log.LambdaLog()`.

**Kind**: Exported LambdaLog Instance  
**Example**  
```js
const log = require('lambda-log');

// Advanced usage, create new instance of LambdaLog:
const LambdaLog = require('lambda-log').LambdaLog;
const log = new LambdaLog();
```
<a name="LambdaLog"></a>

## LambdaLog ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)
**Kind**: global class  
**Extends**: [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)  

* [LambdaLog](#LambdaLog) ⇐ [<code>EventEmitter</code>](https://nodejs.org/api/events.html#events_class_eventemitter)
    * [new LambdaLog([options], [levels])](#new_LambdaLog_new)
    * [log.LambdaLog](#LambdaLog+LambdaLog) : [<code>LambdaLog</code>](#LambdaLog)
    * [log.LogMessage](#LambdaLog+LogMessage) : [<code>LogMessage</code>](#LogMessage)
    * [log.options](#LambdaLog+options)
    * [log.&lt;info|warn|error|debug|*&gt;(msg, [meta], [tags])](#LambdaLog+&lt;info|warn|error|debug|*&gt;) ⇒ [<code>LogMessage</code>](#LogMessage)
    * [log.log(level, msg, [meta], [tags])](#LambdaLog+log) ⇒ [<code>LogMessage</code>](#LogMessage) \| <code>Boolean</code>
    * [log.assert(test, msg, [meta], [tags])](#LambdaLog+assert) ⇒ [<code>LogMessage</code>](#LogMessage) \| <code>Boolean</code>
    * [log.result(promise, [meta], [tags])](#LambdaLog+result) ⇒ [<code>Promise.&lt;LogMessage&gt;</code>](#LogMessage)
    * Event: [log](#LambdaLog+event_log)

<a name="new_LambdaLog_new"></a>

### new LambdaLog([options], [levels])
Constructor for the LambdaLog class. Provided to be utilized in more advanced cases to allow overriding and configuration. By default, this module will export an instance of this class, but you may access the class and create your own instance via `log.LambdaLog`.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [options] | <code>Object</code> | <code>{}</code> | Options object. See [<code>log.options</code>](#logoptions) for available options. |
| [levels] | <code>Object</code> | <code>{}</code> | Allows adding and customizing log levels. See [Custom Log Levels](#custom-log-levels). |

<a name="LambdaLog+LambdaLog"></a>

### log.LambdaLog : [<code>LambdaLog</code>](#LambdaLog)
Access to the uninstantiated LambdaLog class. This allows more advanced functionality and customization.

**Kind**: instance property of [<code>LambdaLog</code>](#LambdaLog)  
**Example**  
```js
const LambdaLog = require('lambda-log').LambdaLog;
const log = new LambdaLog();
```
<a name="LambdaLog+LogMessage"></a>

### log.LogMessage : [<code>LogMessage</code>](#LogMessage)
Access to the uninstantiated LogMessage class. You can override this property to use a custom logging class that inherits the same methods.

**Kind**: instance property of [<code>LambdaLog</code>](#LambdaLog)  
**Since**: 2.2.0  
**Example**  
```js
const log = require('lambda-log');
const MyCustomLogMessageClass = require('./myCustomLogMessageClass.js');

log.LogMessage = MyCustomLogMessageClass;
```
<a name="LambdaLog+options"></a>

### log.options
Configuration object for LambdaLog. Most options can be changed at any time via `log.options.OPTION = VALUE;` unless otherwise noted.

**Kind**: instance property of [<code>LambdaLog</code>](#LambdaLog)  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [meta] | <code>Object</code> | <code>{}</code> | Global metadata to be included in all logs. |
| [tags] | <code>Array.&lt;String&gt;</code> | <code>[]</code> | Global tags to be included in all logs. |
| [dynamicMeta] | <code>function</code> | <code></code> | Function that runs for each log that returns additional metadata. See [Dynamic Metadata](#dynamic-metadata). |
| [debug] | <code>Boolean</code> | <code>false</code> | Enables `log.debug()`. |
| [dev] | <code>Boolean</code> | <code>false</code> | Enable development mode which pretty-prints JSON to the console. |
| [silent] | <code>Boolean</code> | <code>false</code> | Disables logging to `console` but messages and events are still generated. |
| [replacer] | <code>function</code> | <code></code> | Replacer function for `JSON.stringify()` to allow handling of sensitive data before logs are written. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter). |
| [logHandler] | <code>Object</code> | <code>console</code> | A console-like object containing all standard console functions. Allows logs to be written to any custom location. See [Log Handler](#loghandler). |

<a name="LambdaLog+&lt;info|warn|error|debug|*&gt;"></a>

### log.&lt;info\|warn\|error\|debug\|\*&gt;(msg, [meta], [tags]) ⇒ [<code>LogMessage</code>](#LogMessage)
Shortcut methods for `log.log()`. By default, the following methods are available: `log.info()`, `log.warn()`, `log.error()` and `log.debug()`. 
Additional methods will be added for any [custom log levels](#custom-log-levels) provided.<br><br>The provided msg can be any type, although a string 
or `Error` is recommended. If `Error` is provided the stack trace is added as metadata to the log as `stack`.

**Kind**: instance method of [<code>LambdaLog</code>](#LambdaLog)  
**Returns**: [<code>LogMessage</code>](#LogMessage) - The LogMessage instance for the log.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| msg | <code>\*</code> |  | Message to log. Can be any type, but string or `Error` reccommended. |
| [meta] | <code>Object</code> | <code>{}</code> | Optional meta data to attach to the log. |
| [tags] | <code>Array</code> | <code>[]</code> | Additional tags to append to this log. |

**Example**  
```js
const log = require('lambda-log');

log.info('Test info log');
log.debug('Test debug log');
log.warn('Test warn log');
log.error('Test error log');
```
<a name="LambdaLog+log"></a>

### log.log(level, msg, [meta], [tags]) ⇒ [<code>LogMessage</code>](#LogMessage) \| <code>Boolean</code>
Generates JSON log message based on the provided parameters and the global configuration. Once the JSON message is created, it is properly logged to the `console` 
and emitted through an event. If an `Error` or `Error`-like object is provided for `msg`, it will parse out the message and include the stacktrace in the metadata.

**Kind**: instance method of [<code>LambdaLog</code>](#LambdaLog)  
**Returns**: [<code>LogMessage</code>](#LogMessage) \| <code>Boolean</code> - Returns instance of LogMessage or `false` if `level = "debug"` and `options.debug = false`. May also return `false` when a [custom log level](#custom-log-levels) handler function prevents the log from being logged.  
**Throws**:

- <code>Error</code> If improper log level is provided.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| level | <code>String</code> |  | Log level (`info`, `debug`, `warn`, `error` or a [custom log level](#custom-log-levels)) |
| msg | <code>\*</code> |  | Message to log. Can be any type, but string or `Error` reccommended. |
| [meta] | <code>Object</code> | <code>{}</code> | Optional meta data to attach to the log. |
| [tags] | <code>Array</code> | <code>[]</code> | Additional tags to append to this log. |

**Example**  
```js
log.log('error', 'Something failed!');
// same as:
log.error('Something failed!');
```
<a name="LambdaLog+assert"></a>

### log.assert(test, msg, [meta], [tags]) ⇒ [<code>LogMessage</code>](#LogMessage) \| <code>Boolean</code>
Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to 
wrap them in an if statement. The log level will be `error`.

**Kind**: instance method of [<code>LambdaLog</code>](#LambdaLog)  
**Returns**: [<code>LogMessage</code>](#LogMessage) \| <code>Boolean</code> - The LogMessage instance for the log or `false` if test passed.  
**Since**: 1.4.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| test | <code>\*</code> |  | A value which is tested for a falsy value. |
| msg | <code>\*</code> |  | Message to log if `test` is falsy. Can be any type, but string or `Error` reccommended. |
| [meta] | <code>Object</code> | <code>{}</code> | Optional meta data to attach to the log. |
| [tags] | <code>Array</code> | <code>[]</code> | Additional tags to append to this log. |

**Example**  
```js
let results = null;
// This log will be displayed since `results` is a falsy value.
log.assert(results, 'No results provided!');
//=> { msg: "No results provided!" ... }

// But if they are truthy, the log is ignored:
results = [1, 2, 3];
log.assert(results, 'No results provided!');
//=> false
```
<a name="LambdaLog+result"></a>

### log.result(promise, [meta], [tags]) ⇒ [<code>Promise.&lt;LogMessage&gt;</code>](#LogMessage)
Generates a log message with the result or error provided by a promise. Useful for debugging and testing.

**Kind**: instance method of [<code>LambdaLog</code>](#LambdaLog)  
**Returns**: [<code>Promise.&lt;LogMessage&gt;</code>](#LogMessage) - A new Promise that resolves with the LogMessage object after the promise completes.  
**Since**: 2.3.0  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| promise | <code>Promise</code> |  | A promise or promise-like object to retrieve a value from. |
| [meta] | <code>Object</code> | <code>{}</code> | Optional meta data to attach to the log. |
| [tags] | <code>Array</code> | <code>[]</code> | Additional tags to append to this log. |

**Example**  
```js
let promise = new Promise(resolve => resolve('this is a test'));

log.result(promise);
// => { "msg": "this is a test" ... }
```
<a name="LambdaLog+event_log"></a>

### Event: log
The log event is emitted (using EventEmitter) for every log generated. This allows for custom integrations, such as logging to a thrid-party service. 
This event is emitted with the [LogMessage](#logmessage) instance for the log. You may control events using all the methods of EventEmitter.

**Kind**: event emitted by [<code>LambdaLog</code>](#LambdaLog)  
**Example**  
```js
log.on('log', message => {
    // an example would be sending the log message to another service
    someLogService(message.toJSON());
});
```
<a name="LogMessage"></a>

## LogMessage
The LogMessage class is a private/internal class that is used for generating log messages. All log methods return an instance of LogMessage allowing for a chainable api. 
Having a seperate class and instance for each log allows chaining and the ability to further customize this module in the future without major breaking changes. The documentation 
provided here is what is available to you for each log message.

**Kind**: global class  

* [LogMessage](#LogMessage)
    * [new LogMessage(log, opts)](#new_LogMessage_new)
    * [logMessage.level](#LogMessage+level) : <code>String</code>
    * [logMessage.meta](#LogMessage+meta) : <code>Object</code>
    * [logMessage.tags](#LogMessage+tags) : <code>Array.&lt;String&gt;</code>
    * [logMessage.msg](#LogMessage+msg) : <code>String</code>
    * [logMessage.value](#LogMessage+value) ⇒ <code>Object</code>
    * [logMessage.log](#LogMessage+log) ⇒ <code>Object</code>
    * [logMessage.throw](#LogMessage+throw)
    * [logMessage.toJSON([format])](#LogMessage+toJSON) ⇒ <code>String</code>

<a name="new_LogMessage_new"></a>

### new LogMessage(log, opts)
Constructor for LogMessage


| Param | Type | Description |
| --- | --- | --- |
| log | <code>Object</code> | Object containing all the information for a log. |
| log.level | <code>String</code> | The log level. |
| log.msg | <code>\*</code> | The message for the log. |
| [log.meta] | <code>Object</code> | Metadata attached to the log. |
| [log.tags] | <code>Array.&lt;String&gt;</code> | Additional tags to attach to the log. |
| opts | <code>Object</code> | Configuration options from LambdaLog. |

<a name="LogMessage+level"></a>

### logMessage.level : <code>String</code>
String log level of the message.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Example**  
```js
log.error('This is an error').level;
//=> "error"
```
<a name="LogMessage+meta"></a>

### logMessage.meta : <code>Object</code>
The fully compiled metadata object for the log. Includes global and dynamic metadata.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Example**  
```js
log.info('This is some info', { hello: 'world' }).meta;
//=> { hello: 'world', ... }
```
<a name="LogMessage+tags"></a>

### logMessage.tags : <code>Array.&lt;String&gt;</code>
Array of tags attached to this log. Includes global tags.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Example**  
```js
log.info('This is some info', {}, ['custom-tag']).tags;
//=> ["custom-tag", ...]
```
<a name="LogMessage+msg"></a>

### logMessage.msg : <code>String</code>
The message for the log. If an Error was provided, it will be the message of the error.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Example**  
```js
log.error('This is an error').msg;
//=> "This is an error"
```
<a name="LogMessage+value"></a>

### logMessage.value ⇒ <code>Object</code>
The full log object. This is the object used in logMessage.toJSON() and when the log is written to the console. 
See [Log Output](#log-output) for more information.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Returns**: <code>Object</code> - The full log object.  
**Example**  
```js
log.info('This is some info').value;
//=> { _logLevel: 'info', msg: 'This is some info', ... }
```
<a name="LogMessage+log"></a>

### logMessage.log ⇒ <code>Object</code>
Alias of `logMessage.value`.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Returns**: <code>Object</code> - The full log object.  
<a name="LogMessage+throw"></a>

### logMessage.throw
Throws the log. If an error was not provided, one will be generated for you and thrown. This is useful in cases where you need to log an 
error, but also throw it.

**Kind**: instance property of [<code>LogMessage</code>](#LogMessage)  
**Throws**:

- <code>Error</code> The provided error, or a newly generated error.

**Example**  
```js
log.error('This is an error').throw;

//Shorthand for:
let logMsg = log.error('This is an error');
let error = new Error(logMsg.msg);
error.log = logMsg;

throw error;
```
<a name="LogMessage+toJSON"></a>

### logMessage.toJSON([format]) ⇒ <code>String</code>
Returns the compiled log object converted into JSON. This method utilizes `options.replacer` for the replacer function. It also uses 
[json-stringify-safe](https://www.npmjs.com/package/json-stringify-safe) to prevent circular reference issues.

**Kind**: instance method of [<code>LogMessage</code>](#LogMessage)  
**Returns**: <code>String</code> - Log object stringified as JSON.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [format] | <code>Boolean</code> | <code>false</code> | Enable pretty-printing of the JSON object (4 space indentation). |

**Example**  
```js
log.error('This is an error').toJSON(true);
//=> {
//      "_logLevel": "error",
//      "msg": "This is an error",
//      ...
//   }
```
---

### Log Output
Each log generated is a custom object that has a set of properties containing all of the values of the log. This output is converted to JSON and logged to the console. Below are the properties included in the log.

#### Default Properties:
* `_logLevel` _(String)_ - The log level (ex. error, warn, info, debug) _Since 1.3.0_
* `msg` _(String)_ - The message of the log
* `_tags` _(Array[String])_ - Array of tags applied to the log

#### Conditional Properties:
* `*` _(Any)_ - Any metadata provided, dynamic metadata and global metadata as individual properties
* `stack` _(String)_ - Stack trace of an error if an `Error` was provided

---

### Custom Log Levels
New in version 2.0.0, the ability to customize log levels is now available. In order to customize the log levels, you must create a new instance of `LambdaLog` as any changes directly to a pre-existing instance will not function correctly. The custom log levels are manipulated by passing in an object to the `levels` argument of the LambdaLog constructor. The provided custom log levels object will override and extend the existing log levels.

Any custom log levels added will be available as shorthand methods on the LambdaLog instance.

#### Log Levels Object
The log levels object is a simple object that should contain key/value pairs. The keys should be the log level and the values may be either a string or function. If a string is provided, it should be the corresponding `console` method name to use for the log (ex. `log` or `info`). If a function is provided, it must return either a string `console` method or `false` to prevent logging. The function will be called for every log with `message` ([LogMessage](#logmessage)) as the only parameter, allowing customizing the logging for certain messages.

```js
const LambdaLog = require('lambda-log').LambdaLog;

const log = new LambdaLog({}, {
    fatal: 'error',
    poop: function(message) {
        // prepend an emoji to every message
        message.msg = '💩 ' + message.msg;
        
        return 'log';
    },
    info: function() {
        // Make `log.info()` work like `log.debug()`
        if(this.options.debug) return false;
        return 'info';
    }
});

log.poop('This is a test');
//=> "💩 This is a test"
```

---

### Dynamic Metadata
New in version 2.0.0, lambda-log now has the ability to execute and include dynamic metadata for each log. Dynamic metadata is generated using a function (`log.options.dynamicMeta`) on the creation of each message and included into the metadata.

#### Dynamic Metadata Function
The dynamic metadata function is included into `log.options` and will run for every log. The function is called with parameters `message` (the LogMessage instance) and `options` (`log.options` object). The function should return an object with metadata to inject into the log.

```js
// Add timestamp to each log
log.options.dynamicMeta = function(message) {
    return {
        timestamp: new Date().toISOString()
    };
};
```

---

### Log Handler
New in version 2.1.0, you may now customize the methods used to log messages. By default, lambda-log uses the global `console` object, but you can override this with a custom instance of <code><a href="https://nodejs.org/docs/latest-v8.x/api/console.html#console_new_console_stdout_stderr">Console</a></code> or your own `console`-like object that implements, at minimum, the following functions:

* log
* debug
* info
* error
* warn

Keep in mind that custom implementations must be synchronus. If you need it to be asynchronus, you will need to use a custom <code><a href="https://nodejs.org/docs/latest-v8.x/api/console.html#console_new_console_stdout_stderr">Console</a></code> instance and implement utilizing streams.

```js
const log = require('lambda-log');

// example using `Console` instance
const { Console } = require('console');
log.options.logHandler = new Console(myStdoutStream, myStderrStream);

// or with a console-like object
const myConsole = {
    log(message) {
        // log `message` somewhere custom
    },
    error(message) {
        // ...
    },
    ...
};
```

Note that this is a breaking change from version 2.0.0 as there were issues by always utlizing a custom `Console` instance for certain users.

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

---
title: 'API Reference'
slug: 'api'
order: 20
---

# API Reference
Using `lambda-log` is very simple and can be utilized by either using the default `export` or by instantiating the [LambdaLog](#lambdalog) class.

## Module

### <h type="module" text="lambda-log" />
The default export for this package which is an instance of the [LambdaLog](#lambdalog) class.

**Kind:** [LambdaLog](#lambdalog) Instance<br>
**Example**
```js
const log = require('lambda-log');

log.info('Hello world!');
```

#### <h type="property" text="log.LambdaLog" returns="#LambdaLog" />
Access to the uninstantiated [LambdaLog](#lambdalog) class. Useful for creating your own instance or adding/overridding functionality.

**Example**
```js
const { LambdaLog } = require('lambda-log');
const log = new LambdaLog();

log.info('Hello world!');
```

#### <h type="property" text="log.LogMessage" returns="#LogMessage" />
Access to the uninstantiated [LogMessage](#logmessage) class. You can override this property to use a custom logging class that inherits the same methods.

**Example**
```js

```

## Classes

### <h type="class" text="LambdaLog" />
Main class for the module.

**Extends:** [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter)

#### <h type="function" text="constructor([options], [levels])" />
Constructor for the LambdaLog class. Provided to be utilized in more advanced cases to allow overriding and configuration. By default, this module will export an instance of this class but you may access the class and create your own instance via `log.LambdaLog`.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| options | Object | No | Options object. See [log.options](#logoptions) for available options. | `{}` |
| levels | Object | No | Allows adding and customizing log levels. See [Custom Log Levels](/docs/custom-log-levels). | `{}` |

**Returns:** _this_

#### <h type="property" text="log.options" returns="Object" />
Configuration object for LambdaLog. All options are optional. Most options can be changed at any time via `log.options.OPTION = VALUE;` unless otherwise noted. Options changed using `log.options` apply to the specific instance of LambdaLog. If you need to use different options throughout your app, it's best to create a new instance of [LambdaLog](#lambdalog) for each corresponding need.

| Option | Type | Default | Description |
| ------ | ---- | ------- | ----------- |
| meta | `Object` | `{}` | Global metadata to be included in all logs for the instance of LambdaLog. |
| tags | `String[]|Function[]` | `[]` | Global tags to be included in all logs for the instance of LambdaLog. See [Enhanced Tags](/docs/enhanced-tags). |
| dynamicMeta | `Function` | `null` | Function that is executed for each log message to retrieve additional metadata. See [Dynamic Metadata](/docs/dynamic-metadata). |
| debug | `Boolean` | `false` | Enables `log.debug()`. |
| dev | `Boolean` | `false` | Enables pretty-printing of JSON logs to the `console`. |
| silent | `Boolean` | `false` | Disables logging to `console` but messages and events are still generated. Can be controlled by `LAMBDALOG_SILENT` environment variable. |
| replacer | `Function` | `null` | Replacer function for `JSON.stringify()` to allow handling of sensitive data before logs are written. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter). |
| logHandler | `Object` | `console` | A console-like object containing all standard console functions. Allows logs to be written to any custom location. See [Log Handler](/docs/log-handler). |
| levelKey | `String|null` | `_logLevel` | _Since 3.0.0_ — Override the key in the JSON log message for the log level. Set to `null` to remove this key from the JSON output. |
| messageKey | `String` | `msg` | _Since 3.0.0_ — Override the key in the JSON log message for the message. |
| tagsKey | `String|null` | `_tags` | _Since 3.0.0_ — Override the key in the JSON log message for the tags. Set to `null` to remove this key from the JSON output. |

#### <h type="function" text="log.<info|warn|error|debug|*>(msg, [meta], [tags])" returns="#LogMessage" />
Shortcut methods for `log.log()`. By default, the following methods are available: `log.info()`, `log.warn()`, `log.error()` and `log.debug()`. Additional methods will be added for any custom log levels provided.

The provided `msg` can be any type, although a string or `Error` is recommended. If `Error` is provided the stack trace is added as metadata to the log as `stack`.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| msg | `Any` | Yes | Message to log. Can be any type, but string or Error reccommended. | -- |
| meta | `Object` | No | Metadata to include in the logged JSON. If an object is provided, each of the properties are merged into the root of the JSON. If any other type is provided, the value will be set on the `meta` key within the root of the JSON. | `{}` |
| tags | `String[]|Function[]` | No | Tags to set for this log message. See [Enhanced Tags](/docs/enhanced-tags). | `[]` |

**Returns:** [LogMessage](#logmessage)

**Example**
```js
const log = require('lambda-log');

log.info('Test info log');
log.debug('Test debug log');
log.warn('Test warn log');
log.error('Test error log');

log.error(new Error('There was an error!'));
log.info('Success!', { stats }, ['success']);
```

#### <h type="function" text="log.log(level, msg, [meta], [tags])" returns="#LogMessage|Boolean" />
Generates JSON log message based on the provided parameters and the global configuration. Once the JSON message is created, it is properly logged to the `console` and emitted through an event. If an `Error` or `Error`-like object is provided for `msg`, it will parse out the message and include the stacktrace in the metadata.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| level | `String` | Yes | The log level for this log. Must be one of `info`, `warn`, `error`, `debug` or the name of a [custom log level](/docs/custom-log-levels). | -- |
| msg | `Any` | Yes | Message to log. Can be any type, but string or Error reccommended. | -- |
| meta | `Object` | No | Metadata to include in the logged JSON. If an object is provided, each of the properties are merged into the root of the JSON. If any other type is provided, the value will be set on the `meta` key within the root of the JSON. | `{}` |
| tags | `String[]|Function[]` | No | Tags to set for this log message. See [Enhanced Tags](/docs/enhanced-tags). | `[]` |

**Returns:** [LogMessage](#logmessage)

**Example**
```js
log.log('error', 'Something failed!');
// same as:
log.error('Something failed!');
```

#### <h type="function" text="log.assert(test, msg, [meta], [tags])" returns="#LogMessage|Boolean">
Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to wrap them in an if statement. The log level will be `error`.

**Since:** 1.4.0

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| test | `Any` | Yes | A value which is tested for a falsy value. | -- |
| msg | `Any` | Yes | Message to log. Can be any type, but string or Error reccommended. | -- |
| meta | `Object` | No | Metadata to include in the logged JSON. If an object is provided, each of the properties are merged into the root of the JSON. If any other type is provided, the value will be set on the `meta` key within the root of the JSON. | `{}` |
| tags | `String[]|Function[]` | No | Tags to set for this log message. See [Enhanced Tags](/docs/enhanced-tags). | `[]` |

**Returns:** [LogMessage](#logmessage) _or_ `false` if test passed.

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

#### <h type="function" text="log.result(promise, [meta], [tags])" returns="Promise<#LogMessage>">
Generates a log message with the result or error provided by a promise. Useful for debugging and testing.

**Since:** 2.3.0

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| promise | `Promise` | Yes | A Promise to retrieve a result from. | -- |
| meta | `Object` | No | Metadata to include in the logged JSON. If an object is provided, each of the properties are merged into the root of the JSON. If any other type is provided, the value will be set on the `meta` key within the root of the JSON. | `{}` |
| tags | `String[]|Function[]` | No | Tags to set for this log message. See [Enhanced Tags](/docs/enhanced-tags). | `[]` |

**Returns:** Promise<[LogMessage](#logmessage)>

**Example**
```js
let promise = new Promise(resolve => resolve('this is a test'));

log.result(promise);
// => { "_logLevel": "info", "msg": "this is a test" ... }

// If the Promise rejects:
let promise = new Promise((resolve, reject) => reject(new Error('Something failed')));
log.result(promise);
// => { "_logLevel": "error", "msg": "Something failed" ... }
```

#### <h type="function" text="log.addLevel(name, handler)">
Add a custom log level to this instance of LambdaLog. A dynamic method for the new log level will be added to the class. If you pass a `function` as `handler`, the function is called for each log message with the parameter `msg` — The [LogMessage](#logmessage) instance for the current log message — and the function is scoped to the current instance of LambdaLog. This function must return either `false` to disable the log from being generated or a string `console` method name such as `log`, `info`, `warn`, `error`, and `debug`.

**Since:** 3.0.0

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| name | `String` | Yes | The name of the log level. | -- |
| handler | `String|Function` | Yes | The `console` method as a string to use to log this message or a function that returns a `console` method as a string. | -- |

**Returns:** _this_

**Example**
```js
// Add a new level called "fatal" and log messages with "console.error()":
log.addLevel('fatal', 'error');
log.fatal('There was a very bad error');

// With a function:
log.addLevel('trace', function (msg) {
  // Called with param "msg" which is the LogMessage instance for the particular log message.
  // This function is scoped to the LambdaLog instance.

  // If you add your own config option to `log.options`, you can check it here:
  if(!this.options.trace) return false;
  return 'log';
});

log.options.trace = true;
log.trace('This is a trace message');
```

#### <h type="event" text="log" />
The log event is emitted (using EventEmitter) for every log generated. This allows for custom integrations, such as logging to a thrid-party service. This event is emitted with the [LogMessage](#logmessage) instance for the log. You may control events using all the methods of EventEmitter.

**Example**
```js
log.on('log', message => {
  // an example would be sending the log message to another service
  someLogService(message.toJSON());
});
```

#### <h type="property" scope="static" text="LambdaLog.symbols" returns="Object">
Static object which contains [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) definitions used within the LambdaLog class. Available only for advanced usage.

**Since:** 3.0.0

| Property | Description |
| -------- | ----------- |
| LEVELS | The symbol used for the log levels configuration internally. For example: `log[LambdaLog.symbols.LEVELS]`. |

---

### <h type="class" text="LogMessage">
A new instance of this class is created for every log message. The instance of this class is returned from various log methods and passed into the `log` event. The purpose of this class is to transform and compile a log message into JSON to be outputted.

#### <h type="function" text="constructor(log, opts)">
Constructor for the LogMessage class. Called with an object `log` that contains the data for the log message and an object `opts` which is the LambdaLog options.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| log | `Object` | Yes | Data for the given log message. | -- |
| log.level | `String` | Yes | The log level for this message. | -- |
| log.msg | `Any` | Yes | The message of the log. | -- |
| log.meta | `Object` | No | Metadata to attach to this log message. | `{}` |
| log.tags | `String[]|Function[]` | No | Tags to attach to this log message. | `[]` |
| opts | `Object` | Yes | Options from the LambdaLog instance. | -- |

**Returns:** _this_

#### <h type="getter" text="message.level" returns="String">
Gets the level for this log message.

**Example**
```js
const message = log.info('This is an info log');
console.log(message.level);
// => "info"
```

#### <h type="getter" text="message.msg" returns="String">
Gets the transformed message for this log message.

**Alias:** `message.message`

**Example**
```js
const message = log.error(new Error('There was an error'));
console.log(message.msg);
// => "There was an error"
```

#### <h type="setter" text="message.msg = String">
Set the message for the log message, overwriting the existing message.

**Alias:** `message.message = String`

**Example**
```js
const message = log.info('Info message');
console.log(message.msg);
// => "Info message"

message.msg = 'New message';
console.log(message.msg);
// => "New message"
```

#### <h type="getter" text="message.meta" returns="Object">
Gets the combined metadata for this log message. This includes metadata passed into the log message, global metadata, and [dynamic metadata](/docs/dynamic-metadata). From version 3.0.0, any `Error` or `Error`-like objects found in the root of the metadata will be converted to a plain object.

**Example**
```js
log.options.meta = { prop: 'value' };
const message = log.info('This is an info log', { with: 'metadata', err: new Error('An error') });

console.log(message.meta);
// => { prop: 'value', with: 'metadata', err: { message: 'An error', stack: '...' } }
```

#### <h type="setter" text="message.meta = Object">
Adds or overwrites metadata for the log message while keeping the existing metadata.

**Example**
```js
log.options.meta = { prop: 'value' };
const message = log.info('This is an info log', { with: 'metadata' });

console.log(message.meta);
// => { prop: 'value', with: 'metadata' }

message.meta = { abc: 123, prop: 'newValue' };
console.log(message.meta);
// => { prop: 'newValue', with: 'metadata', abc: 123 }
```

#### <h type="getter" text="message.tags" returns="String[]">
Gets the tags for this log message. This includes tags passed into the log message and global tags. The tags are generated from strings or by using [enhanced tags](/docs/enhanced-tags).

**Example**
```js
log.options.tags = ['a-tag', '<<level>>'];
const message = log.info('This is an info log', {}, ['success']);

console.log(message.tags);
// => ['a-tag', 'info', 'success']
```

#### <h type="setter" text="message.tags = String[]|Function[]">
Adds additional tags to the log message while keeping existing tags. You may include [enhanced tags](/docs/enhanced-tags).

**Example**
```js
log.options.tags = ['a-tag'];
const message = log.info('This is an info log', {}, ['success']);

console.log(message.tags);
// => ['a-tag', 'success']

message.tags = ['<<level>>', 'more-tags'];
console.log(message.tags);
// => ['a-tag', 'success', 'info', 'more-tags']
```

#### <h type="getter" text="message.value" returns="Object">
Gets the compiled log object for this log message. From version 3.0.0, the key names of the properties in this object can be overridden using the options `levelKey`, `messageKey`, and `tagsKey` in [log.options](#logoptions). If `levelKey` or `tagsKey` is set to `null` or `undefined`, those properties will not be included in the output of the log message.

**Alias:** `message.log`

**Example**
```js
const message = log.info('This is an info log');
console.log(message.value);
// => { _logLevel: 'info', msg: 'This is an info log', _tags: [] }
```

#### <h type="getter" text="message.throw">
Throws the an error. If an error was not provided, one will be generated for you and thrown. This is useful in cases where you need to log an error, but also throw it.

**Example**
```js
log.error('This is an error').throw;

// Shorthand for:
let logMsg = log.error('This is an error');
let error = new Error(logMsg.msg);
error.log = logMsg;

throw error;
```

#### <h type="function" text="message.toJSON([format])" returns="String">
Returns the compiled log object converted into a JSON string. This method utilizes `log.options.replacer` for the replacer function. Uses [fast-safe-stringify](https://github.com/davidmarkclements/fast-safe-stringify) to prevent circular reference issues.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| format | `Boolean` | No | Pretty-print the JSON object with 4-space indentation. | `false` |

**Returns:** `String` — JSON string of [message.value](#messagevalue).

**Example**
```js
log.error('This is an error').toJSON(true);
//=> {
//      "_logLevel": "error",
//      "msg": "This is an error",
//      ...
//   }
```

#### <h type="function" scope="static" text="LogMessage.isError(val)" returns="Boolean">
Static function that checks if provided `val` is an `Error` or `Error`-like object.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| val | `Any` | Yes | Value to test if it's an `Error` or `Error`-like object. | -- |

**Returns:** Boolean — `true` if is an error, otherwise `false`.

#### <h type="function" scope="static" text="LogMessage.stubError(err)" returns="Error">
Static function that stubs an `Error` with a `toJSON` method for easily converting an `Error` into a plain object.

| Param | Type | Required? | Description | Default |
| ----- | ---- | --------- | ----------- | ------- |
| err | `Error` | Yes | The `Error` to stub with a `toJSON` method. | -- |

**Returns:** `Error`

#### <h type="property" scope="static" text="LogMessage.symbols" returns="Object">
Static object which contains [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) definitions used within the LogMessage class. Available only for advanced usage.

**Since:** 3.0.0

| Property | Description |
| -------- | ----------- |
| LOG | The symbol used for the log data internally. For example: `message[LogMessage.symbols.LOG]`. |
| META | The symbol used for the log metadata internally. For example: `message[LogMessage.symbols.META]`. |
| ERROR | The symbol used for the original passed `Error`, if applicable, internally. For example: `message[LogMessage.symbols.ERROR]`. |
| OPTS | The symbol used for the LambdaLog options internally. For example: `message[LogMessage.symbols.OPTS]`. |

"use strict";
const EventEmitter = require('events');
const LogMessage = require('./LogMessage');

/**
 * @external EventEmitter
 * @see https://nodejs.org/api/events.html#events_class_eventemitter
 */

/**
 * @extends {external:EventEmitter}
 * @typicalname log
 */
class LambdaLog extends EventEmitter {
    /**
     * Constructor for the LambdaLog class. Provided to be utilized in more advanced cases to allow overriding and configuration. By default, this module will export an instance of this class, but you may access the class and create your own instance via `log.LambdaLog`.
     * @constructor
     * @param {Object} [options={}] Options object. See [<code>log.options</code>](#logoptions) for available options.
     * @param {Object} [levels={}]  Allows adding and customizing log levels. See [Custom Log Levels](#custom-log-levels).
     */
    constructor(options = {}, levels = {}) {
        super();
        /**
         * Access to the uninstantiated LambdaLog class. This allows more advanced functionality and customization.
         * @type {LambdaLog}
         * @example 
         * const LambdaLog = require('lambda-log').LambdaLog;
         * const log = new LambdaLog();
         */
        this.LambdaLog = LambdaLog;
        
        /**
         * Access to the uninstantiated LogMessage class. You can override this property to use a custom logging class that inherits the same methods.
         * @type {LogMessage}
         * @since 2.2.0
         * @example 
         * const log = require('lambda-log');
         * const MyCustomLogMessageClass = require('./myCustomLogMessageClass.js');
         * 
         * log.LogMessage = MyCustomLogMessageClass;
         */
        this.LogMessage = LogMessage;
        
        /**
         * Configuration object for LambdaLog. Most options can be changed at any time via `log.options.OPTION = VALUE;` unless otherwise noted.
         * @property {Object} [meta={}] Global metadata to be included in all logs.
         * @property {String[]} [tags=[]] Global tags to be included in all logs.
         * @property {Function} [dynamicMeta=null] Function that runs for each log that returns additional metadata. See [Dynamic Metadata](#dynamic-metadata).
         * @property {Boolean} [debug=false] Enables `log.debug()`.
         * @property {Boolean} [dev=false] Enable development mode which pretty-prints JSON to the console.
         * @property {Boolean} [silent=false] Disables logging to `console` but messages and events are still generated.
         * @property {Function} [replacer=null] Replacer function for `JSON.stringify()` to allow handling of sensitive data before logs are written. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter).
         * @property {Object} [logHandler=console] A console-like object containing all standard console functions. Allows logs to be written to any custom location. See [Log Handler](#loghandler).
         */
        this.options = Object.assign({
            meta: {},
            tags: [],
            dynamicMeta: null,
            debug: false,
            dev: false,
            silent: ![undefined, null, '0', 'no', 'false'].includes(process.env.LAMBDALOG_SILENT),
            replacer: null,
            logHandler: console
        }, options);
        
        /**
         * Global configuration for log levels
         * @type {Object}
         * @private
         */
        this._logLevels = Object.assign({
            info: 'info',
            warn: 'warn',
            error: 'error',
            debug: function() {
                if(this.options.debug) return 'debug';
                return false;
            }
        }, levels || {});
        
        this._levels = Object.keys(this._logLevels);
        
        /**
         * Console-like log handler to use for logging messages
         * @type {Object}
         * @private 
         */
        this.console = this.options.logHandler;

        this._levels.forEach((lvl) => {
            /**
             * Shortcut methods for `log.log()`. By default, the following methods are available: `log.info()`, `log.warn()`, `log.error()` and `log.debug()`. 
             * Additional methods will be added for any [custom log levels](#custom-log-levels) provided.<br><br>The provided msg can be any type, although a string 
             * or `Error` is recommended. If `Error` is provided the stack trace is added as metadata to the log as `stack`.
             * @alias LambdaLog#&lt;info|warn|error|debug|*&gt;
             * @param {*}      msg  Message to log. Can be any type, but string or `Error` reccommended.
             * @param {Object} [meta={}] Optional meta data to attach to the log.
             * @param {Array}  [tags=[]] Additional tags to append to this log.
             * @return {LogMessage}  The LogMessage instance for the log.
             * 
             * @example
             * const log = require('lambda-log');
             * 
             * log.info('Test info log');
             * log.debug('Test debug log');
             * log.warn('Test warn log');
             * log.error('Test error log');
             */
            this[lvl] = (msg, meta = {}, tags = []) => {
                return this.log(lvl, msg, meta, tags);
            };
        });
    }

    /**
     * Generates JSON log message based on the provided parameters and the global configuration. Once the JSON message is created, it is properly logged to the `console` 
     * and emitted through an event. If an `Error` or `Error`-like object is provided for `msg`, it will parse out the message and include the stacktrace in the metadata.
     * @throws {Error} If improper log level is provided.
     * @param  {String} level Log level (`info`, `debug`, `warn`, `error` or a [custom log level](#custom-log-levels))
     * @param  {*}      msg   Message to log. Can be any type, but string or `Error` reccommended.
     * @param  {Object} [meta={}]  Optional meta data to attach to the log.
     * @param  {Array}  [tags=[]]  Additional tags to append to this log.
     * @return {LogMessage|Boolean}  Returns instance of LogMessage or `false` if `level = "debug"` and `options.debug = false`. May also return `false` when a [custom log level](#custom-log-levels) handler function prevents the log from being logged.
     * 
     * @example 
     * log.log('error', 'Something failed!');
     * // same as:
     * log.error('Something failed!');
     */
    log(level, msg, meta = {}, tags = []) {
        if(this._levels.indexOf(level) === -1) {
            throw new Error(`"${level}" is not a valid log level`);
        }
        
        let message = new this.LogMessage({
            level,
            msg,
            meta,
            tags
        }, this.options);
        
        let method = this._logLevels[level];
        
        if(typeof method === 'function') {
            method = method.call(this, message);
        }
        
        if(!method) return false;
        
        if(!this.options.silent) {
            this.console[method](message.toJSON(this.options.dev));
        }

        /**
         * The log event is emitted (using EventEmitter) for every log generated. This allows for custom integrations, such as logging to a thrid-party service. 
         * This event is emitted with the [LogMessage](#logmessage) instance for the log. You may control events using all the methods of EventEmitter.
         * @event LambdaLog#log
         * @type {LogMessage}
         * 
         * @example 
         * log.on('log', message => {
         *     // an example would be sending the log message to another service
         *     someLogService(message.toJSON());
         * });
         */
        this.emit('log', message);
        return message;
    }

    /**
     * Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to 
     * wrap them in an if statement. The log level will be `error`.
     * @since  1.4.0
     * @param  {*}              test      A value which is tested for a falsy value.
     * @param  {*}              msg       Message to log if `test` is falsy. Can be any type, but string or `Error` reccommended.
     * @param  {Object}         [meta={}] Optional meta data to attach to the log.
     * @param  {Array}          [tags=[]] Additional tags to append to this log.
     * @return {LogMessage|Boolean}       The LogMessage instance for the log or `false` if test passed.
     * 
     * @example 
     * let results = null;
     * // This log will be displayed since `results` is a falsy value.
     * log.assert(results, 'No results provided!');
     * //=> { msg: "No results provided!" ... }
     * 
     * // But if they are truthy, the log is ignored:
     * results = [1, 2, 3];
     * log.assert(results, 'No results provided!');
     * //=> false
     */
    assert(test, msg, meta = {}, tags = []) {
        if(test) return false;
        return this.log('error', msg, meta, tags);
    }
    
    /**
     * Generates a log message with the result or error provided by a promise. Useful for debugging and testing.
     * @since 2.3.0
     * @param {Promise} promise A promise or promise-like object to retrieve a value from.
     * @param  {Object} [meta={}] Optional meta data to attach to the log.
     * @param  {Array}  [tags=[]] Additional tags to append to this log.
     * @return {Promise<LogMessage>} A new Promise that resolves with the LogMessage object after the promise completes.
     * 
     * @example 
     * let promise = new Promise(resolve => resolve('this is a test'));
     * 
     * log.result(promise);
     * // => { "msg": "this is a test" ... }
     */
    result(promise, meta = {}, tags = []) {
        if(!promise || typeof promise.then !== 'function') {
            throw new Error('A promise must be provided as the first argument');
        }
        
        let wrapper = new Promise((resolve) => {
            promise
                .then(value => resolve(this.log('info', value, meta, tags)))
                .catch(err => resolve(this.log('error', err, meta, tags)));
        });
        
        return wrapper;
    }
}

module.exports = LambdaLog;

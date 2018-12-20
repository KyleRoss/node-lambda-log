"use strict";
const { Console } = require('console');
const EventEmitter = require('events');

const LogMessage = require('./LogMessage');

/**
 * @class LambdaLog
 * @extends {EventEmitter}
 */
class LambdaLog extends EventEmitter {
    /**
     * Creates new instance of LambdaLog
     * @constructor
     * @param  {Object} options Optional options object to override
     * @param  {Object} levels  Optional log level configuration object
     * @return {this}           Instance of LambdaLog
     */
    constructor(options = {}, levels = {}) {
        super();
        /**
         * Access to the uninstantiated LambdaLog class
         * @type {LambdaLog}
         */
        this.LambdaLog = LambdaLog;
        
        /**
         * Global configuration options for the class
         * @type {Object}
         */
        this.options = Object.assign({
            // Global static metadata object to include with every log
            meta: {},
            // Global tags array to include with every log
            tags: [],
            // Optional function which will run for every log to inject dynamic metadata
            dynamicMeta: null,
            // Enable debugging mode (log.debug messages)
            debug: false,
            // Enable development mode which pretty-prints the log object to the console
            dev: false,
            // Disables logging to the console (used for testing)
            silent: false,
            // Optional replacer function for `JSON.stringify`
            replacer: null,
        }, options);
        
        /**
         * Global configuration for log levels
         * @type {Object}
         */
        this._logLevels = Object.assign({
            info: 'info',
            warn: 'warn',
            error: 'error',
            debug: function() {
                if(this.options.debug) return 'log';
                return false;
            }
        }, levels || {});
        
        this._levels = Object.keys(this._logLevels);
        
        /**
         * Instance of `Console` used for logging
         * @type {Object}
         */
        this.console = new Console(this.options.stdoutStream, this.options.stderrStream);

        this._levels.forEach((lvl) => {
            /**
             * Shorthand log methods for `info`, `debug`, `warn` and `error`
             * @param  {Any}    msg  Message to log. Can be any type, but string or `Error` reccommended.
             * @param  {Object} meta Optional meta data to attach to the log.
             * @param  {Array}  tags Additional tags to append to this log.
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
     * Creates log message based on the provided parameters
     * @param  {String} level Log level (`info`, `debug`, `warn` or `error`)
     * @param  {Any}    msg   Message to log. Can be any type, but string or `Error` reccommended.
     * @param  {Object} meta  Optional meta data to attach to the log.
     * @param  {Array}  tags  Additional tags to append to this log.
     * @return {LogMessage}   The LogMessage instance for the log.
     */
    log(level, msg, meta = {}, tags = []) {
        if(this._levels.indexOf(level) === -1) {
            throw new Error(`"${level}" is not a valid log level`);
        }
        
        let message = new LogMessage({
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
         * Emits log event after logging to console with the log data
         * @event log
         * @attribute {LogMessage} message
         */
        this.emit('log', message);
        return message;
    }

    /**
     * Creates an error log message if provided `test` is a falsy value.
     * @since  1.4.0
     * @param  {Any}            test      A value which is tested for a falsy value.
     * @param  {Any}            msg       Message to log if `test` is falsy. Can be any type, but string or `Error` reccommended.
     * @param  {Object}         [meta={}] Optional meta data to attach to the log.
     * @param  {Array}          [tags=[]] Additional tags to append to this log.
     * @return {LogMessage|Boolean}       The LogMessage instance for the log or `false` if test passed.
     */
    assert(test, msg, meta = {}, tags = []) {
        if (test) return false;
        return this.log('error', msg, meta, tags);
    }
}

/**
 * Exports LambdaLog Class
 * @type {LambdaLog}
 */
module.exports = LambdaLog;

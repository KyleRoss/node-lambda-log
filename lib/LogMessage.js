"use strict";
const stringify = require('fast-safe-stringify');

/**
 * The LogMessage class is a private/internal class that is used for generating log messages. All log methods return an instance of LogMessage allowing for a chainable api. 
 * Having a seperate class and instance for each log allows chaining and the ability to further customize this module in the future without major breaking changes. The documentation 
 * provided here is what is available to you for each log message.
 */
class LogMessage {
    /**
     * Constructor for LogMessage
     * @param {Object} log  Object containing all the information for a log.
     * @param {String} log.level The log level.
     * @param {*} log.msg The message for the log.
     * @param {Object} [log.meta] Metadata attached to the log.
     * @param {String[]} [log.tags] Additional tags to attach to the log.
     * @param {Object} opts Configuration options from LambdaLog.
     */
    constructor({ level, msg, meta, tags }, opts) {
        /**
         * String log level of the message.
         * @type {String}
         * @example 
         * log.error('This is an error').level;
         * //=> "error"
         */
        this.level = level;
        /**
         * The fully compiled metadata object for the log. Includes global and dynamic metadata.
         * @type {Object}
         * @example 
         * log.info('This is some info', { hello: 'world' }).meta;
         * //=> { hello: 'world', ... }
         */
        this.meta = meta;
        /**
         * Array of tags attached to this log. Includes global tags.
         * @type {String[]}
         * @example 
         * log.info('This is some info', {}, ['custom-tag']).tags;
         * //=> ["custom-tag", ...]
         */
        this.tags = ['log', level].concat(opts.tags, tags);
        
        let errorMeta = {};
        
        // If `msg` is an Error-like object, use the message and add the `stack` to `meta`
        if(LogMessage.isError(msg)) {
            this._error = msg;
            errorMeta.stack = msg.stack;
            msg = msg.message;
        }
        
        /**
         * The message for the log. If an Error was provided, it will be the message of the error.
         * @type {String}
         * @example 
         * log.error('This is an error').msg;
         * //=> "This is an error"
         */
        this.msg = msg;
        
        if(meta && (typeof meta !== 'object' || Array.isArray(meta))) {
            meta = { meta };
        }
        
        this.meta = Object.assign({}, meta || {}, opts.meta, errorMeta);
        
        if(opts.dynamicMeta && typeof opts.dynamicMeta === 'function') {
            let dynMeta = opts.dynamicMeta(this, opts);
            
            if(typeof dynMeta === 'object') {
                this.meta = Object.assign(this.meta, dynMeta);
            }
        }
        
        this._replacer = typeof opts.replacer === 'function'? opts.replacer : null;
    }
    
    /**
     * The full log object. This is the object used in logMessage.toJSON() and when the log is written to the console. 
     * See [Log Output](#log-output) for more information.
     * @returns {Object} The full log object.
     * @example 
     * log.info('This is some info').value;
     * //=> { _logLevel: 'info', msg: 'This is some info', ... }
     */
    get value() {
        return Object.assign({ _logLevel: this.level, msg: this.msg }, this.meta, { _tags: this.tags });
    }
    
    /**
     * Alias of `logMessage.value`.
     * @returns {Object} The full log object.
     */
    get log() {
        return this.value;
    }
    
    /**
     * Throws the log. If an error was not provided, one will be generated for you and thrown. This is useful in cases where you need to log an 
     * error, but also throw it.
     * @throws {Error} The provided error, or a newly generated error.
     * @example 
     * log.error('This is an error').throw;
     * 
     * //Shorthand for:
     * let logMsg = log.error('This is an error');
     * let error = new Error(logMsg.msg);
     * error.log = logMsg;
     * 
     * throw error;
     */
    get throw() {
        let err = this._error || new Error(this.msg);
        err.log = this;
        
        throw err;
    }
    
    /**
     * Returns the compiled log object converted into JSON. This method utilizes `options.replacer` for the replacer function. It also uses 
     * [json-stringify-safe](https://www.npmjs.com/package/json-stringify-safe) to prevent circular reference issues.
     * @param {Boolean} [format=false] Enable pretty-printing of the JSON object (4 space indentation).
     * @returns {String}  Log object stringified as JSON.
     * @example 
     * log.error('This is an error').toJSON(true);
     * //=> {
     * //      "_logLevel": "error",
     * //      "msg": "This is an error",
     * //      ...
     * //   }
     */
    toJSON(format) {
        return stringify(this.value, this._replacer, format? 4 : 0);
    }
    
    /**
     * Checks if value is an Error or Error-like object
     * @private
     * @param  {*}       val Value to test
     * @return {Boolean}     Whether the value is an Error or Error-like object
     */
    static isError(val) {
        return !!val && typeof val === 'object' && (
            val instanceof Error || (
                val.hasOwnProperty('message') && val.hasOwnProperty('stack')
            )
        );
    }
}

module.exports = LogMessage;

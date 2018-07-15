"use strict";

/**
 * @class LogMessage
 */
class LogMessage {
    /**
     * Constructor for LogMessage
     * @param {Object} log  Object containing all the information for a log
     * @param {Object} opts Configuration options from LambdaLog
     */
    constructor({ level, msg, meta, tags }, opts) {
        this.level = level;
        this.meta = meta;
        
        this.tags = ['log', level].concat(opts.tags, tags);
        
        let errorMeta = {};
        
        // If `msg` is an Error-like object, use the message and add the `stack` to `meta`
        if (LogMessage.isError(msg)) {
            this._error = msg;
            errorMeta.stack = msg.stack;
            msg = msg.message;
        }
        
        this.msg = msg;
        
        if(meta && (typeof meta !== 'object' || Array.isArray(meta))) {
            meta = { meta };
        }
        
        this.meta = Object.assign({}, meta || {}, opts.meta, errorMeta);
        
        if (opts.dynamicMeta && typeof opts.dynamicMeta === 'function') {
            let dynMeta = opts.dynamicMeta(this, opts);
            
            if(typeof dynMeta === 'object') {
                this.meta = Object.assign(this.meta, dynMeta);
            }
        }
        
        this._replacer = typeof opts.replacer === 'function'? opts.replacer : null;
    }
    
    /**
     * Getter: Generates the log object.
     * @returns {Object} The generated log object
     */
    get value() {
        return Object.assign({ _logLevel: this.level, msg: this.msg }, this.meta, { _tags: this.tags });
    }
    
    /**
     * Getter: Shorthand for calling `value`.
     * @returns {Object} The generated log object
     */
    get log() {
        return this.value;
    }
    
    /**
     * Adds ability to `throw` the log message as an error.
     */
    get throw() {
        let err = this._error || new Error(this.msg);
        err.log = this;
        
        throw err;
    }
    
    /**
     * Converts the log object to JSON.
     * @param {Boolean} format Whether to format the log (pretty print). Default is `false`.
     * @returns {String} The generated JSON.
     */
    toJSON(format) {
        return JSON.stringify(this.value, this._replacer, format? 4 : 0);
    }
    
    /**
     * Checks if value is an Error or Error-like object
     * @static
     * @param  {Any}     val Value to test
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

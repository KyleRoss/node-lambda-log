/**
 * @module lambda-log
 * @version 1.0.0
 * @description Basic logging mechanism for Lambda Functions
 * @requires Node 6.10+
 * @author Kyle Ross
 */
"use strict";
const EventEmitter = require('events');

/**
 * @class LambdaLog
 * @extends {EventEmitter}
 */
class LambdaLog extends EventEmitter {
    /**
     * Creates new instance of LambdaLog
     * @constructor
     * @param  {Object} meta Global meta object to include with every log
     * @param  {Array}  tags Global tags to include with every log
     * @return {this}        Instance of LambdaLog
     */
    constructor(meta={}, tags=[]) {
        super();
        /**
         * Access to the uninstantiated LambdaLog class
         * @type {LambdaLog}
         */
        this.LambdaLog = LambdaLog;
        /**
         * Global configuration for the class
         * @type {Object}
         */
        this.config = {
            // Global meta object to include with every log
            meta,
            // Global tags array to include with every log
            tags,
            // Enable development mode which pretty-prints the log object to the console
            dev: false,
            // Disables logging to the console (used for testing)
            silent: false
        };
        
        ['info', 'warn', 'error'].forEach((lvl) => {
            /**
             * Shorthand log methods for `info`, `warn` and `error`
             * @param  {Any}    msg  Message to log. Can be any type, but string or `Error` reccommended.
             * @param  {Object} meta Optional meta data to attach to the log.
             * @return {Object}      The compiled log object that was logged to the console.
             * 
             * @example
             * const log = require('lambda-log');
             * 
             * log.info('Test info log');
             * log.warn('Test warn log');
             * log.error('Test error log');
             */
            this[lvl] = (msg, meta={}) => {
                return this.log(lvl, msg, meta);
            };
        });
    }
    
    /**
     * Creates log message based on the provided parameters
     * @param  {String} level Log level (`info`, `warn` or `error`)
     * @param  {Any}    msg   Message to log. Can be any type, but string or `Error` reccommended.
     * @param  {Object} meta  Optional meta data to attach to the log.
     * @return {Object}       The compiled log object that was logged to the console.
     */
    log(level, msg, meta={}) {
        if(['info', 'warn', 'error'].indexOf(level) === -1) {
            throw new Error(`"${level}" is not a valid log level`);
        }
        
        let tags = ['log', level].concat(this.config.tags),
            errorMeta = {};
        
        // If `msg` is an Error-like object, use the message and add the `stack` to `meta`
        if(LambdaLog.isError(msg)) {
            errorMeta.stack = msg.stack;
            msg = msg.message;
        }
        
        let data = Object.assign({ msg }, meta || {}, this.config.meta, errorMeta, { _tags: tags });
        
        if(!this.config.silent) {
            console[level](JSON.stringify(data, null, this.config.dev? 4 : 0));
        }
        
        /**
         * Emits log event after logging to console with the log data
         * @event log
         * @attribute data
         */
        this.emit('log', data);
        return data;
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

/**
 * Exports new instance of LambdaLog
 * @type {LambdaLog}
 */
module.exports = new LambdaLog();

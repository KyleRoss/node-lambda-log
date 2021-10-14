const EventEmitter = require('events');
const LogMessage = require('./LogMessage');

const symbols = {
  LEVELS: Symbol('levels')
};

/**
 * @typedef {object} LambdaLogOptions - Configuration object for LambdaLog.
 * @property {object} [meta={}] Global metadata to be included in all logs.
 * @property {string[]|Function[]} [tags=[]] Global tags to be included in all logs.
 * @property {Function} [dynamicMeta=null] Function that runs for each log that returns additional metadata. See [Dynamic Metadata](#dynamic-metadata).
 * @property {boolean} [debug=false] Enables `log.debug()`.
 * @property {boolean} [dev=false] Enable development mode which pretty-prints JSON to the console.
 * @property {boolean} [silent=false] Disables logging to `console` but messages and events are still generated.
 * @property {Function} [replacer=null] Replacer function for `JSON.stringify()` to allow handling of sensitive data before logs are written. See [JSON.stringify](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter).
 * @property {object} [logHandler=console] A console-like object containing all standard console functions. Allows logs to be written to any custom location. See [Log Handler](#loghandler).
 * @property {?string} [levelKey=_logLevel] Override the key name for the log level. Set to `null` to remove the key from the output.
 * @property {string} [messageKey=msg] Override the key name for the message.
 * @property {?string} [tagsKey=_tags] Override the key name for the tags. Set to `null` to remove the key from the output.
 */

/**
 * @augments EventEmitter
 */
class LambdaLog extends EventEmitter {
  /**
   * Constructor for the LambdaLog class. Provided to be utilized in more advanced cases to allow overriding and configuration.
   * By default, this module will export an instance of this class, but you may access the class and create your own instance
   * via `log.LambdaLog`.
   * @class
   * @param {LambdaLogOptions}                 [options={}] Options for configuring LambdaLog.
   * @param {object.<string, string|Function>} [levels={}]  Allows adding and customizing log levels. DEPRECATED
   */
  constructor(options = {}, levels = {}) {
    super();
    /**
     * Access to the uninstantiated LambdaLog class. This allows more advanced functionality and customization.
     * @type {LambdaLog}
     */
    this.LambdaLog = LambdaLog;

    /**
     * Access to the uninstantiated LogMessage class. You can override this property to use a custom logging class that
     * inherits the same methods.
     * @type {LogMessage}
     * @since 2.2.0
     */
    this.LogMessage = LogMessage;

    /**
     * @type {LambdaLogOptions}
     */
    this.options = {
      meta: {},
      tags: [],
      dynamicMeta: null,
      debug: false,
      dev: false,
      silent: ['true', 'yes', 'y', '1'].includes(process.env.LAMBDALOG_SILENT),
      replacer: null,
      logHandler: console,
      levelKey: '_logLevel',
      messageKey: 'msg',
      tagsKey: '_tags',
      ...options
    };

    /**
     * Global configuration for log levels
     * @type {object}
     */
    this[symbols.LEVELS] = {
      info: 'info',
      warn: 'warn',
      error: 'error',
      debug() {
        if(this.options.debug) return 'debug';
        return false;
      },
      ...levels
    };

    /**
     * Console-like log handler to use for logging messages
     * @type {object}
     */
    this.console = this.options.logHandler;

    const levelsConfig = this[symbols.LEVELS];
    for(const lvl in levelsConfig) {
      if(Object.prototype.hasOwnProperty.call(levelsConfig, lvl)) {
        this.addLevel(lvl, levelsConfig[lvl]);
      }
    }
  }

  /**
   * Add a new log level to this instance of LambdaLog.
   * @since 3.0.0
   * @deprecated
   * @param {string}          name    The name of the new log level.
   * @param {string|Function} handler The string name of the `console` method to call or a function that returns a string method name.
   * @returns {this}          Instance of LambdaLog.
   */
  addLevel(name, handler) {
    this[symbols.LEVELS][name] = handler;

    /**
     * Shortcut methods for `log.log()`. By default, the following methods are available: `log.info()`, `log.warn()`, `log.error()` and `log.debug()`.
     * Additional methods will be added for any [custom log levels](#custom-log-levels) provided.<br><br>The provided msg can be any type, although a string
     * or `Error` is recommended. If `Error` is provided the stack trace is added as metadata to the log as `stack`.
     * @param {*}             msg       Message to log. Can be any type, but string or `Error` reccommended.
     * @param {object}        [meta={}] Optional meta data to attach to the log.
     * @param {string[]}      [tags=[]] Additional tags to append to this log.
     * @returns {LogMessage}  The LogMessage instance for the log.
     */
    this[name] = (msg, meta = {}, tags = []) => this.log(name, msg, meta, tags);

    return this;
  }

  /**
   * Generates JSON log message based on the provided parameters and the global configuration. Once the JSON message is created, it is properly logged to the `console`
   * and emitted through an event. If an `Error` or `Error`-like object is provided for `msg`, it will parse out the message and include the stacktrace in the metadata.
   * @throws {Error} If improper log level is provided.
   * @param  {string} level Log level (`info`, `debug`, `warn`, `error` or a [custom log level](#custom-log-levels))
   * @param  {*}      msg   Message to log. Can be any type, but string or `Error` reccommended.
   * @param  {object} [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]}  [tags=[]]  Additional tags to append to this log.
   * @returns {LogMessage|boolean}  Returns instance of LogMessage or `false` if `level = "debug"` and `options.debug = false`. May also return `false` when a [custom log level](#custom-log-levels) handler function prevents the log from being logged.
   */
  log(level, msg, meta = {}, tags = []) {
    if(!Object.prototype.hasOwnProperty.call(this[symbols.LEVELS], level)) {
      throw new Error(`"${level}" is not a valid log level`);
    }

    const message = new this.LogMessage({
      level,
      msg,
      meta,
      tags
    }, this.options);

    let method = this[symbols.LEVELS][level];

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
     */
    this.emit('log', message);
    return message;
  }

  /**
   * Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to
   * wrap them in an if statement. The log level will be `error`.
   * @since  1.4.0
   * @param  {*}                    test      A value which is tested for a falsy value.
   * @param  {*}                    msg       Message to log if `test` is falsy. Can be any type, but string or `Error` reccommended.
   * @param  {object}               [meta={}] Optional meta data to attach to the log.
   * @param  {string[]|Function[]}  [tags=[]] Additional tags to append to this log.
   * @returns {LogMessage|boolean}  The LogMessage instance for the log or `false` if test passed.
   */
  assert(test, msg, meta = {}, tags = []) {
    if(test) return false;
    return this.log('error', msg, meta, tags);
  }

  /**
   * Generates a log message with the result or error provided by a promise. Useful for debugging and testing.
   * @since 2.3.0
   * @param  {Promise}              promise   A promise or promise-like object to retrieve a value from.
   * @param  {object}               [meta={}] Optional meta data to attach to the log.
   * @param  {string[]|Function[]}  [tags=[]] Additional tags to append to this log.
   * @returns {Promise<LogMessage>} A new Promise that resolves with the LogMessage object after the promise completes.
   */
  result(promise, meta = {}, tags = []) {
    if(!promise || typeof promise.then !== 'function') {
      throw new Error('A promise must be provided as the first argument');
    }

    const wrapper = new Promise(resolve => {
      promise
        .then(value => resolve(this.log('info', value, meta, tags)))
        .catch(err => resolve(this.log('error', err, meta, tags)));
    });

    return wrapper;
  }
}

LambdaLog.symbols = symbols;

module.exports = LambdaLog;

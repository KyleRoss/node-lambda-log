const stringify = require('fast-safe-stringify');

const symbols = {
  LOG: Symbol('log'),
  META: Symbol('meta'),
  ERROR: Symbol('error'),
  OPTS: Symbol('opts')
};

/**
 * The LogMessage class is a private/internal class that is used for generating log messages. All log methods return an instance of LogMessage allowing for a chainable api.
 * Having a seperate class and instance for each log allows chaining and the ability to further customize this module in the future without major breaking changes. The documentation
 * provided here is what is available to you for each log message.
 */
class LogMessage {
  /**
   * Constructor for LogMessage
   * @class
   * @param {object}              log        Object containing all the information for a log.
   * @param {string}              log.level  The log level.
   * @param {*}                   log.msg    The message for the log.
   * @param {object}              [log.meta] Metadata attached to the log.
   * @param {string[]|Function[]} [log.tags] Additional tags to attach to the log.
   * @param {object}              opts       Configuration options from LambdaLog.
   */
  constructor(log, opts) {
    this[symbols.LOG] = log;
    this[symbols.META] = {};
    this[symbols.ERROR] = null;
    this[symbols.OPTS] = opts;

    const { meta, tags } = this[symbols.LOG];
    if(meta && (typeof meta !== 'object' || Array.isArray(meta))) {
      this[symbols.LOG].meta = { meta };
    }

    if(!meta) this[symbols.LOG].meta = {};
    if(!tags) this[symbols.LOG].tags = [];

    // If `msg` is an Error-like object, use the message and add the `stack` to `meta`
    if(LogMessage.isError(log.msg)) {
      const err = log.msg;
      this[symbols.ERROR] = err;
      this[symbols.META].stack = err.stack;
      this[symbols.LOG].msg = err.message;
    }
  }

  /**
   * String log level of the message.
   * @type {string}
   */
  get level() {
    return this[symbols.LOG].level;
  }

  /**
   * The message for the log. If an Error was provided, it will be the message of the error.
   * @type {string}
   */
  get msg() {
    return this[symbols.LOG].msg;
  }

  /**
   * Update the message for this log to something else.
   * @param {string} msg A string to update the message with.
   */
  set msg(msg) {
    this[symbols.LOG].msg = msg;
  }

  /**
   * Alias for `this.msg`.
   * @type {string}
   */
  get message() {
    return this.msg;
  }

  /**
   * Alias for `this.msg = 'New message';`
   * @param {string} msg A string to update the message with.
   */
  set message(msg) {
    this.msg = msg;
  }

  /**
   * The fully compiled metadata object for the log. Includes global and dynamic metadata.
   * @type {object}
   */
  get meta() {
    const opts = this[symbols.OPTS];

    let meta = {
      ...this[symbols.META],
      ...this[symbols.OPTS].meta,
      ...this[symbols.LOG].meta
    };

    if(opts.dynamicMeta && typeof opts.dynamicMeta === 'function') {
      const dynMeta = opts.dynamicMeta.call(this, this, opts);

      if(typeof dynMeta === 'object') {
        meta = Object.assign(meta, dynMeta);
      }
    }

    for(const [key, val] of Object.entries(meta)) {
      if(typeof val !== 'object') continue;
      if(LogMessage.isError(val)) {
        meta[key] = LogMessage.stubError(val);
      }
    }

    return meta;
  }

  /**
   * Set additional metadata on the log message.
   * @param {object} obj An object with properties to append or overwrite in the metadata.
   */
  set meta(obj) {
    this[symbols.LOG].meta = {
      ...this[symbols.LOG].meta,
      ...obj
    };
  }

  /**
   * Array of tags attached to this log. Includes global tags.
   * @type {string[]}
   */
  get tags() {
    const opts = this[symbols.OPTS];
    const tags = [].concat(opts.tags, this[symbols.LOG].tags);

    return tags.map(tag => {
      if(typeof tag === 'function') {
        return tag.call(this, {
          level: this.level,
          meta: this.meta,
          options: opts
        });
      }

      const hasVar = tag.match(/(<<(.*)>>)/);
      if(!hasVar) return tag;

      const varName = hasVar[2];
      if(varName === 'level') return tag.replace(hasVar[1], this.level);

      return tag;
    }).filter(tag => tag !== null && tag !== undefined && tag !== '');
  }

  /**
   * Appends additional tags to this log message.
   * @param {string[]|Function[]} tags Array of string tags or enhanced tag functions to append to the tags array.
   */
  set tags(tags) {
    this[symbols.LOG].tags = this[symbols.LOG].tags.concat(tags);
  }

  /**
   * The full log object. This is the object used in logMessage.toJSON() and when the log is written to the console.
   * @returns {object} The full log object.
   */
  get value() {
    const opts = this[symbols.OPTS];
    return {
      [opts.levelKey]: opts.levelKey ? this.level : undefined,
      [opts.messageKey]: this.msg,
      ...this.meta,
      [opts.tagsKey]: opts.tagsKey ? this.tags : undefined
    };
  }

  /**
   * Alias of `logMessage.value`.
   * @returns {object} The full log object.
   */
  get log() {
    return this.value;
  }

  /**
   * Throws the log. If an error was not provided, one will be generated for you and thrown. This is useful in cases where you need to log an
   * error, but also throw it.
   * @throws {Error} The provided error, or a newly generated error.
   */
  get throw() {
    const err = this[symbols.ERROR] || new Error(this.msg);
    err.log = this;

    throw err;
  }

  /**
   * Returns the compiled log object converted into JSON. This method utilizes `options.replacer` for the replacer function. It also uses
   * [fast-safe-stringify](https://www.npmjs.com/package/fast-safe-stringify) to prevent circular reference issues.
   * @param {boolean} [format=false] Enable pretty-printing of the JSON object (4 space indentation).
   * @returns {string}  Log object stringified as JSON.
   */
  toJSON(format) {
    return stringify(this.value, this[symbols.OPTS].replacer || null, format ? 4 : 0);
  }

  /**
   * Checks if value is an Error or Error-like object
   * @static
   * @param  {*}         val Value to test
   * @returns {boolean}  Whether the value is an Error or Error-like object
   */
  static isError(val) {
    return Boolean(val) && typeof val === 'object' && (
      val instanceof Error || (
        Object.prototype.hasOwnProperty.call(val, 'message') &&
        Object.prototype.hasOwnProperty.call(val, 'stack')
      )
    );
  }

  /**
   * Stubs an Error or Error-like object to include a toJSON method.
   * @static
   * @param {Error}    err An Error or Error-like object.
   * @returns {Error}  The original error stubbed with a toJSON() method.
   */
  static stubError(err) {
    if(typeof err.toJSON === 'function') return err;

    err.toJSON = function () {
      const keys = [
        'name',
        'message',
        'stack'
      ].concat(Object.keys(err));

      return keys.reduce((obj, key) => {
        if(key in err) {
          const val = err[key];

          if(typeof val === 'function') return obj;
          obj[key] = val;
        }

        return obj;
      }, {});
    };

    return err;
  }
}

LogMessage.symbols = symbols;

module.exports = LogMessage;

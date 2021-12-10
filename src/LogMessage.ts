import stringify from 'fast-safe-stringify';
import { LambdaLogOptions, Message, LogObject, Tag, GenericRecord, Formatter, StubbedError, Empty } from './typings.js';
import { isError, stubError } from './utils.js';
import jsonFormatter from './formatters/json.js';

export interface ILogMessage {
  readonly __opts: LambdaLogOptions;
  __level: string;
  __msg: string;
  __meta: GenericRecord;
  __tags: Tag[];
  __error: Error | StubbedError | Empty;

  get level(): string;
  get msg(): string;
  set msg(msg: Message);
  get message(): string;
  set message(msg: Message);
  get meta(): GenericRecord;
  set meta(obj: GenericRecord);
  get tags(): Tag[];
  set tags(tags: Tag[]);
  get value(): GenericRecord;
  get log(): GenericRecord;
  get throw(): void;

  toJSON(format: boolean): string;
}

/**
 * The LogMessage class is a private/internal class that is used for generating log messages. All log methods return an instance of LogMessage allowing for a chainable api.
 * Having a seperate class and instance for each log allows chaining and the ability to further customize this module in the future without major breaking changes. The documentation
 * provided here is what is available to you for each log message.
 */
export default class LogMessage implements ILogMessage {
  readonly __opts: LambdaLogOptions = {};
  __level: string;
  __msg = '';
  __meta: GenericRecord = {};
  __tags: Tag[] = [];
  __error: Error | null | undefined = null;


  /**
   * Constructor for LogMessage
   * @param {LogObject} log The log object to construct the LogMessage from.
   * @param {LambdaLogOptions} opts The options for LambdaLog.
   * @class
   */
  constructor(log: LogObject, opts: LambdaLogOptions) {
    // LambdaLog options
    this.__opts = opts;
    // Log level
    this.__level = log.level;

    // Compile log metadata
    if(log.meta) {
      this.__meta = typeof log.meta !== 'object' || Array.isArray(log.meta) ? { meta: log.meta } : log.meta;
    }

    // Compile log tags
    if(log.tags && Array.isArray(log.tags)) {
      this.__tags = log.tags;
    }

    // Compile log message
    this.setMessage(log.msg);
  }

  /**
   * String log level of the message.
   * @returns {string} The log level.
   */
  get level() {
    return this.__level;
  }

  /**
   * The message for the log. If an Error was provided, it will be the message of the error.
   * @returns {string} The message for the log.
   */
  get msg(): string {
    return this.__msg;
  }

  /**
   * Update the message for this log to something else.
   * @param {Message} msg The new message for this log.
   */
  set msg(msg: Message) {
    this.setMessage(msg);
  }

  /**
   * Alias for `this.msg`.
   * @returns {string} The message for the log.
   */
  get message() {
    return this.msg;
  }

  /**
   * Alias for `this.msg = 'New message';`
   * @param {Message} msg The new message for this log.
   */
  set message(msg) {
    this.msg = msg;
  }

  /**
   * The fully compiled metadata object for the log. Includes global and dynamic metadata.
   * @returns {GenericRecord} The metadata object.
   */
  get meta(): GenericRecord {
    const { __opts, __meta } = this;

    let meta: GenericRecord = {
      ...__meta,
      ...__opts.meta
    };

    if(typeof __opts.dynamicMeta === 'function') {
      const dynMeta = __opts.dynamicMeta.call(this, this, __opts);

      if(typeof dynMeta === 'object') {
        meta = { ...meta, ...dynMeta };
      }
    }

    for(const [key, val] of Object.entries(meta)) {
      if(typeof val !== 'object' || !val) continue;
      if(isError(val)) {
        meta[key] = stubError(val as Error);
      }
    }

    return meta;
  }

  /**
   * Set additional metadata on the log message.
   * @param {GenericRecord} obj The metadata to add to the log.
   */
  set meta(obj) {
    this.__meta = {
      ...this.__meta,
      ...obj
    };
  }

  /**
   * Array of tags attached to this log. Includes global tags.
   * @returns {Tag[]} The tags attached to this log.
   */
  get tags() {
    const { __opts, __tags } = this;
    let tags: Tag[] = [...__tags];

    if(Array.isArray(__opts.tags)) {
      tags = [...__opts.tags, ...tags];
    }

    return tags.map(tag => {
      if(typeof tag === 'function') {
        const tagRes = tag.call(this, {
          level: this.level,
          meta: this.meta,
          options: __opts
        });

        if(tagRes) tag = tagRes;
      }

      if(typeof tag === 'string') {
        tag = tag.replace(/(<<([a-z0-9_]+)>>)/gi, (_, tplVar: string, key: string) => {
          if(key === 'level') return this.level;
          return tplVar;
        });
      }

      return tag;
    }).filter(tag => typeof tag === 'string' && tag);
  }

  /**
   * Appends additional tags to this log message.
   * @param {Tag[]} tags The tags to add to this log.
   */
  set tags(tags: Tag[]) {
    this.__tags = [...this.__tags, ...tags];
  }

  /**
   * The full log object. This is the object used in logMessage.toJSON() and when the log is written to the console.
   * @returns {GenericRecord} The compiled log object.
   */
  get value() {
    const { __opts } = this;

    if(typeof __opts.onCompile === 'function') {
      return __opts.onCompile.call(this, this.level, this.msg, this.meta, this.tags, __opts);
    }

    let log: GenericRecord = {};
    if(__opts.levelKey !== false) log[__opts.levelKey ?? '__level'] = this.level;
    log[__opts.messageKey ?? 'msg'] = this.msg;
    log = { ...log, ...this.meta };
    if(__opts.tagsKey !== false) log[__opts.tagsKey ?? '__tags'] = this.tags;

    return log;
  }

  /**
   * Alias of `logMessage.value`.
   * @returns {GenericRecord} The compiled log object.
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
    const err = (this.__error ?? new Error(this.msg)) as StubbedError;
    err.log = this;

    throw err;
  }

  /**
   * Returns the compiled log object converted into JSON. This method utilizes `options.replacer` for the replacer function. It also uses
   * [fast-safe-stringify](https://www.npmjs.com/package/fast-safe-stringify) to prevent circular reference issues.
   * @param {boolean} format Whether to format the log object with line breaks and indentation.
   * @returns {string} The JSON string.
   */
  toJSON(format?: boolean) {
    return stringify(this.value, this.__opts.replacer ?? undefined, format ? 2 : 0);
  }

  /**
   * Converts the log to a string using a specific/custom formatter.
   * @returns {string} The formatted log as a string.
   */
  toString() {
    return this.formatMessage(this.__opts.onFormat);
  }

  /**
   * Converts the log to a string using a specific/custom formatter.
   * @protected
   * @param {FormatPlugin} [formatter] The formatter to use or custom formatter function.
   * @returns {string} The formatted log as a string.
   */
  protected formatMessage(formatter?: FormatPlugin): string {
    const { __opts } = this;

    if(!formatter || typeof formatter !== 'function') {
      formatter = jsonFormatter();
    }

    return formatter.call(this, this, __opts, stringify);
  }

  /**
   * Takes a log message, parses it, and sets any corresponding properties on the log.
   * @protected
   * @param {Message} message The incoming message.
   */
  protected setMessage(message: Message) {
    // Compile log message
    const { msg, meta, error, tags } = this.parseMessage(message);
    this.__msg = msg;

    // Add any meta, error object, or tags derrived from the message
    if(meta) this.__meta = { ...this.__meta, ...meta };
    if(error) this.__error = error;
    if(tags) this.__tags = [...this.__tags, ...tags];
  }

  /**
   * Parses a log message and returns any meta, error object, or tags derrived from the message.
   * @protected
   * @param {Message} msg The incoming message.
   * @returns {object}  Object continaing msg, meta, error, and tags.
   */
  protected parseMessage(msg: Message): { msg: string; meta?: GenericRecord; error?: Error; tags?: Tag[] } {
    const { __opts } = this;

    if(typeof __opts.onParse === 'function') {
      const res = __opts.onParse.call(this, msg, __opts);
      if(res && typeof res === 'object') return res;
    }

    if(msg === null || msg === undefined) return { msg: '' };

    if(isError(msg)) {
      const err = msg as Error;
      return { msg: err.message, meta: { stack: err.stack }, error: err };
    }

    if(typeof msg === 'object') {
      return { msg: JSON.stringify(msg) };
    }

    return { msg: msg.toString() };
  }
}

import { EventEmitter } from 'events';
import { LambdaLogOptions, Message, GenericRecord, LogLevels, LogObject, Tag, ConsoleObject } from './typings.js';
import LogMessage from './LogMessage.js';
import * as logFormatters from './formatters/index.js';
import { toBool } from './utils.js';


const levels = [{
  name: 'fatal',
  method: 'error'
}, {
  name: 'error',
  method: 'error'
}, {
  name: 'warn',
  method: 'warn'
}, {
  name: 'info',
  method: 'info'
}, {
  name: 'debug',
  method: 'debug'
}, {
  name: 'trace',
  method: 'debug'
}];

/**
 * Default options for the LambdaLog class. Stored globally so that it can be modified by the user.
 */
export const defaultOptions: LambdaLogOptions = {
  meta: {},
  tags: [],
  dynamicMeta: null,
  level: 'info',
  dev: false,
  silent: false,
  replacer: null,
  logHandler: console,
  levelKey: '__level',
  messageKey: 'msg',
  tagsKey: '__tags',
  onFormat: logFormatters.json()
};

export const formatters = logFormatters;


export default class LambdaLog extends EventEmitter {
  static defaultOptions = defaultOptions;
  static formatters = formatters;

  /**
   * Access to the uninstantiated LambdaLog class.
   * @readonly
   * @type {LambdaLog}
   */
  readonly LambdaLog = LambdaLog;
  /**
   * Access to the uninstantiated LogMessage class.
   * @type {LogMessage}
   */
  LogMessage = LogMessage;

  /**
   * The options object for this instance of LambdaLog.
   * @type {LambdaLogOptions}
   */
  options: LambdaLogOptions;

  /**
   * Access to the log levels configuration.
   * @readonly
   */
  readonly levels = levels;

  /**
   * Returns the console object to use for logging.
   * @readonly
   * @private
   * @returns {ConsoleObject} The configured console object or `console` if none is provided.
   */
  private get console(): ConsoleObject {
    return this.options.logHandler ?? console;
  }

  /**
   * Constructor for the LambdaLog class. Provided to be utilized in more advanced cases to allow overriding and configuration.
   * By default, this module will export an instance of this class, but you may access the class and create your own instance
   * via `log.LambdaLog`.
   * @class
   * @param {LambdaLogOptions} [options={}] Configuration options for LambdaLog.
   */
  constructor(options: LambdaLogOptions = {}) {
    super();

    this.options = {
      ...defaultOptions,
      ...options
    };

    // Override the max log level from the environment variable
    if(process.env.LAMBDALOG_LEVEL) {
      const lvl = this.getLevel(process.env.LAMBDALOG_LEVEL);
      if(lvl) this.options.level = lvl.name as keyof LambdaLogOptions['level'];
    }

    // Override the dev setting from the environment variable
    if(process.env.LAMBDALOG_DEV) {
      this.options.dev = toBool(process.env.LAMBDALOG_DEV);
    }

    // Override the silent setting from the environment variable
    if(process.env.LAMBDALOG_SILENT) {
      this.options.silent = toBool(process.env.LAMBDALOG_SILENT);
    }
  }

  /**
   * Generates JSON log message based on the provided parameters and the global configuration. Once the JSON message is created, it is properly logged to the `console`
   * and emitted through an event. If an `Error` or `Error`-like object is provided for `msg`, it will parse out the message and include the stacktrace in the metadata.
   * @throws {Error} If improper log level is provided.
   * @template T The type of the message to log.
   * @param  {string}   level Log level (`info`, `debug`, `warn`, `error`, or `fatal`)
   * @param  {T}        msg   Message to log. Can be any type, but string or `Error` is reccommended.
   * @param  {object|string|number}   [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]} [tags=[]]  Additional tags to append to this log.
   * @returns {LogMessage}  Returns instance of LogMessage.
   */
  _log<T extends Message = Message>(level: LogLevels, msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    const lvl = this.getLevel(level);
    if(!lvl) {
      throw new Error(`"${level}" is not a valid log level`);
    }

    // Generate the log message instance
    const message = new this.LogMessage({
      level,
      msg,
      meta,
      tags
    } as LogObject<T>, this.options);

    // Check if we can log this level
    if(lvl.idx <= this.maxLevelIdx) {
      const consoleObj = this.console;
      // Log the message to the console
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      consoleObj[lvl.method](message.toString());

      /**
       * The log event is emitted (using EventEmitter) for every log generated. This allows for custom integrations, such as logging to a thrid-party service.
       * This event is emitted with the [LogMessage](#logmessage) instance for the log. You may control events using all the methods of EventEmitter.
       * @event LambdaLog#log
       * @type {LogMessage}
       */
      this.emit('log', message);
    }

    return message;
  }

  /**
   * Logs a message at the `trace` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  trace<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('trace', msg, meta, tags);
  }

  /**
   * Logs a message at the `debug` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  debug<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('debug', msg, meta, tags);
  }

  /**
   * Logs a message at the `info` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  info<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('info', msg, meta, tags);
  }

  /**
   * Alias for `info`.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  log<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('info', msg, meta, tags);
  }

  /**
   * Logs a message at the `warn` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  warn<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('warn', msg, meta, tags);
  }

  /**
   * Logs a message at the `error` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  error<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('error', msg, meta, tags);
  }

  /**
   * Logs a message at the `error` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {Metadata} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage} Returns instance of LogMessage.
   */
  fatal<T extends Message = Message>(msg: T, meta?: Metadata, tags?: Tag[]): LogMessage {
    return this._log<T>('fatal', msg, meta, tags);
  }

  /**
   * Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to
   * wrap them in an if statement. The log level will be `error`.
   * @template T The type of the message to log.
   * @param  {*}        test  Value to test for a falsy value.
   * @param  {T}        msg   Message to log. Can be any type, but string or `Error` is reccommended.
   * @param  {object}   [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]} [tags=[]]  Additional tags to append to this log.
   * @returns {LogMessage|false} The generated log message or `false` if assertion passed.
   */
  assert<T extends Message = Message>(test: unknown, msg: T, meta?: Metadata, tags?: Tag[]): LogMessage | false {
    if(test) return false;
    return this._log<T>('error', msg, meta, tags);
  }

  /**
   * Generates a log message with the result or error provided by a promise. Useful for debugging and testing.
   * @param  {Promise<*>} promise  Promise to log the results of.
   * @param  {object}   [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]} [tags=[]]  Additional tags to append to this log.
   * @returns {Promise<LogMessage>} A Promise that resolves with the log message.
   */
  async result(promise: Promise<unknown>, meta?: Metadata, tags?: Tag[]): Promise<LogMessage> {
    const wrapper = new Promise<LogMessage>(resolve => {
      promise
        .then(value => {
          resolve(this._log<any>('info', value, meta, tags));
        })
        .catch(err => {
          resolve(this._log('error', err as Error, meta, tags));
        });
    });

    return wrapper;
  }

  /**
   * Validates and gets the configuration for the provided log level.
   * @private
   * @param {string} level The provided log level string.
   * @returns {object} Returns the configuration for the provided log level.
   */
  private getLevel(level: string) {
    if(!level) return false;
    const lvl = levels.findIndex(l => l.name === level.toLowerCase());
    if(lvl === -1) return false;

    return {
      idx: lvl,
      ...levels[lvl]
    };
  }

  /**
   * Returns the index of the configured maximum log level.
   * @readonly
   * @private
   * @returns {number} The index of the configured maximum log level.
   */
  private get maxLevelIdx() {
    if(!this.options.level || this.options.silent) return -1;
    return levels.findIndex(l => l.name === this.options.level);
  }
}

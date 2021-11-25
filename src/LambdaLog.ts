import { EventEmitter } from 'events';
import { LambdaLogOptions, Message, GenericRecord, LogLevels, LogObject, Tag, ConsoleObject } from './typings.js';
import LogMessage from './LogMessage.js';
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
  tagsKey: '__tags'
};


export default class LambdaLog extends EventEmitter {
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
   * @param  {object}   [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]} [tags=[]]  Additional tags to append to this log.
   * @returns {LogMessage|false}  Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  log<T extends Message>(level: LogLevels, msg: T, meta: GenericRecord = {}, tags: Tag[] = []) {
    const lvl = this.getLevel(level);
    if(!lvl) {
      throw new Error(`"${level}" is not a valid log level`);
    }

    // Check if we can log this level
    if(lvl.idx > this.maxLevelIdx) return false;

    // Generate the log message instance
    const message = new this.LogMessage({
      level,
      msg,
      meta,
      tags
    } as LogObject, this.options);

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
    return message;
  }

  /**
   * Logs a message at the `trace` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {GenericRecord} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage|false} Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  trace<T extends Message>(msg: T, meta?: GenericRecord, tags?: Tag[]) {
    return this.log('trace', msg, meta, tags);
  }

  /**
   * Logs a message at the `debug` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {GenericRecord} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage|false} Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  debug<T extends Message>(msg: T, meta?: GenericRecord, tags?: Tag[]) {
    return this.log('debug', msg, meta, tags);
  }

  /**
   * Logs a message at the `info` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {GenericRecord} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage|false} Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  info<T extends Message>(msg: T, meta?: GenericRecord, tags?: Tag[]) {
    return this.log('info', msg, meta, tags);
  }

  /**
   * Logs a message at the `warn` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {GenericRecord} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage|false} Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  warn<T extends Message>(msg: T, meta?: GenericRecord, tags?: Tag[]) {
    return this.log('warn', msg, meta, tags);
  }

  /**
   * Logs a message at the `error` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {GenericRecord} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage|false} Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  error<T extends Message>(msg: T, meta?: GenericRecord, tags?: Tag[]) {
    return this.log('error', msg, meta, tags);
  }

  /**
   * Logs a message at the `error` log level.
   * @template T The type of the message to log.
   * @param {T} msg Message to log. Can be any type, but string or `Error` is reccommended.
   * @param {GenericRecord} [meta] Optional meta data to attach to the log.
   * @param {Tag[]} [tags] Additional tags to append to this log.
   * @returns {LogMessage|false} Returns instance of LogMessage or `false` if the level of the log exceeds to the maximum set log level.
   */
  fatal<T extends Message>(msg: T, meta?: GenericRecord, tags?: Tag[]) {
    return this.log('fatal', msg, meta, tags);
  }

  /**
   * Generates a log message if `test` is a falsy value. If `test` is truthy, the log message is skipped and returns `false`. Allows creating log messages without the need to
   * wrap them in an if statement. The log level will be `error`.
   * @since 1.4.0
   * @template T The type of the message to log.
   * @param  {*}        test  Value to test for a falsy value.
   * @param  {T}        msg   Message to log. Can be any type, but string or `Error` is reccommended.
   * @param  {object}   [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]} [tags=[]]  Additional tags to append to this log.
   * @returns {LogMessage|false} The generated log message or `false` if assertion passed.
   */
  assert<T extends Message>(test: unknown, msg: T, meta?: GenericRecord, tags?: Tag[]) {
    if(test) return false;
    return this.log('error', msg, meta, tags);
  }

  /**
   * Generates a log message with the result or error provided by a promise. Useful for debugging and testing.
   * @since 2.3.0
   * @param  {Promise<*>} promise  Promise to log the results of.
   * @param  {object}   [meta={}]  Optional meta data to attach to the log.
   * @param  {string[]} [tags=[]]  Additional tags to append to this log.
   * @returns {Promise<LogMessage | false>} A Promise that resolves with the log message.
   */
  async result(promise: Promise<unknown>, meta?: GenericRecord, tags?: Tag[]) {
    const wrapper = new Promise<LogMessage | false>(resolve => {
      promise
        .then(value => {
          resolve(this.log('info', value as string, meta, tags));
        })
        .catch(err => {
          resolve(this.log('error', err as Error, meta, tags));
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

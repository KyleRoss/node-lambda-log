import LambdaLog from './LambdaLog';
import LogMessage from './LogMessage';

/**
 * Instance of the LambdaLog class which is exported when calling `require('lambda-log')`. For more
 * advanced usage, you can create a new instance of the LambdaLog class via `new log.LambdaLog()`.
 * @type {LambdaLog}
 */
export default new LambdaLog();
export { LambdaLog, LogMessage };
export * from './typings';

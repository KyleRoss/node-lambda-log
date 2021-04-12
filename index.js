const LambdaLog = require('./lib/LambdaLog');
/**
 * Instance of the LambdaLog class which is exported when calling `require('lambda-log')`. For more
 * advanced usage, you can create a new instance of the LambdaLog class via `new log.LambdaLog()`.
 * @type {LambdaLog}
 */
const log = new LambdaLog();

module.exports = log;

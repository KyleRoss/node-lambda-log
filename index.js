/**
 * @module lambda-log
 * @description Basic logging mechanism for Lambda Functions
 * @requires Node 6.10+
 * @author Kyle Ross
 */
"use strict";
const LambdaLog = require('./lib/LambdaLog');

module.exports = new LambdaLog();

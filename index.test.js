const log = require('.');
const LambdaLog = require('./lib/LambdaLog');

describe('Default Export', () => {
  test('returns an instance of the LambdaLog class', () => {
    expect(log).toBeInstanceOf(LambdaLog);
  });

  test('to have access to uninstantiated LambdaLog class', () => {
    expect(log.LambdaLog).toEqual(LambdaLog);
  });
});

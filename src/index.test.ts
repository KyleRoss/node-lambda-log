import log from '.';
import LambdaLog from './LambdaLog';
import LogMessage from './LogMessage';

describe('Default Export', () => {
  test('returns an instance of the LambdaLog class', () => {
    expect(log).toBeInstanceOf(LambdaLog);
  });

  test('to have access to uninstantiated LambdaLog class', () => {
    expect(log.LambdaLog).toEqual(LambdaLog);
  });

  test('to have access to uninstantiated LogMessage class', () => {
    expect(log.LogMessage).toEqual(LogMessage);
  });
});

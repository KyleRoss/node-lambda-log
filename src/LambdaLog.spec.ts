/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-empty-function */
import LambdaLog, { defaultOptions } from './LambdaLog';
import LogMessage from './LogMessage';
import { ConsoleObject } from './typings';

const mockConsole = {
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

describe('LambdaLog', () => {
  it.each([
    ['meta', {}],
    ['tags', []],
    ['dynamicMeta', null],
    ['dev', false],
    ['silent', false],
    ['replacer', null],
    ['logHandler', console],
    ['levelKey', '__level'],
    ['messageKey', 'msg'],
    ['tagsKey', '__tags']
  ])('should set default option %s to equal %p', (key, expected) => {
    const log = new LambdaLog();
    expect(log.options[key]).toStrictEqual(expected);
  });

  it.each([
    ['meta', { test: 'test' }],
    ['tags', ['custom-tag']],
    ['dynamicMeta', function () {}],
    ['debug', true],
    ['dev', true],
    ['silent', true],
    ['replacer', function () {}],
    ['logHandler', function () {}],
    ['levelKey', 'level'],
    ['messageKey', 'message'],
    ['tagsKey', 'tags']
  ])('should override the default option for %s with %p', (key, expected) => {
    const log = new LambdaLog({
      [key]: expected
    });

    expect(log.options[key]).toStrictEqual(expected);
  });

  describe('Environment Variables', () => {
    const truthyValues = ['true', '1', 'yes', 'y', 'on'];
    const falsyValues = ['false', '0', 'no', 'n', 'off'];

    describe('LAMBALOG_LEVEL', () => {
      it.each([
        'trace', 'debug', 'info', 'warn', 'error', 'fatal'
      ])('should set max log level when LAMBDALOG_LEVEL is set to %s', val => {
        process.env.LAMBDALOG_LEVEL = val;
        const log = new LambdaLog();

        expect(log.options.level).toBe(val);
        delete process.env.LAMBDALOG_LEVEL;
      });

      it('should only set the max log level when LAMBDALOG_LEVEL is set to a valid log level', () => {
        process.env.LAMBDALOG_LEVEL = 'foo';
        const log = new LambdaLog();

        expect(log.options.level).toBe('info');
        delete process.env.LAMBDALOG_LEVEL;
      });
    });

    describe.each([
      ['enable', truthyValues, true],
      ['disable', falsyValues, false]
    ])('LAMBALOG_DEV', (action, vals, expected) => {
      it.each(vals)(`should ${action} dev mode when LAMBDALOG_DEV is set to %s`, val => {
        process.env.LAMBDALOG_DEV = val;
        const log = new LambdaLog();

        expect(log.options.dev).toBe(expected);
        delete process.env.LAMBDALOG_DEV;
      });
    });

    describe.each([
      ['enable', truthyValues, true],
      ['disable', falsyValues, false]
    ])('LAMBALOG_SILENT', (action, vals, expected) => {
      it.each(vals)(`should ${action} silent mode when LAMBDALOG_SILENT is set to %s`, val => {
        process.env.LAMBDALOG_SILENT = val;
        const log = new LambdaLog();

        expect(log.options.silent).toBe(expected);
        delete process.env.LAMBDALOG_SILENT;
      });
    });
  });

  describe('Properties', () => {
    it.each([
      ['LambdaLog', LambdaLog],
      ['LogMessage', LogMessage]
    ])('should have access to uninstantiated %s class', (name, expected) => {
      const log = new LambdaLog();
      expect(log).toHaveProperty(name);
      expect(log[name]).toBe(expected);
    });
  });

  describe('Methods', () => {
    beforeEach(() => {
      defaultOptions.logHandler = mockConsole as unknown as ConsoleObject;
    });

    afterAll(() => {
      defaultOptions.logHandler = console;
    });

    afterEach(() => {
      mockConsole.log.mockClear();
      mockConsole.info.mockClear();
      mockConsole.warn.mockClear();
      mockConsole.error.mockClear();
      mockConsole.debug.mockClear();
    });

    describe('log()', () => {
      it('should throw error for invalid log level', () => {
        const log = new LambdaLog();
        expect(() => log.log('foo' as any, 'test')).toThrowError(/^"foo" is not a valid log level$/);
      });

      it('should throw error for no log level', () => {
        const log = new LambdaLog();
        expect(() => log.log(null as any, 'test')).toThrowError(/is not a valid log level$/);
      });

      it('should return false for a disabled log level', () => {
        const log = new LambdaLog({ level: 'fatal' });
        const result = log.log('debug', 'test');
        expect(result).toBe(false);
      });

      it('should return log message instance', () => {
        const log = new LambdaLog();
        const result = log.log('info', 'test');
        expect(result).toBeInstanceOf(LogMessage);
      });

      it('should not log message when silent is enabled', () => {
        const log = new LambdaLog({ silent: true });
        log.log('info', 'test');
        expect(mockConsole.info).toBeCalledTimes(0);
      });

      it('should emit "log" event with instance of LogMessage', done => {
        const log = new LambdaLog();

        log.on('log', msg => {
          expect(msg).toBeInstanceOf(LogMessage);
          done();
        });

        const res = log.log('error', 'test');
        expect(res).toBeInstanceOf(LogMessage);
      });

      it('should default to `console` if logHandler is not provided', () => {
        const log = new LambdaLog({
          logHandler: undefined
        });

        const info = jest.spyOn(console, 'info');
        log.log('info', 'test');
        expect(info).toBeCalled();
        info.mockRestore();
      });
    });

    describe('assert()', () => {
      it('should return false when test is a truthy value', () => {
        const log = new LambdaLog();
        const result = log.assert(true, 'test');
        expect(result).toBe(false);
      });

      it('should log error if test is a falsy value', () => {
        const log = new LambdaLog();
        const result = log.assert(false, 'test');

        expect(result).toBeInstanceOf(LogMessage);
        if(result !== false) {
          expect(result.level).toBe('error');
        }
      });
    });

    describe('result()', () => {
      it('should log promise results as info message on resolve', done => {
        const log = new LambdaLog();
        const promise = log.result(Promise.resolve('Success!'));

        promise.then(msg => {
          expect(msg).toBeInstanceOf(LogMessage);
          if(msg !== false) {
            expect(msg.level).toBe('info');
            expect(msg.msg).toBe('Success!');
            done();
          }
        });
      });

      it('should log promise error as an error message on reject', done => {
        const log = new LambdaLog();
        const promise = log.result(Promise.reject(new Error('Failed!')));

        promise.then(msg => {
          expect(msg).toBeInstanceOf(LogMessage);
          if(msg !== false) {
            expect(msg.level).toBe('error');
            expect(msg.msg).toBe('Failed!');
            done();
          }
        });
      });
    });

    describe('shortcut methods', () => {
      it('should log trace message', () => {
        const log = new LambdaLog({ level: 'trace' });
        log.trace('test');
        expect(mockConsole.debug).toBeCalledTimes(1);
      });

      it('should log debug message', () => {
        const log = new LambdaLog({ level: 'debug' });
        log.debug('test');
        expect(mockConsole.debug).toBeCalledTimes(1);
      });

      it('should log info message', () => {
        const log = new LambdaLog({ level: 'info' });
        log.info('test');
        expect(mockConsole.info).toBeCalledTimes(1);
      });

      it('should log warn message', () => {
        const log = new LambdaLog({ level: 'warn' });
        log.warn('test');
        expect(mockConsole.warn).toBeCalledTimes(1);
      });

      it('should log error message', () => {
        const log = new LambdaLog({ level: 'error' });
        log.error('test');
        expect(mockConsole.error).toBeCalledTimes(1);
      });

      it('should log fatal message', () => {
        const log = new LambdaLog({ level: 'fatal' });
        log.fatal('test');
        expect(mockConsole.error).toBeCalledTimes(1);
      });
    });
  });
});

const LambdaLog = require('./LambdaLog');
const LogMessage = require('./LogMessage');

let log;

const noop = function () {};
const mockConsole = {
  log: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
};

beforeEach(() => {
  log = new LambdaLog();
});

describe('Statics', () => {
  test('should have static property "symbols"', () => {
    expect(LambdaLog.symbols).toBeDefined();
  });

  describe('Static symbols', () => {
    test('should have a symbol for levels', () => {
      expect(LambdaLog.symbols).toHaveProperty('LEVELS');
      expect(LambdaLog.symbols.LEVELS.toString()).toEqual('Symbol(levels)');
    });
  });
});

describe('Constructor', () => {
  test.each([
    ['meta', {}],
    ['tags', []],
    ['dynamicMeta', null],
    ['debug', false],
    ['dev', false],
    ['silent', false],
    ['replacer', null],
    ['logHandler', console],
    ['levelKey', '_logLevel'],
    ['messageKey', 'msg'],
    ['tagsKey', '_tags']
  ])('should set default option %s to equal %p', (key, expected) => {
    expect(log.options[key]).toStrictEqual(expected);
  });

  test.each([
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
    afterEach(() => {
      process.env.LAMBALOG_SILENT = null;
    });

    test.each([
      ['true'],
      ['yes'],
      ['y'],
      ['1']
    ])('should enable silent mode when LAMBDALOG_SILENT is set to %s', val => {
      process.env.LAMBDALOG_SILENT = val;
      const log = new LambdaLog();

      expect(log.options.silent).toBe(true);
    });
  });

  describe('Custom Log Levels', () => {
    test('should add custom log level to configuration', () => {
      const log = new LambdaLog({}, {
        test: 'log'
      });

      expect(log[LambdaLog.symbols.LEVELS]).toHaveProperty('test', 'log');
    });
  });
});

describe('Properties', () => {
  test.each([
    ['LambdaLog', LambdaLog],
    ['LogMessage', LogMessage]
  ])('should have access to uninstantiated %s class', (name, expected) => {
    expect(log).toHaveProperty(name);
    expect(log[name]).toBe(expected);
  });

  describe('Log Levels', () => {
    test('should have log levels configuration object', () => {
      expect(typeof log[LambdaLog.symbols.LEVELS]).toBe('object');
    });

    test('should have default log level info', () => {
      expect(log[LambdaLog.symbols.LEVELS]).toHaveProperty('info', 'info');
    });

    test('should have default log level warn', () => {
      expect(log[LambdaLog.symbols.LEVELS]).toHaveProperty('warn', 'warn');
    });

    test('should have default log level error', () => {
      expect(log[LambdaLog.symbols.LEVELS]).toHaveProperty('error', 'error');
    });

    test('should have default log level debug', () => {
      expect(log[LambdaLog.symbols.LEVELS]).toHaveProperty('debug');
      expect(typeof log[LambdaLog.symbols.LEVELS].debug).toBe('function');
    });

    test('should return false from debug level function when options.debug is false', () => {
      expect(log[LambdaLog.symbols.LEVELS].debug.call(log)).toBe(false);
    });

    test('should return debug from debug level function when options.debug is true', () => {
      const log = new LambdaLog({ debug: true });
      expect(log[LambdaLog.symbols.LEVELS].debug.call(log)).toBe('debug');
    });
  });

  test('should have console property that is equal to options.logHandler', () => {
    expect(log.console).toBe(console);
  });
});

describe('Methods', () => {
  describe('addLevel()', () => {
    test('should add a custom log level to the configuration', () => {
      const log = new LambdaLog();
      log.addLevel('test', 'log');

      expect(log[LambdaLog.symbols.LEVELS]).toHaveProperty('test', 'log');
    });

    test('should add a dynamic method to the class', () => {
      const log = new LambdaLog();
      log.addLevel('test', 'log');

      expect(typeof log.test).toBe('function');
    });
  });

  describe('log()', () => {
    test('should throw error when unknown log level is passed in', () => {
      expect(() => {
        log.log('foo', 'test');
      }).toThrow('"foo" is not a valid log level');
    });

    test('should return false for a disable log level', () => {
      const result = log.log('debug', 'test');
      expect(result).toBe(false);
    });

    test('should not log message when silent is enabled', () => {
      const log = new LambdaLog({ logHandler: mockConsole, silent: true });
      log.log('info', 'test');
      expect(mockConsole.info).toBeCalledTimes(0);
    });

    test('should return instance of LogMessage', () => {
      const result = log.log('info', 'test');
      expect(result).toBeInstanceOf(LogMessage);
    });

    test('should emit "log" event with instance of LogMessage', done => {
      const log = new LambdaLog({ logHandler: mockConsole });

      log.on('log', msg => {
        expect(msg).toBeInstanceOf(LogMessage);
        done();
      });

      log.log('info', 'test');
    });
  });

  describe('assert()', () => {
    test('should return false when test is a truthy value', () => {
      const result = log.assert(true, 'test');
      expect(result).toBe(false);
    });

    test('should log error if test is a falsy value', () => {
      const log = new LambdaLog({ logHandler: mockConsole });
      const result = log.assert(false, 'test');

      expect(result).toBeInstanceOf(LogMessage);
      expect(result.level).toBe('error');
    });
  });

  describe('result()', () => {
    test('should throw error if a Promise is not provided', () => {
      expect(() => {
        log.result(null);
      }).toThrow('A promise must be provided as the first argument');
    });

    test('should throw error if non-Promise is provided', () => {
      expect(() => {
        log.result(noop);
      }).toThrow('A promise must be provided as the first argument');
    });

    test('should log promise results as info message on resolve', done => {
      const log = new LambdaLog({ logHandler: mockConsole });
      const promise = log.result(Promise.resolve('Success!'));

      promise.then(msg => {
        expect(msg).toBeInstanceOf(LogMessage);
        expect(msg.level).toBe('info');
        expect(msg.msg).toBe('Success!');
        done();
      });
    });

    test('should log promise error as an error message on reject', done => {
      const log = new LambdaLog({ logHandler: mockConsole });
      const promise = log.result(Promise.reject(new Error('Failed!')));

      promise.then(msg => {
        expect(msg).toBeInstanceOf(LogMessage);
        expect(msg.level).toBe('error');
        expect(msg.msg).toBe('Failed!');
        done();
      });
    });
  });
});

describe('Dynamic Methods', () => {
  test.each([
    ['info'],
    ['warn'],
    ['error'],
    ['debug']
  ])('should automatically create method log.%s', method => {
    const log = new LambdaLog({
      logHandler: mockConsole,
      silent: false,
      debug: true
    });

    expect(typeof log[method]).toBe('function');
    const message = log[method]('test');
    expect(mockConsole[method]).toHaveBeenCalled();

    expect(message).toBeInstanceOf(LogMessage);
  });

  test('should automatically create method for custom log levels', () => {
    const log = new LambdaLog({
      logHandler: mockConsole,
      silent: false,
      debug: true
    }, {
      test: 'log'
    });

    expect(typeof log.test).toBe('function');
    const message = log.test('test');
    expect(mockConsole.log).toHaveBeenCalled();

    expect(message).toBeInstanceOf(LogMessage);
  });
});

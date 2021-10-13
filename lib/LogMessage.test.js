const LogMessage = require('./LogMessage');

const logData = {
  info: {
    level: 'info',
    msg: 'info test',
    meta: {},
    tags: []
  },

  error: {
    level: 'error',
    msg: new Error('error test'),
    meta: {},
    tags: []
  },

  withMeta: {
    level: 'info',
    msg: 'info test',
    meta: { test: true },
    tags: []
  },

  withTags: {
    level: 'info',
    msg: 'info test',
    meta: {},
    tags: ['test']
  }
};

const defaultOpts = {
  meta: {},
  dynamicMeta: null,
  tags: [],
  levelKey: '_logLevel',
  messageKey: 'msg',
  tagsKey: '_tags',
  replacer: null
};

describe('Statics', () => {
  test('should have static property "symbols"', () => {
    expect(LogMessage.symbols).toBeDefined();
  });

  describe('Static symbols', () => {
    test.each([
      ['LOG', 'Symbol(log)'],
      ['META', 'Symbol(meta)'],
      ['ERROR', 'Symbol(error)'],
      ['OPTS', 'Symbol(opts)']
    ])('should have a symbol for %s', (prop, value) => {
      expect(LogMessage.symbols).toHaveProperty(prop);
      expect(LogMessage.symbols[prop].toString()).toEqual(value);
    });
  });

  describe('Static Methods', () => {
    describe('isError()', () => {
      test('should return true for an Error', () => {
        expect(LogMessage.isError(new Error('test'))).toBe(true);
      });

      test('should return true for an Error-like object', () => {
        expect(LogMessage.isError({
          message: 'test',
          stack: 'stack'
        })).toBe(true);
      });

      test('should return false for anything else', () => {
        expect(LogMessage.isError()).toBe(false);
        expect(LogMessage.isError(null)).toBe(false);
        expect(LogMessage.isError(true)).toBe(false);
        expect(LogMessage.isError(123)).toBe(false);
        expect(LogMessage.isError('A string')).toBe(false);
        expect(LogMessage.isError({ message: 'test' })).toBe(false);
        expect(LogMessage.isError([1, 2, 3, 'test'])).toBe(false);
        expect(LogMessage.isError({ stack: 'stack' })).toBe(false);
      });
    });

    describe('stubError()', () => {
      let err;
      beforeEach(() => {
        const e = new Error('test');
        e.test = true;
        err = LogMessage.stubError(e);
      });

      test('should add a toJSON method to an error', () => {
        expect(err).toHaveProperty('toJSON');
        expect(typeof err.toJSON).toBe('function');
      });

      test('calling toJSON should create an serializable object', () => {
        const result = err.toJSON();

        expect(typeof result).toBe('object');
        expect(result).toHaveProperty('name', 'Error');
        expect(result).toHaveProperty('message', 'test');
        expect(result).toHaveProperty('stack', err.stack);
        expect(result).toHaveProperty('test', true);
      });

      test('should skip custom toJSON fn if error already has one', () => {
        const e = new Error('test');
        const noop = () => { /* noop */ };
        Object.defineProperty(e, 'toJSON', {
          value: noop
        });

        const error = LogMessage.stubError(e);
        expect(error.toJSON.toString()).toBe(noop.toString());
      });
    });
  });
});

describe('Constructor', () => {
  test.each([
    [LogMessage.symbols.LOG, logData.info],
    [LogMessage.symbols.META, {}],
    [LogMessage.symbols.ERROR, null],
    [LogMessage.symbols.OPTS, defaultOpts]
  ])('should set property %p on class', (symbol, expected) => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);

    expect(msg[symbol]).toStrictEqual(expected);
  });

  test.each([
    ['string', 'string meta'],
    ['array', ['array', 'meta']],
    ['boolean', true],
    ['number', 123]
  ])('should convert non-object (%s) meta to an object', (_, value) => {
    const msg = new LogMessage({
      ...logData.info,
      meta: value
    }, defaultOpts);

    expect(msg[LogMessage.symbols.LOG].meta).toStrictEqual({ meta: value });
  });

  test('should set log meta as an empty object if not provided', () => {
    const msg = new LogMessage({ ...logData.info, meta: undefined }, defaultOpts);

    expect(msg[LogMessage.symbols.LOG].meta).toStrictEqual({});
  });

  test('should set log tags as an empty array if not provided', () => {
    const msg = new LogMessage({ ...logData.info, tags: undefined }, defaultOpts);

    expect(msg[LogMessage.symbols.LOG].tags).toStrictEqual([]);
  });

  test('should update all properties when an error is passed in', () => {
    const msg = new LogMessage({ ...logData.error }, defaultOpts);

    expect(msg[LogMessage.symbols.LOG].msg).toBe('error test');
    expect(msg[LogMessage.symbols.ERROR]).toStrictEqual(logData.error.msg);
    expect(msg[LogMessage.symbols.META].stack).toBe(logData.error.msg.stack);
  });
});

describe('Getters', () => {
  test('"level" should return the log level', () => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);

    expect(msg.level).toBe('info');
  });

  test('"msg" and "message" should return the log message', () => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);

    expect(msg.msg).toBe('info test');
    expect(msg.message).toBe(msg.msg);
  });

  test('"meta" should return metadata object', () => {
    const msg = new LogMessage({ ...logData.withMeta }, defaultOpts);

    expect(msg.meta).toHaveProperty('test', true);
  });

  test('"meta" should combine all metadata', () => {
    const msg = new LogMessage({ ...logData.withMeta }, {
      ...defaultOpts,
      meta: { foo: 'bar' },
      dynamicMeta: () => ({ dynamic: 'meta' })
    });

    expect(msg.meta).toHaveProperty('test', true);
    expect(msg.meta).toHaveProperty('foo', 'bar');
    expect(msg.meta).toHaveProperty('dynamic', 'meta');
  });

  test('"meta" should call dynamicMeta', () => {
    const msg = new LogMessage({ ...logData.info }, {
      ...defaultOpts,
      dynamicMeta(cls, opts) {
        expect(this).toBeInstanceOf(LogMessage);
        expect(cls).toBeInstanceOf(LogMessage);
        expect(typeof opts).toBe('object');
        return { dynamic: 'meta' };
      }
    });

    expect(msg.meta).toHaveProperty('dynamic', 'meta');
  });

  test('"meta" should convert errors in metadata to object', () => {
    const msg = new LogMessage({ ...logData.withMeta }, {
      ...defaultOpts,
      meta: {
        foo: 'bar',
        prop: new Error('meta error'),
        obj: { not: 'an error' }
      }
    });

    expect(typeof msg.meta.prop).toBe('object');
    expect(msg.meta.foo).toBe('bar');
    expect(typeof msg.meta.obj).toBe('object');
  });

  test('"tags" should return tags array', () => {
    const msg = new LogMessage({ ...logData.withTags }, defaultOpts);

    expect(Array.isArray(msg.tags)).toBe(true);
    expect(msg.tags).toHaveLength(1);
    expect(msg.tags).toContain('test');
  });

  test('"tags" should combine all tags', () => {
    const msg = new LogMessage({ ...logData.withTags }, {
      ...defaultOpts,
      tags: ['global']
    });

    expect(msg.tags).toHaveLength(2);
    expect(msg.tags).toContain('test');
    expect(msg.tags).toContain('global');
  });

  test('"tags" should execute functions', () => {
    const msg = new LogMessage({ ...logData.info }, {
      ...defaultOpts,
      tags: [function (props) {
        expect(this).toBeInstanceOf(LogMessage);
        expect(typeof props).toBe('object');
        expect(props).toHaveProperty('level', 'info');
        expect(props).toHaveProperty('meta', {});
        expect(props).toHaveProperty('options');

        return 'dynamic';
      }]
    });

    const { tags } = msg;

    expect(tags).toHaveLength(1);
    expect(tags).toContain('dynamic');
  });

  test('"tags" should replace <<level>> variable with log level', () => {
    const msg = new LogMessage({ ...logData.info }, {
      ...defaultOpts,
      tags: ['<notAVariable>', '<<level>>', '<<variable>>']
    });

    const { tags } = msg;

    expect(tags).toHaveLength(3);
    expect(tags).toContain('<notAVariable>');
    expect(tags).toContain('info');
    expect(tags).toContain('<<variable>>');
  });

  test('"value" should return log object', () => {
    const msg = new LogMessage({ ...logData.info, meta: { test: true }, tags: ['test'] }, defaultOpts);
    const { value } = msg;

    expect(value).toHaveProperty('_logLevel', 'info');
    expect(value).toHaveProperty('msg', 'info test');
    expect(value).toHaveProperty('test', true);
    expect(value).toHaveProperty('_tags', ['test']);
  });

  test('"value" should change key names based on options', () => {
    const msg = new LogMessage({ ...logData.info, meta: { test: true }, tags: ['test'] }, {
      ...defaultOpts,
      levelKey: 'lvl',
      messageKey: 'message',
      tagsKey: 'tags'
    });
    const { value } = msg;

    expect(value).toHaveProperty('lvl', 'info');
    expect(value).toHaveProperty('message', 'info test');
    expect(value).toHaveProperty('test', true);
    expect(value).toHaveProperty('tags', ['test']);
  });

  test('"value" should hide level and tags when options is set to falsy value', () => {
    const msg = new LogMessage({ ...logData.info, tags: ['test'] }, {
      ...defaultOpts,
      levelKey: undefined,
      tagsKey: null
    });
    const { value } = msg;

    expect(value).not.toHaveProperty('_logLevel');
    expect(value).toHaveProperty('msg', 'info test');
    expect(value).not.toHaveProperty('_tags');
  });

  test('"log" should match "value"', () => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);

    expect(msg.log).toStrictEqual(msg.value);
  });

  test('"throw" should throw the error passed to the log', () => {
    const msg = new LogMessage({ ...logData.error }, defaultOpts);

    expect(() => msg.throw).toThrow('error test');
  });

  test('"throw" should include access to LogMessage instance in thrown error', () => {
    const msg = new LogMessage({ ...logData.error }, defaultOpts);

    try {
      return msg.throw;
    } catch(err) {
      expect(err.log).toBeInstanceOf(LogMessage);
    }
  });

  test('"throw" should throw a new error for non-errors passed to the log', () => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);

    expect(() => msg.throw).toThrow('info test');
  });
});

describe('Setters', () => {
  test('set "msg" should overwrite the log message', () => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);
    msg.msg = 'test';

    expect(msg.msg).toBe('test');
  });

  test('set "message" should overwrite the log message', () => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);
    msg.message = 'test';

    expect(msg.message).toBe('test');
  });

  test('set "meta" should add additional properties to the log message', () => {
    const msg = new LogMessage({ ...logData.info, meta: { custom: 123 } }, defaultOpts);
    msg.meta = { prop: 'test' };

    expect(msg.meta).toHaveProperty('prop', 'test');
    expect(msg.meta).toHaveProperty('custom', 123);
  });

  test('set "tags" should add new tags to the log message', () => {
    const msg = new LogMessage({ ...logData.info, tags: ['test'] }, defaultOpts);
    msg.tags = ['another-tag'];

    expect(msg.tags).toHaveLength(2);
    expect(msg.tags).toContain('test');
    expect(msg.tags).toContain('another-tag');
  });
});

describe('Methods', () => {
  describe('toJSON()', () => {
    const msg = new LogMessage({ ...logData.info }, {
      ...defaultOpts,
      meta: { ssn: '444-55-6666' },
      replacer(key, value) {
        if(key === 'ssn') {
          return `${value.substr(0, 3)}-**-****`;
        }

        return value;
      }
    });

    test('should return log in JSON format', () => {
      expect(typeof msg.toJSON()).toBe('string');
      expect(msg.toJSON()).toMatch(/^\{.*\}$/);
    });

    test('should run replacer function', () => {
      expect(JSON.parse(msg.toJSON()).ssn).toBe('444-**-****');
    });

    test('should not run replacer function when not defined', () => {
      const msg = new LogMessage({ ...logData.info }, {
        ...defaultOpts,
        meta: { ssn: '444-55-6666' }
      });

      expect(JSON.parse(msg.toJSON()).ssn).toBe('444-55-6666');
    });

    test('should pretty print JSON when format is "true"', () => {
      expect(/\n/g.test(msg.toJSON(true))).toBe(true);
    });
  });
});

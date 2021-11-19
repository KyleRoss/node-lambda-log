/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'expect-more-jest';
import LogMessage from './LogMessage';
import { StubbedError } from './typings';

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

describe('LogMessage', () => {
  it.each([
    ['__msg', logData.info.msg],
    ['__meta', {}],
    ['__tags', []],
    ['__error', null],
    ['__opts', defaultOpts]
  ])('should set property %s on class', (key, expected) => {
    const msg = new LogMessage({ ...logData.info }, defaultOpts);

    expect(msg[key]).toStrictEqual(expected);
  });

  it.each([
    ['string', 'string meta'],
    ['array', ['array', 'meta']],
    ['boolean', true],
    ['number', 123]
  ])('should convert non-object (%s) meta to an object', (_, value) => {
    const msg = new LogMessage({
      ...logData.info,
      meta: value as any
    }, defaultOpts);

    expect(msg.__meta).toStrictEqual({ meta: value });
  });

  it('should set log meta as an empty object if not provided', () => {
    const msg = new LogMessage({ ...logData.info, meta: undefined }, defaultOpts);

    expect(msg.__meta).toStrictEqual({});
  });

  it('should set log tags as an empty array if not provided', () => {
    const msg = new LogMessage({ ...logData.info, tags: undefined }, defaultOpts);

    expect(msg.__tags).toStrictEqual([]);
  });

  it('should update all properties when an error is passed in', () => {
    const msg = new LogMessage({ ...logData.error }, defaultOpts);

    expect(msg.__msg).toBe('error test');
    expect(msg.__error).toStrictEqual(logData.error.msg);
    expect(msg.__meta.stack).toBe(logData.error.msg.stack);
  });


  describe('Getters', () => {
    it('"level" should return the log level', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);

      expect(msg.level).toBe('info');
    });

    it('"msg" and "message" should return the log message', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);

      expect(msg.msg).toBe('info test');
      expect(msg.message).toBe(msg.msg);
    });

    it('"meta" should return metadata object', () => {
      const msg = new LogMessage({ ...logData.withMeta }, defaultOpts);

      expect(msg.meta).toHaveProperty('test', true);
    });

    it('"meta" should combine all metadata', () => {
      const msg = new LogMessage({ ...logData.withMeta }, {
        ...defaultOpts,
        meta: { foo: 'bar' },
        dynamicMeta: () => ({ dynamic: 'meta' })
      });

      expect(msg.meta).toHaveProperty('test', true);
      expect(msg.meta).toHaveProperty('foo', 'bar');
      expect(msg.meta).toHaveProperty('dynamic', 'meta');
    });

    it('"meta" should call dynamicMeta', () => {
      const msg = new LogMessage({ ...logData.info }, {
        ...defaultOpts,
        dynamicMeta(cls, opts) {
          expect(this).toBeInstanceOf(LogMessage);
          expect(cls).toBeInstanceOf(LogMessage);
          expect(typeof opts).toBe('object');
          return { dynamic: 'meta' };
        }
      });

      expect(msg.meta).toBeEmptyObject();
    });

    it('"meta" should skip dynamicMeta if function does not return an object', () => {
      const msg = new LogMessage({ ...logData.info }, {
        ...defaultOpts,
        dynamicMeta: false
      });

      expect(msg.meta).toHaveProperty('dynamic', 'meta');
    });

    it('"meta" should convert errors in metadata to object', () => {
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

    it('"tags" should return tags array', () => {
      const msg = new LogMessage({ ...logData.withTags }, defaultOpts);

      expect(Array.isArray(msg.tags)).toBe(true);
      expect(msg.tags).toHaveLength(1);
      expect(msg.tags).toContain('test');
    });

    it('"tags" should combine all tags', () => {
      const msg = new LogMessage({ ...logData.withTags }, {
        ...defaultOpts,
        tags: ['global']
      });

      expect(msg.tags).toHaveLength(2);
      expect(msg.tags).toContain('test');
      expect(msg.tags).toContain('global');
    });

    it('"tags" should execute functions', () => {
      const msg = new LogMessage({ ...logData.info }, {
        ...defaultOpts,
        tags: [function (this: typeof LogMessage, props) {
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

    it('"tags" should replace <<level>> variable with log level', () => {
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

    it('"value" should return log object', () => {
      const msg = new LogMessage({ ...logData.info, meta: { test: true }, tags: ['test'] }, defaultOpts);
      const { value } = msg;

      expect(value).toHaveProperty('_logLevel', 'info');
      expect(value).toHaveProperty('msg', 'info test');
      expect(value).toHaveProperty('test', true);
      expect(value).toHaveProperty('_tags', ['test']);
    });

    it('"value" should change key names based on options', () => {
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

    it('"value" should hide level and tags when options is set to falsy value', () => {
      const msg = new LogMessage({ ...logData.info, tags: ['test'] }, {
        ...defaultOpts,
        levelKey: false,
        tagsKey: false,
        messageKey: undefined
      });
      const { value } = msg;

      expect(value).not.toHaveProperty('__level');
      expect(value).toHaveProperty('msg', 'info test');
      expect(value).not.toHaveProperty('__tags');
    });

    it('"value" should default level and tags key when set to null or undefined', () => {
      const msg = new LogMessage({ ...logData.info, tags: ['test'] }, {
        ...defaultOpts,
        levelKey: undefined,
        tagsKey: undefined
      });
      const { value } = msg;

      expect(value).toHaveProperty('__level');
      expect(value).toHaveProperty('__tags');
    });

    it('"value" should compile the log with `onCompile` is set in the options', () => {
      const msg = new LogMessage({ ...logData.info, meta: { test: true }, tags: ['test'] }, {
        ...defaultOpts,
        onCompile(level, msg, meta, tags) {
          return {
            testLevel: level,
            testMsg: msg,
            testMeta: meta,
            testTags: tags
          };
        }
      });

      const { value } = msg;

      expect(value).toHaveProperty('testLevel', 'info');
      expect(value).toHaveProperty('testMsg', 'info test');
      expect(value).toHaveProperty('testMeta', { test: true });
      expect(value).toHaveProperty('testTags', ['test']);
    });

    it('"log" should match "value"', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);

      expect(msg.log).toStrictEqual(msg.value);
    });

    it('"throw" should throw the error passed to the log', () => {
      const msg = new LogMessage({ ...logData.error }, defaultOpts);

      expect(() => msg.throw).toThrow('error test');
    });

    it('"throw" should include access to LogMessage instance in thrown error', () => {
      const msg = new LogMessage({ ...logData.error }, defaultOpts);

      try {
        return msg.throw;
      } catch(err: unknown) {
        expect((err as StubbedError).log).toBeInstanceOf(LogMessage);
      }
    });

    it('"throw" should throw a new error for non-errors passed to the log', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);

      expect(() => msg.throw).toThrow('info test');
    });
  });


  describe('Setters', () => {
    it('set "msg" should overwrite the log message', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);
      msg.msg = 'test';

      expect(msg.msg).toBe('test');
    });

    it('set "msg" should utilize `onParse` if set in the options', () => {
      const msg = new LogMessage({ ...logData.info }, {
        ...defaultOpts,
        onParse(msg) {
          return { msg: `${msg as string} custom`, meta: { test: 'meta' }, tags: ['custom'], error: new Error('custom error') };
        }
      });

      expect(msg.msg).toBe('info test custom');
      expect(msg.meta).toHaveProperty('test', 'meta');
      expect(msg.tags).toHaveLength(1);
      expect(msg.tags).toContain('custom');
      expect(msg.__error).toBeInstanceOf(Error);
      expect((msg.__error!).message).toBe('custom error');
    });

    it('set "msg" should skip `onParse` if the custom function does not return an object', () => {
      const msg = new LogMessage({ ...logData.info }, {
        ...defaultOpts,
        onParse() {
          return false;
        }
      });

      expect(msg.msg).toBe('info test');
      expect(msg.tags).toHaveLength(0);
      expect(msg.__error).toBe(null);
    });

    it('set "msg" should json stringify a message that is an object', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);
      msg.msg = { test: true } as any;

      expect(msg.msg).toBe('{"test":true}');
    });

    it('set "msg" should return empty string if message is null or undefined', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);

      msg.msg = null as any;
      expect(msg.msg).toBe('');

      msg.msg = undefined as any;
      expect(msg.msg).toBe('');
    });

    it('set "message" should overwrite the log message', () => {
      const msg = new LogMessage({ ...logData.info }, defaultOpts);
      msg.message = 'test';

      expect(msg.message).toBe('test');
    });

    it('set "meta" should add additional properties to the log message', () => {
      const msg = new LogMessage({ ...logData.info, meta: { custom: 123 } }, defaultOpts);
      msg.meta = { prop: 'test' };

      expect(msg.meta).toHaveProperty('prop', 'test');
      expect(msg.meta).toHaveProperty('custom', 123);
    });

    it('set "tags" should add new tags to the log message', () => {
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
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call
            return `${value.substr(0, 3)}-**-****`;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return value;
        }
      });

      it('should return log in JSON format', () => {
        expect(typeof msg.toJSON()).toBe('string');
        expect(msg.toJSON()).toMatch(/^\{.*\}$/);
      });

      it('should run replacer function', () => {
        expect(JSON.parse(msg.toJSON()).ssn).toBe('444-**-****');
      });

      it('should not run replacer function when not defined', () => {
        const msg = new LogMessage({ ...logData.info }, {
          ...defaultOpts,
          meta: { ssn: '444-55-6666' }
        });

        expect(JSON.parse(msg.toJSON()).ssn).toBe('444-55-6666');
      });

      it('should pretty print JSON when format is "true"', () => {
        expect(/\n/g.test(msg.toJSON(true))).toBe(true);
      });
    });

    describe('toString()', () => {
      it('should return log in string format', () => {
        const msg = new LogMessage({ ...logData.info }, defaultOpts);

        expect(typeof msg.toString()).toBe('string');
      });

      it('should format as json with onFormat set to `json`', () => {
        const msg = new LogMessage({ ...logData.info }, {
          ...defaultOpts,
          onFormat: 'json'
        });

        expect(msg.toString()).toMatch(/^\{.*\}$/);
      });

      it('should format with "clean" template with onFormat set to `clean`', () => {
        const msg = new LogMessage({ ...logData.info, tags: ['test'] }, {
          ...defaultOpts,
          onFormat: 'clean'
        });

        expect(msg.toString()).toMatch(/^INFO\tinfo test\n\t├→ test/);
      });

      it('should not add tags when none are set in `clean` formatter', () => {
        const msg = new LogMessage({ ...logData.info, meta: { test: 123 } }, {
          ...defaultOpts,
          onFormat: 'clean'
        });

        expect(msg.toString()).toMatch(/^INFO\tinfo test\n\t└→ \{/);
      });

      it('should format with "minimal" template with onFormat set to `minimal`', () => {
        const msg = new LogMessage({ ...logData.info }, {
          ...defaultOpts,
          onFormat: 'minimal'
        });

        expect(msg.toString()).toMatch(/^INFO\tinfo test$/);
      });

      it('should format with a custom `onFormat` function', () => {
        const msg = new LogMessage({ ...logData.info }, {
          ...defaultOpts,
          tags: ['tag1', 'tag2'],
          onFormat(message: LogMessage, opts, stringify) {
            expect(stringify).toBeInstanceOf(Function);

            return `custom ${message.msg} ${opts.tags ? opts.tags.join('|') : ''}`;
          }
        });

        expect(msg.toString()).toBe('custom info test tag1|tag2');
      });
    });
  });
});

import 'expect-more-jest';
import stringify from 'fast-safe-stringify';
import LogMessage from '../LogMessage';
import jsonFormatter from './json';

const defaultOpts = {
  meta: {},
  dynamicMeta: null,
  tags: [],
  levelKey: '_logLevel',
  messageKey: 'msg',
  tagsKey: '_tags',
  replacer: null
};

const logObject = {
  level: 'info',
  msg: 'info test',
  meta: {},
  tags: []
};


describe('formatters/json', () => {
  it('should export a closure function', () => {
    expect(typeof jsonFormatter).toBe('function');
  });

  it('should return a formatter function', () => {
    expect(typeof jsonFormatter()).toBe('function');
  });

  const replacerOpts = {
    ...defaultOpts,
    meta: { ssn: '444-55-6666' },
    replacer(key: string, value: unknown) {
      if(key === 'ssn') {
        return `${(value as string).substring(0, 3)}-**-****`;
      }

      return value;
    }
  };

  const msg = new LogMessage({ ...logObject }, replacerOpts);

  const formatter = jsonFormatter();
  const result = formatter(msg, replacerOpts, stringify);

  it('should return log in JSON format', () => {
    expect(result).toBeJsonString();
  });

  it('should run replacer function', () => {
    expect(JSON.parse(result).ssn).toBe('444-**-****');
  });

  it('should not run replacer function when not defined', () => {
    const msgNoReplacer = new LogMessage({ ...logObject }, {
      ...defaultOpts,
      meta: { ssn: '444-55-6666' }
    });

    const noReplacerResult = formatter(msgNoReplacer, defaultOpts, stringify);

    expect(JSON.parse(noReplacerResult).ssn).toBe('444-55-6666');
  });

  it('should pretty print JSON when dev is "true"', () => {
    const opts = {
      ...defaultOpts,
      dev: true,
      meta: { ssn: '444-55-6666' }
    };

    const msgDev = new LogMessage({ ...logObject }, opts);
    const prettyResult = formatter(msgDev, opts, stringify);

    expect(/\n/g.test(prettyResult)).toBe(true);
  });
});

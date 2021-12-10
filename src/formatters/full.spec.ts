import 'expect-more-jest';
import stringify from 'fast-safe-stringify';
import LogMessage from '../LogMessage';
import fullFormatter from './full';

const defaultOpts = {
  meta: {},
  dynamicMeta: null,
  tags: [],
  levelKey: '_logLevel',
  messageKey: 'msg',
  tagsKey: '_tags',
  replacer: null
};

describe('formatters/full', () => {
  it('should export a closure function', () => {
    expect(typeof fullFormatter).toBe('function');
  });

  it('should return a formatter function', () => {
    expect(typeof fullFormatter()).toBe('function');
  });

  it('should overrride configuration', () => {
    const formatter = fullFormatter({
      includeTimestamp: false,
      includeTags: false,
      includeMeta: false,
      separator: '\t',
      inspectOptions: {
        colors: false,
        maxArrayLength: 25
      }
    });

    const cfg = formatter._cfg!;

    expect(cfg.includeTimestamp).toBe(false);
    expect(cfg.includeTags).toBe(false);
    expect(cfg.includeMeta).toBe(false);
    expect(cfg.separator).toBe('\t');
    expect(cfg.inspectOptions).toEqual({
      depth: Infinity,
      colors: false,
      maxArrayLength: 25
    });
  });

  it('should skip the timestamp if includeTimestamp is false', () => {
    const msg = new LogMessage({
      level: 'info',
      msg: 'info test',
      meta: {},
      tags: []
    }, defaultOpts);

    const formatter = fullFormatter({
      includeTimestamp: false
    });

    expect(formatter(msg, defaultOpts, stringify)).toMatch(/^INFO\tinfo test$/);
  });
});

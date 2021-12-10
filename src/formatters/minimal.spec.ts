import 'expect-more-jest';
import stringify from 'fast-safe-stringify';
import LogMessage from '../LogMessage';
import minimalFormatter from './minimal';

const defaultOpts = {
  meta: {},
  dynamicMeta: null,
  tags: [],
  levelKey: '_logLevel',
  messageKey: 'msg',
  tagsKey: '_tags',
  replacer: null
};

describe('formatters/minmal', () => {
  it('should export a closure function', () => {
    expect(typeof minimalFormatter).toBe('function');
  });

  it('should return a formatter function', () => {
    expect(typeof minimalFormatter()).toBe('function');
  });

  it('should overrride configuration', () => {
    const formatter = minimalFormatter({
      includeTimestamp: false,
      separator: '\t'
    });

    const cfg = formatter._cfg!;

    expect(cfg.includeTimestamp).toBe(false);
    expect(cfg.separator).toBe('\t');
  });

  it('should format timestamp as ISO string by default', () => {
    const formatter = minimalFormatter();

    // @ts-expect-error - we're testing the internals here
    expect((formatter._cfg!).formatTimestamp(new Date())).toMatch(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/);
  });

  it('should include the timestamp if includeTimestamp is true', () => {
    const msg = new LogMessage({
      level: 'info',
      msg: 'info test',
      meta: {},
      tags: []
    }, defaultOpts);

    const formatter = minimalFormatter({
      includeTimestamp: true
    });

    expect(formatter(msg, defaultOpts, stringify)).toMatch(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z) | INFO | info test$/);
  });

  it('should skip the timestamp if includeTimestamp is false', () => {
    const msg = new LogMessage({
      level: 'info',
      msg: 'info test',
      meta: {},
      tags: []
    }, defaultOpts);

    const formatter = minimalFormatter({
      includeTimestamp: false
    });

    expect(formatter(msg, defaultOpts, stringify)).toMatch(/^INFO | info test$/);
  });
});

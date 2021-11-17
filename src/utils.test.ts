import { StubbedError } from './typings';
import { isError, stubError, toBool } from './utils';

interface TestError extends StubbedError {
  test?: boolean;
}

describe('utils', () => {
  describe('isError()', () => {
    it('should return true for an Error', () => {
      expect(isError(new Error('test'))).toBe(true);
    });

    it('should return true for an Error-like object', () => {
      expect(isError({
        message: 'test',
        stack: 'stack'
      })).toBe(true);
    });

    it('should return false for anything else', () => {
      expect(isError(null)).toBe(false);
      expect(isError(true)).toBe(false);
      expect(isError(123)).toBe(false);
      expect(isError('A string')).toBe(false);
      expect(isError({ message: 'test' })).toBe(false);
      expect(isError([1, 2, 3, 'test'])).toBe(false);
      expect(isError({ stack: 'stack' })).toBe(false);
    });
  });

  describe('stubError()', () => {
    it('should add a toJSON method to an error', () => {
      const err = stubError(new Error('test'));
      expect(err).toHaveProperty('toJSON');
      expect(typeof err.toJSON).toBe('function');
    });

    it('calling toJSON should create an serializable object', () => {
      const e = new Error('test') as TestError;
      e.test = true;
      const err = stubError(e);
      const result = err.toJSON!();

      expect(typeof result).toBe('object');
      expect(result).toHaveProperty('name', 'Error');
      expect(result).toHaveProperty('message', 'test');
      expect(result).toHaveProperty('stack', err.stack);
      expect(result).toHaveProperty('test', true);
    });

    it('should skip custom toJSON fn if error already has one', () => {
      const e = new Error('test');
      const noop = () => { /* noop */ };
      Object.defineProperty(e, 'toJSON', {
        value: noop
      });

      const error = stubError(e);
      expect(error.toJSON!.toString()).toBe(noop.toString());
    });
  });

  describe('toBool()', () => {
    it.each([
      ['true', true],
      ['false', false],
      ['1', true],
      ['0', false],
      ['yes', true],
      ['no', false],
      ['y', true],
      ['n', false],
      ['on', true],
      ['off', false],
      ['', false],
      ['test', false],
      [null, false],
      [undefined, false],
      [1, true],
      [0, false]
    ])('should accept "%s" and return %p', (input, expected) => {
      expect(toBool(input as any)).toBe(expected);
    });
  });
});

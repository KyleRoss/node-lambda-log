import { GenericRecord, StubbedError } from './typings';

/**
 * Checks if value is an Error or Error-like object
 * @param {any} val The value to check
 * @returns {boolean} Whether the value is an Error or Error-like object
 */
export function isError(val: unknown) {
  return Boolean(val) && typeof val === 'object' && (
    val instanceof Error || (
      Object.prototype.hasOwnProperty.call(val, 'message') &&
      Object.prototype.hasOwnProperty.call(val, 'stack')
    )
  );
}

/**
 * Stubs an Error or Error-like object to include a toJSON method.
 * @param {Error} error The error to stub.
 * @returns {StubbedError} The original error object with a toJSON method.
 */
export function stubError(error: Error) {
  const err = error as StubbedError;

  if(typeof err.toJSON === 'function') return err;

  err.toJSON = function () {
    const keys = [
      'name',
      'message',
      'stack'
    ].concat(Object.keys(err));

    return keys.reduce((obj: GenericRecord, key) => {
      if(key in err) {
        const val: unknown = err[key];
        if(typeof val !== 'function') {
          obj[key] = val;
        }
      }

      return obj;
    }, {});
  };

  return err;
}

/**
 * Converts a string or number value to a boolean.
 * @param {string|number|boolean} val The value to convert.
 * @returns {boolean} The converted value as a boolean.
 */
export function toBool(val: string | number | boolean) {
  if(typeof val === 'string') {
    return ['true', 'yes', 'y', 'on', '1'].includes(val.toLowerCase());
  }

  if(typeof val === 'number') {
    return val === 1;
  }

  return Boolean(val);
}

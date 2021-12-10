import { FormatPlugin } from '../typings.js';

/**
 * JSON formatter for log messages.
 * @returns {FormatPlugin} The JSON formatter function.
 */
export default function jsonFormatter(): FormatPlugin {
  const jsonFmt: FormatPlugin = (ctx, options, stringify): string =>
    stringify(ctx.value, options.replacer ?? undefined, options.dev ? 2 : 0);

  return jsonFmt;
}

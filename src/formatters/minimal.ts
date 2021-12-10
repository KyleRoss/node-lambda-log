import { FormatPlugin } from '../typings.js';

type MinimalFormatterCfg = {
  includeTimestamp?: boolean;
  formatTimestamp?: (timestamp: Date) => string;
  separator?: string;
};

/**
 * Minimal formatter for log messages.
 * @param {object} cfg  Configuration object for the formatter.
 * @returns {FormatPlugin} The minimal formatter function.
 */
export default function minimalFormatter(cfg: MinimalFormatterCfg = {}): FormatPlugin {
  const fmCfg = {
    includeTimestamp: false,
    formatTimestamp: (timestamp: Date) => timestamp.toISOString(),
    separator: ' | ',
    ...cfg
  };

  const minimalFmt: FormatPlugin = (ctx): string => {
    const parts = [];
    if(fmCfg.includeTimestamp) {
      parts.push(fmCfg.formatTimestamp(new Date()));
    }

    parts.push(ctx.level.toUpperCase(), ctx.msg);

    return parts.join(fmCfg.separator);
  };

  minimalFmt._cfg = fmCfg;

  return minimalFmt;
}

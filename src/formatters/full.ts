import { FormatPlugin } from '../typings.js';
import { inspect, InspectOptions } from 'util';

type FullFormatterCfg = {
  includeTimestamp?: boolean;
  formatTimestamp?: (timestamp: Date) => string;
  includeTags?: boolean;
  includeMeta?: boolean;
  separator?: string;
  inspectOptions?: InspectOptions;
};

/**
 * Full formatter for log messages.
 * @param {object} cfg  Configuration object for the formatter.
 * @returns {FormatPlugin} The full formatter function.
 */
export default function fullFormatter(cfg: FullFormatterCfg = {}): FormatPlugin {
  const fmCfg = {
    includeTimestamp: true,
    formatTimestamp: (timestamp: Date) => timestamp.toISOString(),
    includeTags: true,
    includeMeta: true,
    separator: '\t',
    ...cfg
  };

  fmCfg.inspectOptions = {
    depth: Infinity,
    colors: true,
    ...(fmCfg.inspectOptions ?? {})
  };

  const fullFmt: FormatPlugin = (ctx): string => {
    const msg = [];
    if(fmCfg.includeTimestamp) {
      msg.push(fmCfg.formatTimestamp(new Date()));
    }

    msg.push(ctx.level.toUpperCase(), ctx.msg);

    const parts = [
      msg.join(fmCfg.separator)
    ];

    if(fmCfg.includeTags && ctx.tags.length) {
      const tags = ctx.tags.map(tag => `${tag}`).join(', ');
      parts.push(`→ ${tags}`);
    }

    if(fmCfg.includeMeta && Object.keys(ctx.meta).length) {
      const meta = inspect(ctx.meta, fmCfg.inspectOptions!);
      parts.push(`→ ${meta.replace(/\n/g, '\n  ')}`);
    }

    return parts.join('\n');
  };

  fullFmt._cfg = fmCfg;

  return fullFmt;
}

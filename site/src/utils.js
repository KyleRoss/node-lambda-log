import striptags from 'striptags';

export function urlSafeMarkdownHeading(heading) {
  let str = heading.toLowerCase();
  str = striptags(str)
    .replace(/\s/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return str;
}

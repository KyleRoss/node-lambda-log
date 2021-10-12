import { promisify } from 'util';
import { readFile } from 'fs/promises';
import path from 'path';
import g from 'glob';

const glob = promisify(g);

const globOptions = {};

async function getDocumentList(version) {
  const versionedFiles = await glob(`docs/${version}/**/*.mdx`, globOptions);
  const commonFiles = await glob('docs/*.mdx', globOptions);

  const files = versionedFiles.map(file => {
    let slug = path.basename(file, '.mdx');

    if(slug === 'index') {
      slug = '';
    }

    return {
      slug,
      version: path.dirname(file).replace(/docs\//, ''),
      path: file
    };
  });

  commonFiles.forEach(file => {
    const slug = path.basename(file, '.mdx');
    const isVersioned = files.find(vf => vf.slug === slug);

    if(!isVersioned) {
      files.push({
        slug,
        version: null,
        path: file
      });
    }
  });

  return files;
}


async function getDocumentContent(version, slug) {
  const files = await getDocumentList(version);
  const file = files.find(vf => vf.slug === slug);

  if(!file) throw new Error('Unable to locate the document requested');

  const content = await readFile(path.join(process.cwd(), file.path), { encoding: 'utf-8' });

  return content;
}


async function getNavigation(version) {
  const content = (await import(`@/docs/${version}/_nav.js`)).default;

  return content;
}

export {
  getDocumentList,
  getDocumentContent,
  getNavigation
};

/* eslint-disable react/no-danger */
import React from 'react';
import PropTypes from 'prop-types';
import NextHead from 'next/head';
import { useRouter } from 'next/router';

const siteUrl = 'https://lambdalog.dev';

const metaDefaults = {
  description: 'Node.js package to enforce standards when logging to CloudWatch from Lambda functions, other AWS services, or anywhere you desire JSON-formatted logs.',
  ogImage: 'https://lambdalog.dev/og-image.png',
  ogType: 'website'
};

/**
 * Ensures the passed URL contains the site domain.
 * @param {string} url The URL to ensure contains the site domain.
 * @return {string}  The formatted URL with the site domain included.
 */
function ensureDomain(url) {
  if(!url) return null;
  if(/^https?:\/\//.test(url)) return url;

  return `${siteUrl}${/^\//.test(url) ? '' : '/'}${url}`;
}

/**
 * Compiles the passed metadata into a uniform object with proper defaults.
 * @param {object} meta Raw metadata object passed into the component.
 * @param {string} path The current path from Next Router.
 * @return {object}  The normalized metadata object.
 */
function buildMetadata(meta, path) {
  const baseTitle = meta.baseTitle || 'LambdaLog';
  const title = meta.title || '';
  const description = meta.description || meta.ogDescription || metaDefaults.description;
  const ogUrl = ensureDomain(meta.ogUrl || path);
  const canonicalUrl = ensureDomain(meta.canonicalUrl) || ogUrl;
  const ogTitle = meta.ogTitle || title;
  const ogDescription = meta.ogDescription || description;
  const ogImage = ensureDomain(meta.ogImage || metaDefaults.ogImage);

  const fullTitle = [baseTitle];
  if(title) fullTitle.push(title);

  return {
    title: fullTitle.join(' | '),
    description,
    canonicalUrl,
    ogUrl,
    ogTitle: fullTitle.join(' | '),
    ogDescription,
    ogType: meta.ogType || metaDefaults.ogType,
    ogImage,
    twitterTitle: meta.twitterTitle || ogTitle,
    twitterDescription: meta.twitterDescription || ogDescription,
    twitterImage: ensureDomain(meta.twitterImage || ogImage)
  };
}

const Head = ({ meta, schema, children, noIndex = false }) => {
  const router = useRouter();
  const metadata = buildMetadata(meta, router?.asPath || '/');
  const copyrightYear = new Date().getFullYear();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [{
      '@id': 'https://lambdalog.dev/#person',
      '@type': 'Person',
      name: 'Kyle Ross',
      jobTitle: 'Software Engineer',
      description: 'Software Engineer in South Carolina. Specializing in JavaScript and Node.js.',
      image: 'https://kyleross.me/static-images/kyle-ross.jpg',
      url: 'https://kyleross.me',
      gender: 'Male',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'SC'
      },
      sameAs: [
        'https://www.linkedin.com/in/kylerross/',
        'https://github.com/KyleRoss',
        'https://www.npmjs.com/~kyleross'
      ]
    }, {
      '@id': 'https://lambdalog.dev/#website',
      '@type': 'WebSite',
      name: 'LambdaLog',
      description: 'Node.js package to enforce standards when logging to CloudWatch from Lambda functions, other AWS services, or anywhere you desire JSON-formatted logs.',
      url: 'https://lambdalog.dev',
      about: { '@id': 'https://lambdalog.dev/#person' },
      copyrightHolder: { '@id': 'https://lambdalog.dev/#person' },
      copyrightYear,
      creator: { '@id': 'https://lambdalog.dev/#person' },
      isFamilyFriendly: true
    }]
  };

  if(schema) {
    if(Array.isArray(schema)) {
      jsonLd['@graph'] = jsonLd['@graph'].concat(schema);
    } else {
      jsonLd['@graph'].push(schema);
    }
  }

  return (
    <NextHead>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta property="og:title" content={metadata.ogTitle} />
      <meta property="og:url" content={metadata.ogUrl} />
      <meta property="og:image" content={metadata.ogImage} />
      <meta property="og:type" content={metadata.ogType} />
      <meta property="og:description" content={metadata.ogDescription} />
      <meta name="twitter:title" content={metadata.twitterTitle} />
      <meta name="twitter:description" content={metadata.twitterDescription} />
      <meta name="twitter:creator" content="@kylerross" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={metadata.twitterImage} />
      {noIndex && (
        <meta name="robots" content="noindex" />
      )}
      <link rel="canonical" href={metadata.canonicalUrl} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd, null, 2) }} />

      {children}
    </NextHead>
  );
};

const schemaObject = {
  /**
   * The ID for the schema object. The ID must be in the format: "https://lambdalog.dev/#ID".
   */
  '@id': PropTypes.string.isRequired,
  /**
   * The schema type for this object. See https://schema.org/docs/full.html for a list of types.
   */
  '@type': PropTypes.string.isRequired
};

Head.propTypes = {
  /**
   * Metadata to set in the head for the page as an object. The only required property is **title**, the rest are
   * defaulted from other properties. Pass any additional properties to override the default for the page.
   */
  meta: PropTypes.shape({
    /**
     * The title of the page.
     */
    title: PropTypes.string.isRequired,
    /**
     * The base title for the page. By default, this is set to "LambdaLog" but it may be overridden.
     */
    baseTitle: PropTypes.string,
    /**
     * The meta description for the page. This is defaulted to `ogDescription` or a hardcoded description.
     */
    description: PropTypes.string,
    /**
     * The canonical URL for the page. If not provided, this is automatically generated from the current page path.
     */
    canonicalUrl: PropTypes.string,
    /**
     * The Open Graph URL for the page. If not provided, this is automatically generated from the current page path.
     */
    ogUrl: PropTypes.string,
    /**
     * The Open Graph Title for the page. This value works the same as `title` and will default to the provided `title`.
     */
    ogTitle: PropTypes.string,
    /**
     * The Open Graph Description for the page. This is defaulted to `description` or a hardcoded description.
     */
    ogDescription: PropTypes.string,
    /**
     * The Open Graph Type for this page. Must be one of "website", "article", or "profile". Defaults to "website".
     */
    ogType: PropTypes.oneOf(['website', 'article', 'profile']),
    /**
     * The Open Graph Image for this page. It must either be the absolute path to the image with or without the site
     * domain. Defaults to a standard image.
     */
    ogImage: PropTypes.string,
    /**
     * The Twitter Title for the page. Defaults to `ogTitle` or `title`.
     */
    twitterTitle: PropTypes.string,
    /**
     * The Twitter Description for the page. Defaults to `ogDescription` or `description`.
     */
    twitterDescription: PropTypes.string,
    /**
     * The Twitter Image for the page. Defaults to `ogImage`.
     */
    twitterImage: PropTypes.string
  }).isRequired,

  /**
   * Additional JSON+LD data to add to the page. Can either be an array of schema objects or a single schema
   * object. See https://schema.org/docs/full.html for more information.
   */
  schema: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape(schemaObject)
    ),
    PropTypes.shape(schemaObject)
  ]),

  /**
   * Include additional elements into the `<head>` for the specific page.
   */
  children: PropTypes.node,
  /**
   * Disable search engine indexing for the page. Adds a meta tag with `noindex` to the `<head>`. You should
   * also add an exclude pattern to `next-sitemap.js` as well.
   */
  noIndex: PropTypes.bool
};

export default Head;

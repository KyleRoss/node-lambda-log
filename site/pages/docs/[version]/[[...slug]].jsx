import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemote } from 'next-mdx-remote';
import matter from 'gray-matter';
import clsx from 'clsx';
import { Tab, Tabs, TabList, TabPanels, TabPanel } from '@reach/tabs';
import { MdMenuOpen, MdClose } from 'react-icons/md';
import torchlight from 'remark-torchlight';
import remarkContainers from 'remark-containers';
import remarkHint from 'remark-hint';
import rehypeSlug from 'rehype-slug';
import remarkCodeTabs from '@utils/remarkCodeTabs';
import { BreakpointContext } from '@utils/BreakpointContext';
import { getDocumentList, getDocumentContent, getNavigation } from '@utils/docs';
import apiVersions from '@/docs/versions';
import { ApiVersionContext } from '@utils/ApiVersionContext';
import Header from '@components/base/Header';
import Footer from '@components/base/Footer';
import VersionSelect from '@components/VersionSelect';
import Head from '@components/Head';
import Link from '@components/Link';
import ApiHeading from '@components/ApiHeading';
import LinkedHeading from '@components/LinkedHeading';

function asLinkedHeading(as) {
  return props => <LinkedHeading as={as} {...props} />;
}

const DocsPage = ({ meta, nav, source, slug }) => {
  const { version } = useContext(ApiVersionContext);
  const breakpoint = useContext(BreakpointContext);

  function parseVersionedLinks(href) {
    return href.replace(/(\[v\]|%5Bv%5D)/i, version);
  }

  const components = {
    a: ({ href, children, ...props }) => {
      href = parseVersionedLinks(href);
      return <Link href={href} {...props}>{children}</Link>;
    },
    h1: asLinkedHeading('h1'),
    h2: asLinkedHeading('h2'),
    h3: asLinkedHeading('h3'),
    h4: asLinkedHeading('h4'),
    h5: asLinkedHeading('h5'),
    h6: asLinkedHeading('h6'),
    h: ApiHeading,
    scope: ({ text, link, children, ...props }) => {
      return (
        <div className="api-scope" {...props}>
          <small>Scope</small>
          {link ? (
            <Link href={parseVersionedLinks(link)} className="scope-text">{text}</Link>
          ) : (
            <span className="scope-text">{text}</span>
          )}
          {' — '}{children}
        </div>
      );
    },
    since: ({ version, small, className, ...props }) => {
      return (
        <div className={clsx('badge', 'since', small ? 'badge-small' : null, className)} {...props}>
          <span>{version}</span>
        </div>
      );
    },
    deprecated: ({ version, small, className, ...props }) => {
      return (
        <div className={clsx('badge', 'deprecated', small ? 'badge-small' : null, className)} {...props}>
          <span>{version}</span>
        </div>
      );
    },
    Tab,
    Tabs,
    TabList,
    TabPanels,
    TabPanel
  };

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if(breakpoint.isDesktop && menuOpen) {
      setMenuOpen(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breakpoint.isDesktop]);


  return (
    <>
      <Head meta={meta} />
      <Header />

      <main id="maincontent" className="docs-page container-wrapper">
        <button type="button" className={clsx('mobile-menu', menuOpen ? 'menu-open' : null)} aria-label="Open documents menu" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <MdClose /> : <MdMenuOpen />}
        </button>
        <aside className={clsx('docs-sidebar', menuOpen ? 'mobile-open' : null)}>
          <div className="hidden lg:block h-12 pointer-events-none absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-warm-50" />
          <div className="docs-nav-overlay" role="presentation" onClick={() => setMenuOpen(!menuOpen)} onKeyUp={event => event.key === 'Escape' && setMenuOpen(false)} />
          <ul className="docs-nav" role="menu">
            {menuOpen && (
              <li role="menuitem" className="!mb-8">
                <VersionSelect className="block lg:hidden" />
              </li>
            )}
            {nav.map(page => {
              if(page.title) {
                return (
                  <li key={page.title} className="docs-nav-title" role="separator">{page.title}</li>
                );
              }

              const url = `/docs/${version}${page.url ? `/${page.url}` : ''}`;
              const isActive = !page.url ? slug === '' : slug === page.url;

              return (
                <li key={url} role="menuitem">
                  <Link plain href={url} className={clsx('docs-nav-link', isActive ? 'active' : null)} onClick={() => setMenuOpen(false)}>{page.text}</Link>
                </li>
              );
            })}
          </ul>
        </aside>

        <div className="doc-wrapper">
          <h1 className="doc-title">
            {meta.title}
            {meta.description && <small>{meta.description}</small>}
          </h1>
          <div className="doc-content">
            <MDXRemote {...source} components={components} />
          </div>
          <Footer />
        </div>
      </main>
    </>
  );
};

DocsPage.propTypes = {
  meta: PropTypes.object,
  source: PropTypes.object,
  nav: PropTypes.arrayOf(PropTypes.object),
  slug: PropTypes.string
};


export async function getStaticProps({ params }) {
  const slug = params.slug?.[0] ?? '';
  if(params.version === 'latest') {
    params.version = apiVersions[0].value;
  }

  const isValidVersion = apiVersions.find(ver => ver.value === params.version);

  if(!isValidVersion) {
    return { notFound: true };
  }

  const nav = await getNavigation(params.version);
  const doc = await getDocumentContent(params.version, slug);

  const { content, data: meta } = matter(doc);
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [
        [torchlight, {
          config: {
            theme: 'min-light',
            options: {
              diffIndicators: true,
              diffIndicatorsInPlaceOfLineNumbers: true
            }
          }
        }],
        remarkCodeTabs,
        remarkContainers,
        remarkHint
      ],
      rehypePlugins: [
        rehypeSlug
      ]
    }
  });

  return {
    props: {
      slug,
      nav,
      source: mdxSource,
      meta: meta || {}
    }
  };
}

export async function getStaticPaths() {
  const paths = [{ params: { version: 'latest', slug: [] } }];

  for(const ver of apiVersions) {
    // eslint-disable-next-line no-await-in-loop
    const files = await getDocumentList(ver.value);

    paths.push({ params: { version: ver.value, slug: [] } });

    files.forEach(file => {
      const slug = [];
      if(file.slug) slug.push(file.slug);
      paths.push({
        params: { version: ver.value, slug }
      });
    });
  }

  return {
    paths,
    fallback: false
  };
}

export default DocsPage;

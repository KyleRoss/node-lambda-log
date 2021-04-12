import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const meta = {
  description: 'Node.js package to enforce standards when logging to CloudWatch from Lambda functions, other AWS services, or anywhere you desire JSON-formatted logs.',
  image: 'https://KyleRoss.github.io/node-lambda-log/og-image.png'
};

const Head = ({ lang, title }) => {
  return (
    <Helmet>
      <html lang={lang} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Lambda Log | {title}</title>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ef8354" />
      <meta name="apple-mobile-web-app-title" content="Lambda Log" />
      <meta name="application-name" content="Lambda Log" />
      <meta name="msapplication-TileColor" content="#2d3142" />
      <meta name="theme-color" content="#2d3142" />

      <meta name="description" content={meta.description} />
      <meta property="og:title" content="Lambda Log" />
      <meta property="og:description" content={meta.description} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={meta.image} />
      <meta name="twitter:title" content="Lambda Log" />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:creator" content="@kylerross" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={meta.image} />
    </Helmet>
  );
};

Head.defaultProps = {
  lang: 'en'
};

Head.propTypes = {
  lang: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default Head;

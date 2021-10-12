import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const pageProps = this.props?.__NEXT_DATA__?.props?.pageProps;
    return (
      <Html lang="en">
        <Head />
        <body className={pageProps.isDark ? 'dark' : ''}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

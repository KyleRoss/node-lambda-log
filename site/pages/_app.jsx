import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { BreakpointProvider } from '@utils/BreakpointContext';
import { ApiVersionProvider } from '@utils/ApiVersionContext';

import '@fontsource/inter/latin.css';
import '@fontsource/fira-code/latin.css';
import 'tailwindcss/tailwind.css';
import '@styles/globals.css';

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => {
  const router = useRouter();

  useEffect(() => {
    const handleRefocus = () => {
      document.body.focus();
    };

    router.events.on('routeChangeComplete', handleRefocus);

    return () => {
      router.events.off('routeChangeComplete', handleRefocus);
    };
  }, [router]);

  return (
    <BreakpointProvider>
      <ApiVersionProvider>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#ef8354" />
          <meta name="apple-mobile-web-app-title" content="LambdaLog" />
          <meta name="application-name" content="LambdaLog" />
          <meta name="msapplication-TileColor" content="#57534E" />
          <meta name="theme-color" content="#F5F5F4" />
        </Head>

        <Script src="https://www.googletagmanager.com/gtag/js?id=G-2WND0813TV" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-2WND0813TV');
          `}
        </Script>

        <a href="#maincontent" className="plain skip-nav">Skip to main content.</a>

        <Component {...pageProps} />
      </ApiVersionProvider>
    </BreakpointProvider>
  );
};

export default App;

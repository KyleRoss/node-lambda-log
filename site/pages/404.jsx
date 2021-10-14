import React from 'react';
import clsx from 'clsx';
import Logo from '@components/Logo';
import Link from '@components/Link';
import Head from '@components/Head';
import styles from './404.module.css';

const Custom404 = () => {
  const meta = {
    title: 'Node.js Logger for Lambda'
  };

  return (
    <>
      <Head meta={meta} />

      <main className={styles.page}>
        <div className={styles.header}>
          <div className="container-wrapper">
            <Logo withText primaryColor="#FB923C" secondaryColor="#818CF8" className={styles.logo} />
          </div>
        </div>

        <section className={styles.wrapper}>
          <Logo linked={false} className={styles.logo404} />

          <div className={styles.content}>
            <h1>Page Not Found</h1>
            <p>
              The page you are trying to access does not exist.
            </p>

            <Link plain prefetch={false} href="/" className={clsx(styles.btn, styles.home)}>
              Return Home
            </Link>

            <Link plain prefetch={false} href="/docs/latest" className={clsx(styles.btn, styles.docs)}>
              Read the Docs
            </Link>
          </div>
        </section>
      </main>
    </>
  );
};

export default Custom404;

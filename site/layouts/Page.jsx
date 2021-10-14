import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { IoArrowForward, IoDocumentText } from 'react-icons/io5';
import Head from '@components/Head';
import Logo from '@components/Logo';
import Link from '@components/Link';
import Footer from '@components/base/Footer';

import styles from './Page.module.css';

const PageLayout = ({ meta, schema, children }) => {
  return (
    <>
      <Head meta={meta} schema={schema} />
      <header className={styles.header}>
        <div className="container-wrapper">
          <Logo withText primaryColor="#FB923C" secondaryColor="#818CF8" className={styles.logo} />
        </div>
      </header>

      <main id="maincontent" className={styles.main}>
        {children}

        <section className="container-fluid">
          <div className="container-wrapper text-center py-16">
            <h2 className="font-light text-2xl">Ready to use LambdaLog?</h2>

            <Link plain prefetch={false} href="/docs/latest" className={clsx(styles.btn, styles.docs)}>
              <IoDocumentText className="btn-icon" />
              Read the Docs
              <IoArrowForward className="btn-arrow" />
            </Link>
          </div>
        </section>
      </main>

      <Footer variant="main" />
    </>
  );
};

PageLayout.propTypes = {
  meta: PropTypes.object,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default PageLayout;

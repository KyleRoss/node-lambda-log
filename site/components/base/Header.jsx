import React from 'react';
import clsx from 'clsx';
import { IoLogoGithub } from 'react-icons/io5';
import Logo from '@components/Logo';
import Link from '@components/Link';
import VersionSelect from '@components/VersionSelect';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={clsx('container-wrapper', styles.inner)}>
        <div className={styles.headerBrand}>
          <Logo withText linked className={styles.brand} aria-label="Lambda Log Home" />
        </div>
        <div className={styles.headerRight}>
          <VersionSelect className="ml-auto mr-5 hidden lg:block" />

          <Link plain href="https://github.com/KyleRoss/node-lambda-log" className={styles.github} aria-label="View on Github">
            <IoLogoGithub />
          </Link>
        </div>
      </div>
    </header>
  );
};


export default Header;

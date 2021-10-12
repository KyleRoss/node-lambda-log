import React, { useContext } from 'react';
import clsx from 'clsx';
import { IoLogoGithub } from 'react-icons/io5';
import { BreakpointContext } from '@utils/BreakpointContext';
import Logo from '@components/Logo';
import Link from '@components/Link';
import VersionSelect from '@components/VersionSelect';
import styles from './Header.module.css';

const Header = () => {
  const breakpoint = useContext(BreakpointContext);

  return (
    <nav id="navigation" className={clsx(styles.mainNav, (breakpoint.isMobile || breakpoint.isTablet) ? 'mobile-nav' : null)}>
      <div className={clsx('container', styles.navInner)}>
        <Logo withText linked className={styles.navBrand} aria-label="Lambda Log Home" />

        <VersionSelect className="ml-auto mr-5 hidden lg:block" />

        <Link plain href="https://github.com/KyleRoss/node-lambda-log" className={styles.github} aria-label="View on Github">
          <IoLogoGithub />
        </Link>
      </div>
    </nav>
  );
};


export default Header;

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Link from '@components/Link';
import { GoHeart } from 'react-icons/go';
import styles from './Footer.module.css';


const Footer = ({ variant }) => {
  return (
    <footer className={clsx(styles.footer, styles[variant])}>
      <div className={styles.inner}>
        <Link plain href="https://github.com/sponsors/KyleRoss" className={styles.sponsorBtn}>
          <GoHeart />
          Sponsor
        </Link>
        <div className="footer-content">
          <div className={styles.attribution}>
            Made with <span aria-hidden="true">&hearts;</span><span className="sr-only">love</span> by <Link plain href="https://kyleross.me">Kyle Ross</Link>
          </div>
          <ul role="menu" className={styles.links}>
            <li role="menuitem">
              <Link plain href="/license">MIT License</Link>
            </li>
            <li role="menuitem">
              <Link plain href="https://github.com/KyleRoss/node-lambda-log">Github</Link>
            </li>
            <li role="menuitem">
              <Link plain href="https://www.npmjs.com/package/lambda-log">NPM</Link>
            </li>
            <li role="menuitem">
              <Link plain href="https://github.com/KyleRoss/node-lambda-log/discussions">Support</Link>
            </li>
            <li role="menuitem">
              <Link plain href="/contributors">Contributors</Link>
            </li>
          </ul>

          <Link plain href="https://github.com/KyleRoss/node-lambda-log/issues/new/choose" className={styles.issue}>Report Issue</Link>
        </div>
      </div>
    </footer>
  );
};

Footer.propTypes = {
  variant: PropTypes.oneOf(['docs', 'main'])
};

Footer.defaultProps = {
  variant: 'docs'
};

export default Footer;

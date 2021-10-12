import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import styles from './Terminal.module.css';


const Terminal = ({ title, children, className, ...props }) => {
  return (
    <div className={clsx(styles.terminal, className)} {...props}>
      <div className={styles.titleBar}>
        <div className={styles.contextButtons}>
          <span className={styles.close} />
          <span className={styles.minimize} />
          <span className={styles.maximize} />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.spacer} />
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

Terminal.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};


export default Terminal;

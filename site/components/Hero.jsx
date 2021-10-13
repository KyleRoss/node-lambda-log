import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@components/Link';
import { IoArrowForward, IoDocumentText } from 'react-icons/io5';
import { ImGithub, ImNpm } from 'react-icons/im';
import styles from './Hero.module.css';

const Hero = () => {
  const [version, setVersion] = useState(null);
  const [versionDate, setVersionDate] = useState(null);
  const [downloads, setDownloads] = useState(0);

  useEffect(() => {
    async function getNpmVersion() {
      const resp = await fetch('/api/npm-version');
      const data = await resp.json();

      if(data.version) {
        setVersion(data.version);
        setVersionDate(data.date);
      }
    }

    async function getDownloadCount() {
      const resp = await fetch('https://api.npmjs.org/downloads/point/2017-01-01:3000-01-01/lambda-log');
      const data = await resp.json();

      if(data.downloads) {
        setDownloads(data.downloads);
      }
    }

    getNpmVersion();
    getDownloadCount();
  }, []);

  return (
    <section className={clsx('container-fluid', styles.hero)}>
      <div className={clsx('container-wrapper', styles.heroInner)}>
        <div className={styles.heroLeft}>
          <h1 className={clsx('h2', 'mb-2', styles.title)}>The Most Popular Lambda Logger for Node.js<span aria-hidden="true">*</span></h1>
          <div className={styles.downloads}>
            With {downloads.toLocaleString('en-US')} Installs
          </div>
        </div>
        <div className={styles.heroRight}>
          <div className="text-center lg:text-right">
            <div className={styles.version}>
              {version && (
                <Link plain href="https://www.npmjs.com/package/lambda-log">
                  <abbr title={new Date(versionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}>
                    v{version}
                  </abbr>
                </Link>
              )}
            </div>
            <Link plain prefetch={false} href="/docs/latest" className={clsx(styles.btn, styles.docs)}>
              <IoDocumentText className="btn-icon" />
              Read the Docs
              <IoArrowForward className="btn-arrow" />
            </Link>
          </div>
          <div className="flex gap-4 justify-center lg:justify-end mt-12">
            <Link plain href="https://github.com/KyleRoss/node-lambda-log" className={clsx(styles.github)}>
              <ImGithub /> Github
            </Link>
            <Link plain href="https://www.npmjs.com/package/lambda-log" className={clsx(styles.npm)}>
              <ImNpm /> NPM
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.disclaimer}>
        <div className="container-wrapper text-center">
          <span>*</span> LambdaLog can be used <strong>anywhere</strong> JSON logs are desired!
        </div>
      </div>
    </section>
  );
};


export default Hero;

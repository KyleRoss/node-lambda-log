import React from 'react';
import PageLayout from '@/layouts/Page';
import Hero from '@components/Hero';
import Terminal from '@components/Terminal';
import styles from './Home.module.css';

const Home = () => {
  const meta = {
    title: 'Node.js Logging Library'
  };

  return (
    <PageLayout meta={meta}>
      <Hero />

      <section className="container-fluid bg-indigo-900 pt-0 mb-20">
        <Terminal title="Install LambdaLog" className="container-wrapper -bottom-8">
          <div className="line">
            npm install lambda-log
          </div>
        </Terminal>
      </section>

      <section className="container-wrapper">
        <p className="text-lead mb-4">
          LambdaLog facilitates and enforces logging standards in Node.js processes or applications <strong>anywhere</strong> by formatting your
          log messages as JSON for simple parsing and filtering within log management tools, such as CloudWatch Logs. <em>Works with all of the supported versions of Node.js on Lambda.</em>
        </p>
        <p>
          Originally created for AWS Lambda Functions, LambdaLog is a lightweight and feature-rich library that has <strong>no</strong> dependency
          on AWS or Lambda, meaning you can use it in any type of Node.js project you wish.
        </p>
      </section>

      <section className="container-fluid bg-slate-200 mt-12">
        <div className="container-wrapper text-slate-800 py-6">
          <h2 className="text-2xl mb-2 font-medium">Why another <s className={styles.strike}>Lambda</s> logger?</h2>
          <p>
            There are plenty of other logging libraries in the NPM ecosystem but most are convoluted, included more functionality than needed,
            not maintained, or are not configurable enough. LambdaLog was created to include the important functionality from other loggers, but
            still maintaining simplicity with minimal dependencies.
          </p>
        </div>
      </section>

      <section className="container-fluid bg-indigo-800 py-12">
        <div className="container-wrapper">
          <h2 className="text-white mb-1">Features</h2>
          <p className="text-lead text-white mb-8">Anyone can log JSON to the console, but with Lambda Log you also get:</p>
          <div className={styles.featureList}>
            <div className={styles.feature}>
              <strong>Annotate Logs with Tags</strong>
              <p>Add tags to your logs both globally and individually.</p>
            </div>

            <div className={styles.feature}>
              <strong>Include Extra Metadata in Logs</strong>
              <p>Attach additional information to your logs globally and individually.</p>
            </div>

            <div className={styles.feature}>
              <strong>Formatted Errors</strong>
              <p>Errors are parsed to include the relevant information in your logs.</p>
            </div>

            <div className={styles.feature}>
              <strong>Tons of Customization</strong>
              <p>Many options that allow you to make LambdaLog work the way you want without being overwhelming.</p>
            </div>

            <div className={styles.feature}>
              <strong>Pretty-Printing of Logs during Development</strong>
              <p>Pretty print the JSON logs during development, making it easier to read your logs in a terminal.</p>
            </div>

            <div className={styles.feature}>
              <strong>Extensibility</strong>
              <p>Class-based library that allows for advanced customization down to the methods.</p>
            </div>

            <div className={styles.feature}>
              <strong>Excellent Documentation</strong>
              <p>Full documentation and examples that cover every aspect of LambdaLog.</p>
            </div>

            <div className={styles.feature}>
              <strong>Fully Tested</strong>
              <p>100% test coverage to ensure all functionality works in each release.</p>
            </div>

            <div className={styles.feature}>
              <strong>Enterprise Ready</strong>
              <p>MIT Licensed and audited for vulnerabilities.</p>
            </div>

            <div className={styles.feature}>
              <strong>High Performance in a Small Package</strong>
              <p>Only 1 dependency and ~40kB total package size.</p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};


export default Home;

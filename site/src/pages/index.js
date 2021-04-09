import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { OutboundLink } from 'gatsby-plugin-google-gtag';
import Layout from '@layouts';
import { ContentContainer } from '@styles/components';
import TerminalFrame from '@ui/terminal';


const StyledHomePage = styled.div`
  ${ContentContainer}

  .intro {
    font-weight: 400;
    font-size: 1.2rem;
  }

  a.btn {
    display: inline-block;
    border-radius: 5px;
    margin-right: 1rem;
    padding: 0.6rem 1rem;
    color: #fff;
    font-weight: 600;
    transition: background-color 0.2s;

    &.github {
      background-color: ${props => props.theme.colors.primary};

      &:hover {
        background-color: ${props => darken(0.1, props.theme.colors.primary)};
      }
    }

    &.npm {
      background-color: ${props => props.theme.colors.red};

      &:hover {
        background-color: ${props => darken(0.1, props.theme.colors.red)};
      }
    }
  }
`;

const HomePage = () => {
  return (
    <Layout showHero title="Home">
      <StyledHomePage>
        <h1 className="sr-only">Lambda Log</h1>
        <p className="intro">
          A <OutboundLink href="https://www.npmjs.com/package/lambda-log" rel="noreferrer">Node.js package</OutboundLink> to
          facilitate and enforce logging standards from processes and applications running within Lambda Functions, various AWS
          Services, and wherever JSON logs are desired. Lambda Log formats your log messages as JSON for simple parsing and
          filtering within tools such as CloudWatch Logs. Supports <strong>Node 10+</strong>.
        </p>

        <TerminalFrame title="Install Lambda Log">
          <div className="line">
            npm install --save lambda-log
          </div>
        </TerminalFrame>

        <blockquote>
          <strong>Why another Lambda logger?</strong>
          <p>
            There are others out there, but seemed to be convoluted, included more functionality than needed, not maintained,
            or not configurable enough. I created lambda-log to include the important functionality from other loggers, but still
            keeping it simple with minimal dependencies.
          </p>
        </blockquote>

        <h2>Features</h2>
        <p>Anyone can log JSON to the <code>console</code>, but with Lambda Log you also get:</p>
        <ul>
          <li>Metadata and tags that may be set globally or individually for each log message.</li>
          <li>Error and Error-like objects logged include stacktraces in the metadata automatically.</li>
          <li>Each log message emits an event to allow third-party integration.</li>
          <li>Pluggable and customizable by extending the LambdaLog class.</li>
          <li>Pretty-printing of the JSON log message in dev mode.</li>
          <li>Well documented, commented, and maintained source code.</li>
          <li>Over 1 million downloads and more than 20k weekly downloads.</li>
          <li>Small footprint.</li>
        </ul>

        <OutboundLink href="https://github.com/KyleRoss/node-lambda-log" rel="noreferrer" className="plain btn github">View on Github</OutboundLink>
        <OutboundLink href="https://www.npmjs.com/package/lambda-log" rel="noreferrer" className="plain btn npm">View on NPM</OutboundLink>
      </StyledHomePage>
    </Layout>
  );
};

export default HomePage;

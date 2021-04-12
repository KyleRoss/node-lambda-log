import React from 'react';
import styled from 'styled-components';
import { OutboundLink } from 'gatsby-plugin-google-gtag';

const StyledFooter = styled.footer`
  text-align: center;
  padding: 3rem 3rem;
  font-weight: 400;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.gray};

  .heart {
    color: ${props => props.theme.colors.red};
    font-size: 1rem;
  }

  a {
    color: ${props => props.theme.colors.white};

    &:hover {
      color: ${props => props.theme.colors.yellow};
    }
  }
`;

const Footer = () => {
  return (
    <StyledFooter>
      <div className="attribution">
        Made with <span className="heart">&hearts;</span> by <OutboundLink href="https://kyleross.me" rel="noopener" className="plain">Kyle Ross</OutboundLink>
      </div>
      <div className="footer-links">
        <OutboundLink href="https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE" rel="noreferrer" className="plain">MIT License</OutboundLink>{' | '}
        <OutboundLink href="https://github.com/KyleRoss/node-lambda-log" rel="noreferrer" className="plain">Github</OutboundLink>{' | '}
        <OutboundLink href="https://www.npmjs.com/package/lambda-log" rel="noreferrer" className="plain">NPM</OutboundLink>{' | '}
        <OutboundLink href="https://gitter.im/KyleRoss/node-lambda-log" rel="noreferrer" className="plain">Gitter</OutboundLink>
      </div>
    </StyledFooter>
  );
};

export default Footer;

import React from 'react';
import styled from 'styled-components';
import Link from '@ui/link';

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
        Made with <span className="heart">&hearts;</span> by <Link plain href="https://kyleross.me">Kyle Ross</Link>
      </div>
      <div className="footer-links">
        <Link plain href="https://github.com/KyleRoss/node-lambda-log/blob/master/LICENSE">MIT License</Link>{' | '}
        <Link plain href="https://github.com/KyleRoss/node-lambda-log">Github</Link>{' | '}
        <Link plain href="https://www.npmjs.com/package/lambda-log">NPM</Link>{' | '}
        <Link plain href="https://gitter.im/KyleRoss/node-lambda-log">Gitter</Link>
      </div>
    </StyledFooter>
  );
};

export default Footer;

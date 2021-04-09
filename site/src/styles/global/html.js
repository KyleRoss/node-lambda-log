import { css } from 'styled-components';
import { darken } from 'polished';

export default css`
  h1 {
    font-size: 2.8rem;
    font-weight: 200;
    letter-spacing: -2px;
  }

  h2 {
    font-size: 2.4rem;
    font-weight: 300;
    letter-spacing: -1px;
  }

  h3 {
    font-size: 2rem;
    font-weight: 400;
    letter-spacing: -1px;
  }

  h4 {
    font-size: 1.8rem;
    font-weight: 500;
    letter-spacing: -1px;
  }

  h5 {
    font-size: 1.4rem;
    font-weight: 600;
    letter-spacing: -1px;
  }

  h6 {
    font-size: 1.1rem;
    font-weight: 700;
  }

  u {
    text-decoration: none;
    border-bottom: 2px solid;
  }

  code:not([class*="language-"]),
  kbd {
    display: inline-block;
    padding: 0.4rem 0.6rem 0.2rem 0.6rem;
    border-radius: 3px;
    font-family: ${props => props.theme.fonts.monospace};
    font-weight: 400;
    font-size: 0.92rem;
    line-height: 0.95rem;
  }

  code:not([class*="language-"]) {
    padding: 0.3rem 0.3rem 0.2rem 0.3rem;
    background-color: ${props => darken(-0.15, props.theme.colors.gray)};
    color: ${props => darken(-0.1, props.theme.colors.black)};
  }

  kbd {
    border: 1px solid ${props => props.theme.colors.gray};
    background-color: ${props => props.theme.colors.white};
    color: ${props => props.theme.colors.black};
    box-shadow: ${props => `1px 1px 0 0 ${props.theme.colors.gray}`};
    font-weight: bold;
  }

  blockquote {
    margin: 1rem 0;
    padding: 1rem;
    color: ${props => darken(-0.2, props.theme.colors.black)};
    border-left: 5px solid ${props => darken(-0.65, props.theme.colors.black)};
  }

  hr {
    position: relative;
    border: none;
    height: 2px;
    margin: 3rem 0;
    background: ${props => props.theme.colors.gray};
  }

  ul {
    li {
      margin-bottom: 0.2rem;
    }
  }
`;

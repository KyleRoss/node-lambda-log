import { createGlobalStyle } from 'styled-components';
import typography from '@styles/typography';
import linkStyles from '@styles/global/link';
import htmlStyles from '@styles/global/html';

import 'modern-css-reset';
import '@fontsource/fira-sans/latin.css';
import '@fontsource/fira-code/latin.css';


const GlobalStyle = createGlobalStyle`
  ${typography.toString()};

  ::selection {
    color: ${props => props.theme.colors.white};
    background: ${props => props.theme.colors.blue};
    text-shadow: none;
  }

  html {
    height: max-content;
  }

  body {
    min-height: calc(100vh - 70px);
    min-height: stretch;
    color: ${props => props.theme.colors.black};
    background: ${props => props.theme.colors.dark};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #___gatsby,
  #gatsby-focus-wrapper {
    min-height: 100vh;
  }

  ${linkStyles}
  ${htmlStyles}

  .sr-only,
  .sr-only-focusable:not(:focus):not(:focus-within) {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
  }
`;

export default GlobalStyle;

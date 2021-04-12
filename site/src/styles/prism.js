import { css } from 'styled-components';
import { darken } from 'polished';

const colors = {
  black: '#3C3C3C',
  white: '#FFFFFF',
  lightGray: '#f7f8f9',
  gray: '#dde1e5',
  purple: '#c397d8',
  cyan: '#70c0b1',
  blue: '#7aa6da',
  green: '#b9ca4a',
  yellow: '#e7c547',
  orange: '#e78c45',
  red: '#d54e53'
};

const prismTheme = css`
  code[class*="language-"],
  pre[class*="language-"] {
    color: ${colors.lightGray};
    background: transparent;
    font-family: ${props => props.theme.fonts.monospace};
    font-size: 0.95rem;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    tab-size: 2;
    hyphens: none;

    &, & * {
      &::selection {
        background: ${darken(0.6, colors.gray)};
      }
    }
  }

  /* Code blocks */
  pre[class*="language-"] {
    padding: 1.7rem 2rem;
    overflow: auto;
    border-radius: 0.3em;

    &.line-numbers {
      position: relative;
      padding: 1.7rem 2rem;
      padding-left: 4.5em;
      overflow: initial;
      counter-reset: linenumber;

      > code {
        position: relative;
	      white-space: inherit;
      }

      .line-numbers-rows {
        position: absolute;
        pointer-events: none;
        top: 0;
        font-size: 100%;
        left: -3.8em;
        width: 3em;
        letter-spacing: -1px;
        background-color: ${colors.gray};
        border-radius: 0.3em 0 0 0.3em;
        user-select: none;
        padding: 1.7rem 0rem 1.7rem 2rem;

        > span {
          display: block;
          counter-increment: linenumber;

          &:before {
            content: counter(linenumber);
            color: ${darken(0.6, colors.gray)};
            display: block;
            padding-right: 0.8em;
            text-align: right;
          }
        }
      }
    }
  }

  pre[class*="language-"] {
    background: ${darken(0.7, colors.gray)};
  }

  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: ${darken(0.3, colors.gray)};
  }

  .token.punctuation {
    color: ${colors.white};
  }

  .token.interpolation-punctuation {
    color: ${colors.red};
  }

  .token.namespace {
    opacity: .7;
  }

  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: ${colors.red};
  }

  .token.boolean,
  .token.number {
    color: ${colors.orange};
  }

  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: ${colors.green};
  }

  .token.operator,
  .token.entity,
  .token.url,
  .language-css .token.string,
  .style .token.string,
  .token.variable {
    color: ${colors.cyan};
  }

  .token.atrule,
  .token.attr-value,
  .token.function {
    color: ${colors.purple};
  }

  .token.class-name {
    color: ${colors.yellow};
    font-weight: 600;
  }

  .token.keyword {
    color: ${colors.blue};
  }

  .token.regex,
  .token.important {
    color: ${colors.orange};
  }

  .token.important,
  .token.bold {
    font-weight: bold;
  }
  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }


  .command-line-prompt {
    display: block;
    float: left;
    font-size: 100%;
    letter-spacing: -1px;
    margin-right: 0;
    pointer-events: none;
    user-select: none;

    & > span:before {
      color: #999;
      content: ' ';
      display: block;
      padding-right: 0.6em;
    }

    & > span[data-user]:before {
      content: "$";
    }

    & > span[data-prompt]:before {
      content: attr(data-prompt);
    }
  }
`;

export default prismTheme;

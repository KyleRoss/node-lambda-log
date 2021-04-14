import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import { darken } from 'polished';
import { IoMdReturnRight } from 'react-icons/io';
import CustomLink from '@ui/link';
import { urlSafeMarkdownHeading } from '@src/utils';

const StyledHeader = styled.div`
  margin-top: 4rem;

  .type-icon {
    display: inline-block;
    width: 26px;
    height: 26px;
    border-radius: 5px;
    padding: 0.25rem 0;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0;
    margin-right: 0.6rem;
    text-align: center;
    vertical-align: middle;

    &.class {
      background-color: #e1eee1;
      color: ${props => props.theme.colors.green};

      &:before {
        content: 'C';
      }
    }

    &.property {
      background-color: #bfe2f2;
      color: ${props => props.theme.colors.blue};

      &:before {
        content: 'P';
      }
    }

    &.module {
      background-color: #f9d0d3;
      color: ${props => props.theme.colors.red};

      &:before {
        content: 'M';
      }
    }

    &.function {
      background-color: #d8d1ec;
      color: ${props => props.theme.colors.purple};

      &:before {
        content: 'F';
      }
    }

    &.event {
      background-color: #fad8c9;
      color: ${props => props.theme.colors.primary};

      &:before {
        content: 'E';
      }
    }

    &.getter {
      background-color: #fee6a5;
      color: #bc8902;

      &:before {
        content: 'G';
      }
    }

    &.setter {
      background-color: #ee9ccd;
      color: ${props => props.theme.colors.pink};

      &:before {
        content: 'S';
      }
    }

    &.static {
      background-color: #a1a9a9;

      &:before {
        content: 'S';
      }
    }

    &.instance {
      background-color: ${props => props.theme.colors.green};

      &:before {
        content: 'I';
      }
    }

    &.static,
    &.instance {
      color: ${props => props.theme.colors.white};
      margin-right: 0rem;
      border-radius: 5px 0 0 5px;
    }
  }

  .type-icon + .type-icon {
    border-radius: 0 5px 5px 0;
  }

  .prefix {
    color: ${props => darken(0.3, props.theme.colors.gray)};
    font-weight: 400;
  }

  .punc {
    color: ${props => props.theme.colors.gray};
    font-weight: 400;
  }

  .func {
    color: ${props => props.theme.colors.purple};
  }

  .prop {
    color: ${props => props.theme.colors.blue};
  }

  .equal-value {
    color: ${props => props.theme.colors.black};
    font-weight: 400;
    font-family: ${props => props.theme.fonts.monospace};
  }

  .args {
    font-weight: 400;
  }

  .arg {
    color: ${props => props.theme.colors.red};
    font-weight: 600;

    &.optional {
      color: ${props => darken(-0.15, props.theme.colors.red)};
      font-weight: 400;
    }
  }
`;

const StyledReturns = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 65%;
  font-weight: 400;
  font-family: ${props => props.theme.fonts.monospace};
  margin-top: 0.5rem;
  margin-left: calc(26px + 0.6rem);

  svg {
    color: ${props => darken(0.1, props.theme.colors.gray)};
    margin-right: 0.5rem;
  }

  .return-type {
    &:after {
      content: '|';
      margin: 0 0.5rem;
      color: ${props => props.theme.colors.gray};
    }

    &:last-child:after {
      display: none;
    }
  }

  a {
    text-decoration: underline;
    transition: color 0.2s;

    &:hover {
      text-decoration: none;
      color: ${props => props.theme.colors.black};
    }
  }

  ${down('sm')} {
    margin-left: 0;
    padding-left: 0;
    margin-top: 0.5rem;
    width: 100%;
  }
`;

const Header = ({ type, text, returns, link, scope }) => {
  function getType(t) {
    if(t.url) {
      return (
        <CustomLink plain href={t.url}>{t.type}</CustomLink>
      );
    }

    return t.type;
  }

  function getReturns() {
    if(!returns) return null;

    const types = returns.split('|').map(type => {
      let url = link && link !== 'null' ? link : null;
      if(!link && /^#/.test(type)) {
        type = type.replace(/^#/, '');
        url = `#${urlSafeMarkdownHeading(type)}`;
      }

      if(!link && /<#.*>/.test(type)) {
        const regx = /<(#.*)>/;
        url = `#${urlSafeMarkdownHeading(type.match(regx)[1].replace(/#/, ''))}`;
        type = type.replace(/#/, '');
      }

      return {
        type,
        url
      };
    });

    return (
      <StyledReturns>
        <IoMdReturnRight />
        {types.map(t => (
          <span key={`${type}-${text}-${t.type}`} className="return-type">
            {getType(t)}
          </span>
        ))}
      </StyledReturns>
    );
  }

  function formatText(text) {
    if(type === 'event') text = `<span class="prefix">Event:</span> ${text}`;
    if(type === 'function') {
      let [, start, args] = /^(.*)(?=\()(\(.*\))/.exec(text);
      let [, prefix, method] = /^([a-zA-Z0-9]*\.?)(.*)/.exec(start);
      if(!method) {
        method = prefix;
        prefix = '';
      }

      const str = [];

      if(prefix) str.push(`<span class="prefix">${prefix}</span>`);

      method = method
        .replace(/<|>|\|/g, a => {
          if(a === '<') a = '&lt;';
          if(a === '>') a = '&gt;';
          return `<span class="punc">${a}</span>`;
        });

      str.push(`<span class="func">${method}</span>`);

      args = args.replace(/([a-zA-Z0-9[\]]+)/g, a => {
        const isOptional = a.match(/^\[.*\]$/);
        return `<span class="arg${isOptional ? ' optional' : ''}">${a}</span>`;
      });

      str.push(`<span class="args">${args}</span>`);

      text = str.join('');
    }

    if(type === 'property' || type === 'getter' || type === 'setter') {
      const str = [];
      const parts = text.split('.');

      let prop = parts.pop();
      if(parts.length) str.push(`<span class="prefix">${parts.join('.')}.</span>`);

      if(prop.match(/=/)) {
        prop = prop.replace(/(=.*)/, val => {
          return `<span class="equal-value">${val}</span>`;
        });
      }

      str.push(`<span class="prop">${prop}</span>`);

      text = str.join('');
    }

    return text;
  }

  return (
    <StyledHeader>
      {scope && <span className={`type-icon ${scope}`} />}
      <span className={`type-icon ${type}`} />
      <span className="heading-text" dangerouslySetInnerHTML={{ __html: formatText(text) }} />
      {getReturns()}
    </StyledHeader>
  );
};

Header.propTypes = {
  type: PropTypes.oneOf(['class', 'property', 'event', 'function', 'module', 'getter', 'setter']),
  scope: PropTypes.oneOf(['static', 'instance']),
  text: PropTypes.string.isRequired,
  returns: PropTypes.string,
  link: PropTypes.string
};

export default Header;

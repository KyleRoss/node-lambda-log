import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HiLink } from 'react-icons/hi';
import { urlSafeMarkdownHeading } from '@src/utils';

const StyledHeading = styled.h1`
  position: relative;

  &.with-permalink {
    &:hover a.permalink svg {
      visibility: visible;
    }
  }

  a.permalink {
    float: left;
    margin-left: -30px;
    color: ${props => props.theme.colors.gray};
    transition: color 0.2s;

    &:hover {
      color: ${props => props.theme.colors.black};
      svg {
        visibility: visible;
      }
    }

    svg {
      width: 24px;
      height: auto;
      vertical-align: middle;
      visibility: hidden;
    }
  }
`;


const Heading = ({ children, as }) => {
  let hasHeader = false;
  let text = null;

  children.forEach(el => {
    if(typeof el === 'object') {
      if(el.type.name === 'Header') {
        hasHeader = true;
        text = el.props.text;
      }
    }
  });

  if(!hasHeader) {
    text = renderToStaticMarkup(children).replace(/&#.*;/g, '');
  }

  return (
    <StyledHeading as={as} className={as !== 'h1' && 'with-permalink'} id={urlSafeMarkdownHeading(text)}>
      {as !== 'h1' && (
        <a href={`#${urlSafeMarkdownHeading(text)}`} className="permalink plain">
          <HiLink />
          <span className="sr-only">Jump to {text}</span>
        </a>
      )}
      {children}
    </StyledHeading>
  );
};

Heading.propTypes = {
  as: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Heading;

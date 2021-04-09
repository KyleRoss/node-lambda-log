import React from 'react';
import PropTypes from 'prop-types';
import RehypeReact from 'rehype-react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';
import CustomLink from '@ui/link';
import inject from '@components/inject';
import Header from '@components/docs/ui/header';
import Heading from '@components/docs/ui/heading';
import Alert from '@components/docs/ui/alert';
import PrismTheme from '@styles/prism';

const StyledDocContent = styled.main`
  ${PrismTheme}
  margin-left: 280px;
  width: calc(100% - 280px);
  max-width: calc(100% - 280px);
  min-height: 70vh;

  ${down('md')} {
    margin-left: 0;
    width: 100%;
    max-width: 100%;
  }

  h1 {
    letter-spacing: -2px;
  }

  h2 {
    border-bottom: 1px solid ${props => props.theme.colors.gray};
  }

  h3 {
    font-weight: 800;
  }

  h3, h4, h5 {
    margin-bottom: 1rem;
  }

  h4, h5 {
    letter-spacing: -0.5px;
  }

  h2 + h3 {
    > div {
      margin-top: 0;
    }
  }
`;

const renderAst = new RehypeReact({
  createElement: React.createElement,
  Fragment: React.Fragment,
  components: {
    a: CustomLink,
    h: Header,
    alert: Alert,
    h1: inject(Heading, { as: 'h1' }),
    h2: inject(Heading, { as: 'h2' }),
    h3: inject(Heading, { as: 'h3' }),
    h4: inject(Heading, { as: 'h4' }),
    h5: inject(Heading, { as: 'h5' }),
    h6: inject(Heading, { as: 'h6' })
  }
}).Compiler;

const DocContent = ({ body }) => {
  return (
    <StyledDocContent className="doc-content">{renderAst(body)}</StyledDocContent>
  );
};

DocContent.propTypes = {
  body: PropTypes.object
};

export default DocContent;

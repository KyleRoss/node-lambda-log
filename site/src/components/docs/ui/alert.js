import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { lighten } from 'polished';

const StyledAlert = styled.div`
  padding: 1.5rem;
  border-radius: 10px;
  margin-bottom: 1.5rem;

  &.plain {
    background-color: ${props => lighten(0.2, props.theme.colors.gray)};
  }

  &.info {
    background-color: ${props => lighten(0.35, props.theme.colors.blue)};
  }

  &.warn {
    background-color: ${props => lighten(0.25, props.theme.colors.yellow)};
  }

  &.success {
    background-color: ${props => lighten(0.3, props.theme.colors.green)};
  }
`;

const Alert = ({ type, children }) => {
  return (
    <StyledAlert className={type}>
      {children}
    </StyledAlert>
  );
};

Alert.propTypes = {
  type: PropTypes.oneOf(['info', 'warn', 'success', 'plain']),
  children: PropTypes.node.isRequired
};

export default Alert;

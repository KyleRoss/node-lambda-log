import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { darken } from 'polished';


const StyledTerminal = styled.div`
  box-shadow: 0 10px 20px 1px rgba(0, 0, 0, 0.15);
  margin-bottom: 2rem;
  border-radius: 8px;

  .terminal-title {
    display: flex;
    justify-content: space-between;
    background-color: #dde1e5;
    padding: 0.6rem 1rem;
    border-radius: 8px 8px 0 0;
    border: 1px solid ${darken(0.08, '#dde1e5')};
    border-bottom: none;

    .context-buttons {
      display: flex;
      align-items: center;

      span {
        display: block;
        border-radius: 50%;
        width: 13px;
        height: 13px;
        margin-right: 0.4rem;
        border: 1px solid;
      }

      .close {
        background-color: #fe6057;
        border-color: ${darken(0.1, '#fe6057')};
      }

      .minimize {
        background-color: #ffbd2d;
        border-color: ${darken(0.1, '#ffbd2d')};
      }

      .maximize {
        background-color: #28cb42;
        border-color: ${darken(0.05, '#28cb42')};
      }
    }

    .window-title {
      font-size: 0.9rem;
      color: ${props => props.theme.colors.black};
      user-select: none;
    }

    .spacer {
      width: 56px;
    }
  }

  .terminal-content {
    min-height: 6rem;
    border: 1px solid ${darken(0.05, '#dde1e5')};
    border-top: none;
    background-color: ${props => props.theme.colors.white};
    border-radius: 0 0 8px 8px;
    padding: 1rem;
    font-family: ${props => props.theme.fonts.monospace};
    font-weight: 500;

    .line {
      &:before {
        content: '$';
        margin-right: 0.5rem;
        color: ${props => props.theme.colors.gray};
      }
    }
  }
`;

const TerminalFrame = ({ title, children }) => {
  return (
    <StyledTerminal>
      <div className="terminal-title">
        <div className="context-buttons">
          <span className="close" />
          <span className="minimize" />
          <span className="maximize" />
        </div>
        <div className="window-title">{title}</div>
        <div className="spacer" />
      </div>
      <div className="terminal-content">
        {children}
      </div>
    </StyledTerminal>
  );
};

TerminalFrame.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};

export default TerminalFrame;

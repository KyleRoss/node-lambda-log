import { css } from 'styled-components';

export default css`
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: 400;

    &:not(.plain) {
      position: relative;
      display: inline-block;
      transition: color ease 0.3s;

      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        left: 51%;
        right: 51%;
        bottom: 0;
        background: ${props => props.theme.colors.primary};
        height: 3px;
        transition-property: left, right;
        transition-duration: 0.3s;
        transition-timing-function: ease-out;
      }

      &:hover, &:active, &:focus {
        color: ${props => props.theme.colors.black};

        &::before {
          left: 0;
          right: 0;
        }
      }
    }
  }
`;

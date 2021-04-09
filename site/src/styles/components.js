import { css } from 'styled-components';

export const PageContainer = css`
  position: relative;
  max-width: 100%;
  width: 100%;
`;

export const ContentContainer = css`
  position: relative;
  max-width: ${props => props.theme.breakpoints.xl};
  width: 100%;
  padding: 0 3rem;
  margin: 0 auto;

  @media print {
    padding: 0;
  }
`;

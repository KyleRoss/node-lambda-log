import React from 'react';
import PropTypes from 'prop-types';
import styled, { ThemeProvider, css } from 'styled-components';
import theme from '@styles/theme';
import GlobalStyle from '@styles/global';
import { PageContainer } from '@styles/components';
import Hero from '@components/hero';

import Head from '@layouts/elements/head';
import Header from '@layouts/elements/header';
import Footer from '@layouts/elements/footer';

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: calc(100vh - 70px);
`;

const Main = styled.main`
  ${PageContainer}
  padding: 2rem 0;
  background-color: ${props => props.theme.colors.white};

  ${props => props.withHero ? '' : css`
    margin-top: 70px;
  `}
`;

const Layout = ({ title, children, showHero = false }) => {
  return (
    <ThemeProvider theme={theme}>
      <Head title={title} />
      <GlobalStyle />
      <Header />
      {showHero && <Hero />}
      <PageWrapper withHero={showHero}>
        <Main>
          {children}
        </Main>
        <Footer />
      </PageWrapper>
    </ThemeProvider>
  );
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showHero: PropTypes.bool
};

export default Layout;

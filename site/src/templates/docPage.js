import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { graphql } from 'gatsby';
import Layout from '@layouts';
import { ContentContainer } from '@styles/components';
import DocsSidebar from '@components/docs/sidebar';
import DocContent from '@components/docs/content';


const StyledDocPage = styled.div`
  ${ContentContainer}
`;

const DocPage = ({ data, location }) => {
  const doc = data.markdownRemark;

  return (
    <Layout title={doc.frontmatter.title}>
      <StyledDocPage>
        <DocsSidebar location={location} />

        <DocContent body={doc.htmlAst} />
      </StyledDocPage>
    </Layout>
  );
};

DocPage.propTypes = {
  data: PropTypes.object,
  location: PropTypes.object
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug }}) {
      id
      htmlAst
      frontmatter {
        title
      }
      tableOfContents
    }
  }
`;

export default DocPage;

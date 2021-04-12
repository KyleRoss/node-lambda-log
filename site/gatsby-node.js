const path = require('path');

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `);

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: `docs/${node.frontmatter.slug}`,
      component: path.resolve('./src/templates/docPage.js'),
      context: {
        slug: node.frontmatter.slug
      }
    });
  });
};

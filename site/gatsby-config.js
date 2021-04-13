module.exports = {
  flags: {
    PRESERVE_WEBPACK_CACHE: true,
    PARALLEL_SOURCING: true
  },
  // pathPrefix: '/node-lambda-log',
  siteMetadata: {
    title: 'Lambda Log',
    description: 'Node.js package to enforce standards when logging to CloudWatch from Lambda functions and other AWS services.',
    author: 'Kyle Ross',
    siteUrl: 'https://KyleRoss.github.io/node-lambda-log'
  },
  plugins: [
    'gatsby-plugin-eslint',
    'gatsby-plugin-styled-components',
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        alias: {
          '@src': 'src',
          '@components': 'src/components',
          '@layouts': 'src/layouts',
          '@ui': 'src/components/ui',
          '@data': 'src/data',
          '@pages': 'src/pages',
          '@styles': 'src/styles'
        }
      }
    },
    {
      resolve: 'gatsby-plugin-google-gtag',
      options: {
        trackingIds: ['UA-15503420-8'],
        pluginConfig: {
          respectDNT: true
        }
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'data',
        path: './src/data/'
      },
      __key: 'data'
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [{
          resolve: 'gatsby-remark-prismjs',
          options: {
            noInlineHighlight: true
          }
        }, {
          resolve: 'gatsby-remark-component-parent2div'
        }]
      }
    },
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://KyleRoss.github.io/node-lambda-log',
        sitemap: 'https://KyleRoss.github.io/node-lambda-log/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    }
  ]
};

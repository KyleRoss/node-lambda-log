const withTM = require('next-transpile-modules')([
  'remark-torchlight',
  '@torchlight-api/torchlight-cli'
]);

module.exports = withTM({
  webpack: config => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      // eslint-disable-next-line camelcase
      child_process: false,
      crypto: false,
      os: false,
      tty: false,
      // eslint-disable-next-line camelcase
      worker_threads: false
    };

    return config;
  },
  experimental: { esmExternals: true },
  pageExtensions: ['js', 'jsx', 'md', 'mdx'],
  target: 'serverless',

  eslint: {
    dirs: ['components', 'pages', 'styles', 'utils']
  },

  async redirects() {
    return [{
      source: '/docs',
      destination: '/docs/v3',
      permanent: false
    }, {
      source: '/docs/latest',
      destination: '/docs/v3',
      permanent: false
    }, {
      source: '/docs/latest/:path*',
      destination: '/docs/v3/:path*',
      permanent: false
    }, {
      source: '/docs/getting-started',
      destination: '/docs/v3/getting-started',
      permanent: true
    }, {
      source: '/docs/getting-started',
      destination: '/docs/v3/getting-started',
      permanent: true
    }, {
      source: '/docs/custom-log-levels',
      destination: '/docs/v3/custom-log-levels',
      permanent: true
    }, {
      source: '/docs/dynamic-metadata',
      destination: '/docs/v3/dynamic-metadata',
      permanent: true
    }, {
      source: '/docs/enhanced-tags',
      destination: '/docs/v3/enhanced-tags',
      permanent: true
    }, {
      source: '/docs/log-handler',
      destination: '/docs/v3/log-handler',
      permanent: true
    }, {
      source: '/docs/api',
      destination: '/docs/v3/api',
      permanent: true
    }, {
      source: '/docs/development',
      destination: '/docs/v3/development',
      permanent: true
    }, {
      source: '/docs/contributing',
      destination: '/docs/v3/contributing',
      permanent: true
    }, {
      source: '/docs/v3-migration',
      destination: '/docs/v3/upgrade-guide',
      permanent: true
    }];
  }
});

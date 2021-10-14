module.exports = {
  plugins: [
    [
      'module-resolver', {
        alias: {
          '@': './',
          '@components': './components',
          '@styles': './styles',
          '@public': './public',
          '@utils': './utils'
        }
      }
    ]
  ],
  presets: [
    'next/babel'
  ]
};

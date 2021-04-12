const theme = {
  colors: {
    black: '#2e3135',
    white: '#ffffff',
    primary: '#eb6125',
    secondary: '#4f5d75',
    red: '#E84855',
    green: '#70AE6E',
    blue: '#2b9dd4',
    yellow: '#FDCA40',
    purple: '#6247AA',
    pink: '#ce2389',
    gray: '#bfc0c0',
    dark: '#2d3142'
  },
  fonts: {
    body: '\'Fira Sans\', Helvetica, Arial, sans-serif',
    monospace: '\'Fira Code\', Consolas, Monaco, \'Andale Mono\', \'Ubuntu Mono\', monospace'
  },
  space: [
    0, 4, 8, 16, 32, 64, 128, 256, 512
  ],
  breakpoints: [
    '36em', // sm
    '48em', // md
    '62em', // lg
    '75em', // xl
    '87.5em' // xxl
  ]
};

theme.breakpoints.xs = '0px';
theme.breakpoints.sm = '576px';
theme.breakpoints.md = '768px';
theme.breakpoints.lg = '992px';
theme.breakpoints.xl = '1200px';
theme.breakpoints.xxl = '1400px';

export default theme;

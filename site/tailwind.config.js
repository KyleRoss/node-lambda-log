const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: {
    content: ['./layouts/**/*.{js,jsx}', './pages/**/*.{js,jsx,mdx}', './components/**/*.{js,jsx}', './utils/**/*.{jsx,mdx}']
  },
  darkMode: 'class',
  theme: {
    screens: {
      xs: '320px',
      sm: '480px',
      md: '760px',
      lg: '960px',
      xl: '1200px',
      xxl: '1600px'
    },
    colors: {
      transparent: 'transparent',
      slate: colors.blueGray,
      gray: colors.gray,
      warm: colors.warmGray,
      red: colors.red,
      yellow: colors.amber,
      orange: colors.orange,
      green: colors.emerald,
      cyan: colors.cyan,
      blue: colors.sky,
      indigo: colors.indigo,
      purple: colors.violet,
      pink: colors.pink,
      rose: colors.rose,
      white: '#FFFFFF',
      black: '#1E293B',

      code: {
        bg: '#282e35',
        selection: '#3e4852',
        black: '#3C3C3C',
        white: '#FFFFFF',
        lightGray: '#f7f8f9',
        gray: '#dde1e5',
        mediumGray: '#8694a3',
        purple: '#c397d8',
        cyan: '#70c0b1',
        blue: '#7aa6da',
        green: '#b9ca4a',
        yellow: '#e7c547',
        orange: '#e78c45',
        red: '#d54e53'
      }
    },
    fontFamily: {
      header: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      body: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      mono: ['Fira Code', 'Consolas', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace']
    },
    borderRadius: {
      none: '0',
      0: '0',
      sm: '0.25rem', // 4px
      DEFAULT: '0.375rem', // 6px
      lg: '0.75rem', // 12px
      xl: '1.25rem', // 20px
      full: '9999rem' // circle
    },
    borderWidth: {
      DEFAULT: '0.063rem', // 1px
      0: '0', // 0px
      1: '0.063rem', // 1px
      2: '0.125rem', // 2px
      3: '0.188rem', // 3px
      4: '0.25rem', // 4px
      5: '0.313rem' // 5px
    },
    extend: {
      fontSize: {
        lead: ['1.125rem', '2rem']
      },
      cursor: {
        'not-allowed': 'not-allowed'
      },
      maxWidth: {
        screen: '100vw'
      },
      zIndex: {
        '-1': '-1',
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
        9: 9,
        60: 60,
        70: 70,
        80: 80,
        90: 90,
        100: 100,
        500: 500,
        999: 999
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      const utils = {
        // Typography
        '.h1': {},
        '.h2': {},
        '.h3': {},
        '.h4': {},
        '.h5': {},
        '.h6': {},
        // Containers
        '.container-fluid': {
          position: 'relative',
          maxWidth: '100%',
          width: '100%'
        },
        '.container': {
          position: 'relative'
        },
        '.container-wrapper': {},
        // screen reader only - fixes class not working properly on mobile
        '.sr-only': {
          position: 'absolute',
          left: '-10000px',
          top: 'auto',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          borderWidth: '0'
        }
      };

      addUtilities(utils, ['responsive']);
    })
  ]
};

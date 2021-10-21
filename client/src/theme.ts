import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import { grey } from '@material-ui/core/colors'

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    border: {
      primary: string
      secondary: string
    }
  }
  interface PaletteOptions {
    border: {
      primary: string
      secondary: string
    }
  }
}

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    animations: {
      blinker: React.CSSProperties['animation']
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    animations?: {
      blinker?: React.CSSProperties['animation']
    },
  }
}

export default responsiveFontSizes(createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html, body, #root': {
          height: '100%',
        },
        body: {
          '-webkit-text-size-adjust': 'none',
          'text-size-adjust': 'none',
        },
        // Mimic Skeleton animation
        // https://github.com/mui-org/material-ui/blob/master/packages/material-ui-lab/src/Skeleton/Skeleton.js
        '@keyframes blinker': {
          '0%': {
            opacity: 1,
          },
          '50%': {
            opacity: 0.3,
          },
          '100%': {
            opacity: 1,
          },
        },
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 50,
    },
  },
  palette: {
    border: {
      primary: grey[400],
      secondary: grey[300],
    },
    primary: {
      main: '#f382a7',
    },
    secondary: {
      main: '#fff5d6',
    },
    background: {
      default: '#fff',
    },
  },
  animations: {
    blinker: 'blinker 1.5s ease-in-out 0.5s infinite',
  },
}))

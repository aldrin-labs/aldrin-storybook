import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import React, { useState, useEffect } from 'react'

declare module '@material-ui/core/styles/createMuiTheme' {
  interface Theme {
    customPalette: {
      red: { main: string }
      green: { main: string }
    }
  }
  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    customPalette: {
      red: { main: string }
      green: { main: string }
    }
  }
}

function createMyTheme(options: ThemeOptions) {
  return createMuiTheme({
    customPalette: {
      red: { main: 'red' },
      green: { main: 'green' },
    },
    ...options,
  })
}

export default ({ themeMode, children }) => {
  const [mode, updateMode] = useState(themeMode)

  useEffect(() => {
    updateMode(themeMode)
  }, [themeMode])

  // refactor this
  const theme = createMyTheme(
    mode === 'dark'
      ? {
          typography: {
            fontFamily: ['DM Sans', 'sans-serif'].join(','),
            useNextVariants: true,
            body1: {
              fontSize: '1.4rem',
            },
            title: {
              fontSize: '1.4rem',
            },
            body2: {
              fontSize: '1.4rem',
            },
          },
          overrides: {
            MuiCard: {
              // Name of the component ⚛️ / style sheet
              root: {
                // Name of the rule
                border: `1px solid ${fade('#707070', 0.26)}`, // Some CSS
              },
            },
            MuiPaper: {
              // Name of the component ⚛️ / style sheet
              rounded: {
                // Name of the rule
                borderRadius: '20px', // Some CSS
              },
            },
            MuiIconButton: {
              root: {
                color: '#FFFFFF',
              },
              colorPrimary: {
                color: '#575A64',
              },
            },
            MuiButton: {
              root: {
                fontSize: '1.4rem',
              },
              sizeSmall: {
                borderRadius: '25px',
                fontSize: '1.3rem',
                // fontSize: '1.3rem',
              },
            },
            MuiButtonBase: {
              root: {
                fontSize: '1.4rem',
              },
            },
            MuiTableCell: {
              body: {
                fontSize: '1.3rem',
                boxShadow: 'none',
              },
            },
            MuiTableHead: {
              root: {
                boxShadow: '0',
              },
            },
            MuiTableRow: {
              root: {
                boxShadow: '0',
              },
            },
            MuiFab: {
              root: {
                fontSize: '1.4rem',
              },
            },
            MuiInputBase: {
              root: {
                fontSize: '1.4rem',
              },
            },
          },
          customPalette: {
            red: {
              main: '#FE425A',
            },
            green: {
              main: '#48DCC6',
              custom: '#377E21',
            },
            blue: {
              main: '#5085EC',
            },
          },
          palette: {
            divider: fade('#748AA1', 0.16),
            type: 'dark',
            text: {
              primary: '#DBD9E6',
              dark: '#7284A0',
              subPrimary: 'white',
              grey: '#fff',
              light: '#fff',
              white: '#424b68',
              black: '#fff',
              text: '#96999C',
            },
            orange: {
              main: '#F29C38',
              dark: '#F8B567',
              light: '#F29C38',
            },
            black: {
              custom: '#16253D',
              registration: '#000000',
              card: '#1C1D22',
            },
            red: {
              main: '#F69894',
              button: 'linear-gradient(140.41deg, #F26D68 0%, #F69894 92.17%)',
              custom: '#D93B28',
              bright: '#ED6337',
              new: '#F69894',
              chart: '#C7FFD0',
            },
            blue: {
              custom: '#5085EC',
              first: '#0B1FD1',
              second: '#5C8CEA',
              background: '#5C8CEA',
              main: '#3B63AF', // 165BE0
              light: '#D1DDEF',
              btnBackground: '#3B63AF', // 165BE0
              switcherBackground: '#3B63AF', // 165BE0
              switcherBorder: '#2E2E2E',
              serum: '#0E02EC',
            },
            green: {
              dark: '#377E21',
              light: '#E7ECF3',
              custom: '#97C15C',
              main: '#53DF11',
              button: 'linear-gradient(135deg, #53DF11 0%, #97E873 100%)',
              new: '#53DF11',
              tab: '#09ACC7',
              shine: '#c7ffd0',
              acid: '#c7ffd0',
              descrip: '#61D8E6',
              border: '#61D8E6',
              analytics: '#53DF11',
            },
            grey: {
              custom: '#2E2E2E',
              dark: '#2c2c34', // '#1F1F24',
              light: '#D1DDEF',
              main: '#0E1016',
              background: '#2E2E2E',
              text: '#7284A0',
              border: '#2E2E2E',
              cream: '#0E1016',
              additional: '#0E1016',
              block: '#424b68',
              circle: '#0E1016',
              chart: '#f65683',
              input: '#222429',
              back: '#303743',
              newborder: '#3A475C',
              placeholder: '#abbad1',
              disabledInput: 'rgb(46,46,46)',
              title: '#93A0B2',
              terminal: '#383B45',
              new: '#96999C',
            },
            primary: {
              main: '#303037',
              dark: '#1F1F24',
              light: '#27272D',
            },
            secondary: {
              main: '#0E02EC', // '#48DCC6',
            },
            action: {
              selected: 'rgba(255, 255, 255, 0.05)',
            },
            hover: {
              dark: '#383a3d',
              light: '#E0E5EC',
            },
            button: {
              color: '#D1DDEF',
            },
            btnChartBorderNotActive: {
              main: '#E0E5EC',
            },
            border: {
              main: '.2rem solid #2e2e2e',
              new: '.2rem solid #2e2e2e',
            },
            price: {
              increase: '#2F7619',
              decrease: '#B93B2B',
              normalBlack: '#DBD9E6',
            },
            background: {
              default: '#16161D',
              paper: '#16161D',
              table: '#27272D',
            },
            white: {
              main: '#fff',
              primary: '#F8FAFF',
              background: '#17181A',
              inputBackground: '#14161B',
              greyish: '#f5f5fb',
              block: '#1B2028',
              card: '#1B2028',
              text: '#F5F5FB',
            },
            dark: {
              main: '#D1DDEF',
              background: '#222429',
            },
            depthChart: {
              redStroke: '#FFADAD',
              greenStroke: '#C7FFD0',
              greenBackground: '#497E5A',
              redBackground: '#923B50',
            },
            orderbook: {
              greenBackground: 'rgba(165, 232, 152, 0.25)',
              redBackground: 'rgba(247, 152, 148, 0.25)',
            },
            slider: {
              dots: '#2F3949',
              rail: '#2E2E2E',
            },
          },
          updateMode: (newMode) => {
            localStorage.setItem('themeMode', newMode)
            updateMode(newMode)
          },
        }
      : // light theme
        {
          typography: {
            fontFamily: ['DM Sans', 'sans-serif'].join(','),
            useNextVariants: true,
            body1: {
              fontSize: '1.4rem',
            },
            title: {
              fontSize: '1.4rem',
            },
            body2: {
              fontSize: '1.4rem',
            },
          },
          overrides: {
            MuiCard: {
              // Name of the component ⚛️ / style sheet
              root: {
                // Name of the rule
                border: `1px solid transparent`,
                boxShadow: `none`,
              },
            },
            MuiButton: {
              // Name of the component ⚛️ / style sheet
              root: {
                fontSize: '1.4rem',
              },
              sizeSmall: {
                fontSize: '1.3rem',
              },
              textPrimary: {
                // Name of the rule
                color: '#4F4F5D', // Some CSS
              },
            },
            MuiPaper: {
              elevation1: {
                boxShadow: `none`,
              },
              root: {
                //  boxShadow: `none`,
              },
              // Name of the component ⚛️ / style sheet
              rounded: {
                // Name of the rule
                borderRadius: '20px', // Some CSS
              },
            },
            MuiIconButton: {
              root: {
                color: '#41495E',
              },
              colorPrimary: {
                color: '#BCC2CF',
              },
            },
            MuiTableCell: {
              body: {
                fontSize: '1.3rem',
              },
            },
            MuiFab: {
              root: {
                fontSize: '1.4rem',
              },
            },
            MuiInputBase: {
              root: {
                fontSize: '1.4rem',
              },
            },
          },
          customPalette: {
            red: {
              main: '#FE425A',
              custom: '#D93B28',
            },
            green: {
              main: '#29AC80',
            },
          },
          palette: {
            divider: fade('#BCC2CF', 0.5),
            type: 'light',
            text: {
              primary: fade('#41495E', 0.69),
              dark: '#7284A0',
              blue: '#0E02EC',
              subPrimary: '#16253D',
              grey: '#2E2E2E',
              light: '#9F9F9F',
              black: '#3A475C',
              white: '#9F9F9F',
            },
            orange: {
              main: '#F29C38',
              dark: '#F8B567',
              light: '#F29C38',
            },
            black: {
              custom: '#16253D',
              registration: '#000000',
              card: '#1C1D22',
            },
            red: {
              main: '#DD6956',
              custom: '#D93B28',
              bright: '#ED6337',
              new: '#DD6956',
              chart: '#7380EB',
            },
            blue: {
              custom: '#5085EC',
              light: '#0E02EC',
              first: '#0B1FD1',
              second: '#5C8CEA',
              background: '#5C8CEA',
              main: '#0E02EC',
              btnBackground: '#5C8CEA',
              switcherBackground: 'rgba(11, 31, 209, 0.5)',
              switcherBorder: '#0B1FD1',
              serum: '#0E02EC',
            },
            green: {
              dark: '#377E21',
              custom: '#97C15C',
              main: '#39A74C',
              new: '#29AC80',
              tab: '#7380EB',
              shine: '#7380eb',
              descrip: '#1BA492',
              acid: '#1BA492',
              border: '#7380eb',
              analytics: '#53DF11',
            },
            grey: {
              custom: '#ABBAD1',
              dark: '#8f9092', // '#7284A0',
              light: '#7284A0',
              main: '#F2F4F6',
              backround: '#f2f4f6',
              text: '#7284A0',
              border: '#E0E5EC',
              cream: '#F9FBFD',
              additional: '#fff',
              block: '#e0e5ec',
              circle: '#E0E0E8',
              chart: '#e0e0e8',
              input: '#fff',
              back: '#e0e0e8',
              newborder: '#F6F8FA',
              placeholder: '#7284A0',
              disabledInput: '#F2F4F6',
              title: '#93A0B2',
            },
            primary: {
              main: '#FEFEFE',
              dark: '#f2f4f6',
              light: '#FFF',
            },
            secondary: {
              main: '#0E02EC', // '#48DCC6',
            },
            action: {
              selected: 'rgba(255, 255, 255, 0.05)',
            },
            border: {
              main: '.2rem solid #e0e5ec',
              new: '.1rem solid #3A475C',
            },
            hover: {
              dark: '#383a3d',
              light: '#E0E5EC',
            },
            button: {
              color: '#0E02EC',
            },
            btnChartBorderNotActive: {
              main: '#E0E5EC',
            },
            price: {
              increase: '#2F7619',
              decrease: '#B93B2B',
              normalBlack: '#16253D',
            },
            background: {
              default: '#f9fbfd',
              paper: '#FEFEFE',
              smoke: '#E0E5EC',
              table: themeMode === 'light' ? '#FFFFFF' : '#27272D',
            },
            white: {
              main: '#fff',
              primary: '#F8FAFF',
              background: '#fff',
              inputBackground: '#fff',
              greyish: '#f5f5fb',
              block: '#F6F8FA',
              card: '#fff',
              text: '#93A0B2',
            },
            dark: {
              main: '#16253D',
              background: '#222429',
            },
            depthChart: {
              redStroke: '#DD6956',
              greenStroke: '#29AC80',
              greenBackground: 'rgba(47, 118, 25, 0.5)',
              redBackground: 'rgba(185, 59, 43, 0.5)',
            },
            slider: {
              dots: '#ABBAD1',
              rail: '#e0e5ec',
            },
            orderbook: {
              greenBackground: '#AAF2C9',
              redBackground: '#FFD1D1',
            },
          },
          updateMode: (newMode) => {
            localStorage.setItem('themeMode', newMode)
            updateMode(newMode)
          },
        }
  )
  if (window) window.theme = theme

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

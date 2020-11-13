import React, { useState, useEffect } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { client } from '@core/graphql/apolloClient'
import { Props } from './ThemeWrapper.types'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { useQuery } from 'react-apollo'

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

export default ({ themeMode, isChartPage, children }) => {
  const [mode, updateMode] = useState(themeMode)

  useEffect(() => {
    updateMode(themeMode)
  }, [themeMode])

  // refactor this
  const theme = createMyTheme(
    mode === 'dark' && isChartPage
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
              main: '#ADD78E',
            },
          },
          palette: {
            divider: fade('#748AA1', 0.16),
            type: 'dark',
            text: {
              primary: '#DBD9E6',
              dark: '#7284A0',
              subPrimary: 'white',
            },
            orange: {
              main: '#F29C38',
            },
            black: {
              custom: '#16253D',
              registration: '#000000',
            },
            red: {
              main: '#F39D9D',
              custom: '#D93B28',
              bright: '#ED6337',
              new: '#DD6956',
              primary: '#F07878',
            },
            blue: {
              custom: '#5085EC',
              first: '#0B1FD1',
              second: '#5C8CEA',
              background: '#5C8CEA',
              main: '#ADD78E', // 165BE0
              light: '#D1DDEF',
              btnBackground: '#3B63AF', // 165BE0
              switcherBackground: '#3B63AF', // 165BE0
              switcherBorder: '#2E2E2E',
              tabs: '#2E2E2E',
            },
            green: {
              dark: '#377E21',
              light: '#E7ECF3',
              custom: '#97C15C',
              main: 'rgb(205,233,203)',
              new: '#29AC80',
              onboarding: '#1BA492',
            },
            grey: {
              custom: '#2E2E2E',
              dark: '#2c2c34', //'#1F1F24',
              light: '#D1DDEF',
              main: '#0B0B0E',
              background: '#2E2E2E',
              text: '#7284A0',
              border: '#2E2E2E',
              cream: '#0B0B0E',
              onboard: '#e0e2e5',
            },
            primary: {
              main: '#303037',
              dark: '#1F1F24',
              light: '#27272D',
            },
            secondary: {
              main: '#165BE0', //'#48DCC6',
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
              main: '.1rem solid #2e2e2e',
              custom: '.1rem solid #3B63AF',
            },
            price: {
              increase: '#2F7619',
              decrease: '#B93B2B',
              normalBlack: '#DBD9E6',
            },
            background: {
              default: themeMode === 'light' ? '#fafafa' : '#16161D',
              paper: themeMode === 'light' ? '#fff' : '#16161D',
              table: themeMode === 'light' ? '#FFFFFF' : '#27272D',
            },
            white: {
              main: '#fff',
              background: '#0B0B0E',
              inputBackground: '#14161B',
              onboarding: '#0B0B0E',
              text: '#CDE9CB',
            },
            dark: {
              main: '#D1DDEF',
            },
            depthChart: {
              redStroke: 'rgba(234, 99, 118)',
              greenStroke: '#39A74C',
              greenBackground: 'rgba(205, 233, 203, 0.15)',
              redBackground: 'rgba(234, 99, 118, 0.35)',
            },

            orderbook: {
              greenBackground: 'rgba(205, 233, 203, 0.15)',
              redBackground: 'rgba(234, 99, 118, 0.35)',
            },
            slider: {
              dots: '#2F3949',
              rail: '#2E2E2E',
            },
          },
          updateMode: (newMode) => {
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
              blue: '#165BE0',
              subPrimary: '#16253D',
            },
            orange: {
              main: '#F29C38',
            },
            black: {
              custom: '#16253D',
              registration: '#000000',
            },
            red: {
              main: '#F07878',
              custom: '#D93B28',
              bright: '#ED6337',
              new: '#DD6956',
              primary: '#F07878',
            },
            blue: {
              custom: '#5085EC',
              light: '#165BE0',
              first: '#0B1FD1',
              second: '#5C8CEA',
              background: '#5C8CEA',
              main: '#7380EB',
              btnBackground: '#5C8CEA',
              switcherBackground: 'rgba(11, 31, 209, 0.5)',
              switcherBorder: '#0B1FD1',
              tabs: '#6E98E9',
            },
            green: {
              dark: '#377E21',
              custom: '#97C15C',
              main: '#1BA492',
              new: '#29AC80',
              onboarding: '#1BA492',
            },
            grey: {
              custom: '#ABBAD1',
              dark: '#8f9092', //'#7284A0',
              light: '#7284A0',
              main: '#F2F4F6',
              backround: '#f2f4f6',
              text: '#7284A0',
              border: '#E0E5EC',
              cream: '#F9FBFD',
              onboard: '#3A475C',
            },
            primary: {
              main: '#FEFEFE',
              dark: '#f2f4f6',
              light: '#FFF',
            },
            secondary: {
              main: '#165BE0', // '#48DCC6',
            },
            action: {
              selected: 'rgba(255, 255, 255, 0.05)',
            },
            border: {
              main: '.1rem solid #e0e5ec',
              custom: '.1rem solid #7380EB',
            },
            hover: {
              dark: '#383a3d',
              light: '#E0E5EC',
            },
            button: {
              color: '#165BE0',
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
              background: '#fff',
              inputBackground: '#fff',
              btnBackground: '#F5F5FB',
              onboarding: '#f5f5fb',
              text: '#CDE9CB',
            },
            dark: {
              main: '#16253D',
            },
            depthChart: {
              redStroke: '#EA6376',
              greenStroke: '#CDE9CB',
              greenBackground: 'rgba(205, 233, 203, 0.15)',
              redBackground: 'rgba(234, 99, 118, 0.35)',
            },
            slider: {
              dots: '#ABBAD1',
              rail: '#e0e5ec',
            },
            orderbook: {
              greenBackground: '#rgba(205, 233, 203, 0.15)',
              redBackground: 'rgba(234, 99, 118, 0.35)',
            },
          },
          updateMode: (newMode) => {
            updateMode(newMode)
          },
        }
  )
  if (window) window.theme = theme

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
}

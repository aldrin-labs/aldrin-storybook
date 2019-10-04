import React from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'

// https://material-ui.com/customization/css-in-js/#other-html-element
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

const generateClassName = createGenerateClassName()
const jss = create(jssPreset())
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point')
//

import CssBaseline from '@material-ui/core/CssBaseline'
import Footer from '@sb/components/Footer'

import AnimatedNavBar from '@sb/components/NavBar/AnimatedNavBar'
import ThemeWrapper from './ThemeWrapper/ThemeWrapper'
import { AppGridLayout } from './App.styles'
// import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/cssUtils'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'

const version = `10.5.1`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

const AppRaw = ({
  children,
  getViewModeQuery,
  getThemeModeQuery,
  location: { pathname: currentPage },
  history: { push },
}: any) => {
  const themeMode =
    getThemeModeQuery &&
    getThemeModeQuery.app &&
    getThemeModeQuery.app.themeMode
  const chartPageView =
    getViewModeQuery && getViewModeQuery.chart && getViewModeQuery.chart.view

  const fullscreen: boolean =
    currentPage === '/chart' && chartPageView !== 'default'
  const showFooter = currentPage !== '/registration'
  const isPNL = currentPage === '/portfolio/main'
  // TODO: Check this variable
  const pageIsRegistration = currentPage.includes('regist')

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <ThemeWrapper themeMode={themeMode}>
        <CssBaseline />
        <AppGridLayout showFooter={showFooter} isPNL={isPNL}>
          {!pageIsRegistration && (
            <AnimatedNavBar
              pathname={currentPage}
              hide={fullscreen}
              push={push}
            />
          )}
          {children}
          <Footer fullscreenMode={fullscreen} showFooter={showFooter} />
        </AppGridLayout>
        {/* <ShowWarningOnMoblieDevice /> */}
        <GlobalStyle />
      </ThemeWrapper>
    </JssProvider>
  )
}

export const App = withRouter(
  compose(
    queryRendererHoc({
      query: GET_VIEW_MODE,
      name: 'getViewModeQuery',
    }),
    queryRendererHoc({
      query: GET_THEME_MODE,
      name: 'getThemeModeQuery',
    })
  )(AppRaw)
)

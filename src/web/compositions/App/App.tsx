import React from 'react'
import { connect } from 'react-redux'
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
import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/cssUtils'
import 'react-dates/initialize'
import 'react-dates/lib/css/_datepicker.css'

const version = `1`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

const AppRaw = ({
  children,
  themeMode,
  chartPageView,
  location: { pathname: currentPage },
}: any) => {
  const fullscreen: boolean =
    currentPage === '/chart' && chartPageView !== 'default'

  return (
    <JssProvider jss={jss} generateClassName={generateClassName}>
      <ThemeWrapper themeMode={themeMode}>
        <CssBaseline />
        <AppGridLayout>
          <AnimatedNavBar pathname={currentPage} hide={fullscreen} />
          {children}
        </AppGridLayout>
        <Footer fullscreenMode={fullscreen} />
        <ShowWarningOnMoblieDevice />
        <GlobalStyle />
      </ThemeWrapper>
    </JssProvider>
  )
}

const mapStateToProps = (store: any) => ({
  themeMode: store.ui.theme,
  chartPageView: store.chart.view,
})

export const App = withRouter(connect(mapStateToProps)(AppRaw))

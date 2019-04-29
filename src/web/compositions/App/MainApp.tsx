import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

// https://material-ui.com/customization/css-in-js/#other-html-element
import { create } from 'jss'
import { jssPreset } from '@material-ui/core/styles'

const jss = create(jssPreset())
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point')
//

import Footer from '@sb/components/Footer'

import AnimatedNavBar from '@sb/components/NavBar/AnimatedNavBar'
import { AppGridLayout } from './App.styles'
import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
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
    <>
      <AppGridLayout>
        <AnimatedNavBar pathname={currentPage} hide={fullscreen} />
        {children}
      </AppGridLayout>
      <Footer fullscreenMode={fullscreen} />
      <ShowWarningOnMoblieDevice />
    </>
  )
}

const mapStateToProps = (store: any) => ({
  chartPageView: store.chart.view,
})

export default MainApp = withRouter(connect(mapStateToProps)(AppRaw))

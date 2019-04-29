import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import Footer from '@sb/components/Footer'

import AnimatedNavBar from '@sb/components/NavBar/AnimatedNavBar'
import { AppGridLayout } from './App.styles'
import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'

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

export const MainApp = withRouter(connect(mapStateToProps)(AppRaw))

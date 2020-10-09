import React from 'react'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
// https://material-ui.com/customization/css-in-js/#other-html-element
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'c',
})

const jss = create(jssPreset())
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point')
//

import { withAuthStatus } from '@core/hoc/withAuthStatus'
import CssBaseline from '@material-ui/core/CssBaseline'
import Footer from '@sb/components/Footer'
import AnimatedNavBar from '@sb/components/NavBar/AnimatedNavBar'
import RestrictPopup from './RestrictPopup/RestrictPopup'
import ThemeWrapper from './ThemeWrapper/ThemeWrapper'
import ApolloPersistWrapper from './ApolloPersistWrapper/ApolloPersistWrapper'
import SnackbarWrapper from './SnackbarWrapper/SnackbarWrapper'
import { AppGridLayout, FontStyle } from './App.styles'
// import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/global.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getThemeMode } from '@core/graphql/queries/chart/getThemeMode'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { syncStorage } from '@storage'
import { getSearchParamsObject } from '@sb/compositions/App/App.utils'
import { useQuery } from 'react-apollo'

const version = `10.5.54`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

const AppRaw = ({
  children,
  getViewModeQuery,
  getThemeModeQuery,
  getChartDataQuery,
  location: { pathname: currentPage, search },
  authenticated,
  ...props
}: any) => {
  const isChartPage = /chart/.test(currentPage)

  const themeMode =
    (getThemeModeQuery &&
      getThemeModeQuery.getAccountSettings &&
      getThemeModeQuery.getAccountSettings.themeMode) ||
    'light'
  const chartPageView =
    getViewModeQuery && getViewModeQuery.chart && getViewModeQuery.chart.view

  const fullscreen: boolean = isChartPage && chartPageView !== 'default'
  const showFooter =
    currentPage !== '/registration' && currentPage !== '/tech_issues'
  const isPNL = currentPage.includes('/portfolio/main')
  // TODO: Check this variable
  const pageIsRegistration = currentPage.includes('regist')

  const searchParamsObject = getSearchParamsObject({ search })
  const isRefInUrlParamExist = !!searchParamsObject['ref']
  if (isRefInUrlParamExist) {
    const ref = searchParamsObject['ref']
    syncStorage.setItem('ref', ref)
  }
  const isDiscountCodeExist = !!searchParamsObject['code']
  if (isDiscountCodeExist) {
    const code = searchParamsObject['code']
    syncStorage.setItem('code', code)
  }

  // const isUserFromNotRestrictedCountry = !!syncStorage.getItem('IUFNRC')
  const isUserFromNotRestrictedCountry = false


  return (
    <ApolloPersistWrapper>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeWrapper themeMode={themeMode} isChartPage={isChartPage}>
          <SnackbarWrapper>
            <CssBaseline />
            <FontStyle />
            <RestrictPopup open={isUserFromNotRestrictedCountry && authenticated} />
            <AppGridLayout
              id={'react-notification'}
              showFooter={showFooter}
              isPNL={isPNL}
              isChartPage={isChartPage}
              isUserFromNotRestrictedCountry={isUserFromNotRestrictedCountry && authenticated}
            >
              {!pageIsRegistration && (
                <AnimatedNavBar pathname={currentPage} hide={fullscreen} />
              )}
              {children}
              <Footer
                isChartPage={isChartPage}
                fullscreenMode={fullscreen}
                showFooter={showFooter}
              />
            </AppGridLayout>
            {/* <ShowWarningOnMoblieDevice /> */}
            <GlobalStyle />
          </SnackbarWrapper>
        </ThemeWrapper>
      </JssProvider>
    </ApolloPersistWrapper>
  )
}

export const App = compose(
  withRouter,
  withAuthStatus,
  queryRendererHoc({
    query: GET_VIEW_MODE,
    name: 'getViewModeQuery',
    fetchPolicy: 'cache-and-network',
  }),
  // queryRendererHoc({
  //   query: GET_THEME_MODE,
  //   name: 'getThemeModeQuery',
  //   fetchPolicy: 'cache-and-network',
  // }),
  queryRendererHoc({
    skip: (props: any) => {
      return !props.authenticated
    },
    query: getThemeMode,
    name: 'getThemeModeQuery',
    fetchPolicy: 'cache-and-network',
  })
)(AppRaw)

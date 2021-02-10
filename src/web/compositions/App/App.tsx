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

import { difference } from '@core/utils/difference'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import CssBaseline from '@material-ui/core/CssBaseline'
import Footer from '@sb/components/Footer'
import AnimatedNavBar from '@sb/components/NavBar/AnimatedNavBar'
import RestrictPopup from './RestrictPopup/RestrictPopup'
import ThemeWrapper from './ThemeWrapper/ThemeWrapper'
import ApolloPersistWrapper from './ApolloPersistWrapper/ApolloPersistWrapper'
import SnackbarWrapper from './SnackbarWrapper/SnackbarWrapper'
import { AppGridLayout } from './App.styles'
// import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/global.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getThemeMode } from '@core/graphql/queries/chart/getThemeMode'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'

import { SnackbarUtilsConfigurator } from '@sb/utils/SnackbarUtils'
import { useQuery } from 'react-apollo'

const version = `11.0.44-switch-endpoint-to-ob-instance-add-more`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
}

const AppRaw = ({ children, getThemeModeQuery, authenticated }: any) => {
  const themeMode =
    (getThemeModeQuery &&
      getThemeModeQuery.getAccountSettings &&
      getThemeModeQuery.getAccountSettings.themeMode) ||
    'light'

  // const isUserFromNotRestrictedCountry = !!syncStorage.getItem('IUFNRC')
  const isUserFromNotRestrictedCountry = false

  return (
    <ApolloPersistWrapper>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeWrapper themeMode={themeMode}>
          <SnackbarWrapper>
            <SnackbarUtilsConfigurator />
            <CssBaseline />
            {/* <FontStyle /> */}
            <RestrictPopup
              open={isUserFromNotRestrictedCountry && authenticated}
            />
            <AppGridLayout
              id={'react-notification'}
              isUserFromNotRestrictedCountry={
                isUserFromNotRestrictedCountry && authenticated
              }
            >
              <AnimatedNavBar />
              {children}
              <Footer />
            </AppGridLayout>
            {/* <ShowWarningOnMoblieDevice /> */}
            <GlobalStyle />
          </SnackbarWrapper>
        </ThemeWrapper>
      </JssProvider>
    </ApolloPersistWrapper>
  )
}

const AppDataWrapper = compose(
  withAuthStatus,
  // queryRendererHoc({
  //   query: GET_VIEW_MODE,
  //   name: 'getViewModeQuery',
  //   skip: (props: any) => !props.authenticated,
  //   fetchPolicy: 'cache-first',
  // }),
  queryRendererHoc({
    query: getThemeMode,
    name: 'getThemeModeQuery',
    skip: (props: any) => !props.authenticated,
    fetchPolicy: 'cache-first',
  })
)(AppRaw)

export const App = React.memo(AppDataWrapper, (prev, next) => {
  console.log('diff for App', difference(prev, next))

  if (prev.cacheBusterProp !== next.cacheBusterProp) return true

  return false
})

// export const App = AppDataWrapper

//   console.log('diff for App', difference(prev, next))

//   return false
// })

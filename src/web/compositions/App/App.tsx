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
import { AppGridLayout } from './App.styles'
// import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/global.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getThemeMode } from '@core/graphql/queries/chart/getThemeMode'
import { GET_THEME_MODE } from '@core/graphql/queries/app/getThemeMode'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { syncStorage } from '@storage'
import { getSearchParamsObject } from '@sb/compositions/App/App.utils'
import { useQuery } from 'react-apollo'

const version = `10.7.7`
const currentVersion = localStorage.getItem('version')
if (currentVersion !== version) {
  localStorage.clear()
  localStorage.setItem('version', version)
  localStorage.setItem('token', "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqRkdRVEk0TWtZM1FUTTNRekZGUWtNNFJUazJNelU1TWtZMlJUSTNOekF4TVRBMk4wUXhNZyJ9.eyJodHRwczovL2NyeXB0b2N1cnJlbmNpZXMuYWlhcHBfbWV0YWRhdGEiOnsibG9naW5zQ291bnQiOjQsImlwIjoiMTc4LjEyMS40Mi43OSIsImNvdW50cnlDb2RlIjoiQlkiLCJpc0VtYWlsVmVyaWZpY2F0aW9uUmVxdWVpcmVkIjpmYWxzZX0sIm5pY2tuYW1lIjoidGVzdC5hY2NvdW50LjIxLjA0LjIwMjAuMyIsIm5hbWUiOiJkZW1vQGRjZmkuYXBwIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzRiZWZjMTFjY2RlYWM1ZjI2M2FjMGM0NTJmYzRmOGQzP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMjAtMTEtMTVUMTQ6NTk6NDQuNjA3WiIsImVtYWlsIjoiZGVtb0BkY2ZpLmFwcCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9jY2FpLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZTlkOTRiNzQ5ZmIyNDBjOGEyN2QyNjciLCJhdWQiOiIwTjZ1SjhsVk1iaXplNzNDdjl0U2hhS2RxSkhtaDFXbSIsImlhdCI6MTYwNTQ1MjM4NCwiZXhwIjoxNjA1NzUyMzg0fQ.uAM0cTEg-CijAv6C6ZOxq5auOIdp0JuyZ0abHNAbIvbqYh240YZ6ITGVle7YoRWU5XpB-GEg0zzzxd7W2RnB8RXtO3CokqQQSa2R26yWT-Vrw7ADQQMLlId_4bF9-pLj7w7WYme9LHS8EqNQfp9sUsOG1HGD0s4ZluqvL0u7lI3M6oIGePgMGW4CtJiChkKUbRmjRTqZjHV6AqBdYAl-n5BaEmWh65Pf67qJ5ABPKjrjZEkmzzHO_M6XkQYw_zrZIjgMc0qeCM7cp63wUGWk5v7MvJlCdsdeyQi2vFj-_7-2rToGoTlrCgHm_R6ZwDNTeSHqSAhz2zrZ58u3_EciOg")
  localStorage.setItem('accessToken', "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqRkdRVEk0TWtZM1FUTTNRekZGUWtNNFJUazJNelU1TWtZMlJUSTNOekF4TVRBMk4wUXhNZyJ9.eyJpc3MiOiJodHRwczovL2NjYWkuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVlOWQ5NGI3NDlmYjI0MGM4YTI3ZDI2NyIsImF1ZCI6WyJodHRwczovL2NjYWkuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2NjYWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNTQ1MjM4NCwiZXhwIjoxNjA1NzUyMzg0LCJhenAiOiIwTjZ1SjhsVk1iaXplNzNDdjl0U2hhS2RxSkhtaDFXbSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSIsImd0eSI6InBhc3N3b3JkIn0.u--tmynaDDKEjNroU0O7z5g81-IU4MAd0RcXjQPD1N_btovcACxNTAL0hN6XZ02xIQGzQmcucKqtuPY-dAy5xILASG9cLVCLxU_TQaIXmBQj_RZ4Mj_1MhWN8N4UJf7gvrz_rSv0576JZMhCfw13Li20qDb6M_yeebNrPXx2sJ4fhPLcyWcfCyhdyLWMYdWJTnY6K7TD3-KMD_-A88XAwHeUlX-C2XR52qE-_1sXnIhVouMO5nBmJOtk63WfpGVocWhuN0xFDYJqdQ8f6z6YgbVZi1ze3oTNutehMdDNuOp26MNHCuu0V7yaM4d0bp7KPkYtaDoHBAfIKmGB8U5C-Q")
  localStorage.setItem('loginStatus', true)
}

localStorage.setItem('token', "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqRkdRVEk0TWtZM1FUTTNRekZGUWtNNFJUazJNelU1TWtZMlJUSTNOekF4TVRBMk4wUXhNZyJ9.eyJodHRwczovL2NyeXB0b2N1cnJlbmNpZXMuYWlhcHBfbWV0YWRhdGEiOnsibG9naW5zQ291bnQiOjQsImlwIjoiMTc4LjEyMS40Mi43OSIsImNvdW50cnlDb2RlIjoiQlkiLCJpc0VtYWlsVmVyaWZpY2F0aW9uUmVxdWVpcmVkIjpmYWxzZX0sIm5pY2tuYW1lIjoidGVzdC5hY2NvdW50LjIxLjA0LjIwMjAuMyIsIm5hbWUiOiJkZW1vQGRjZmkuYXBwIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzRiZWZjMTFjY2RlYWM1ZjI2M2FjMGM0NTJmYzRmOGQzP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGdGUucG5nIiwidXBkYXRlZF9hdCI6IjIwMjAtMTEtMTVUMTQ6NTk6NDQuNjA3WiIsImVtYWlsIjoiZGVtb0BkY2ZpLmFwcCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly9jY2FpLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1ZTlkOTRiNzQ5ZmIyNDBjOGEyN2QyNjciLCJhdWQiOiIwTjZ1SjhsVk1iaXplNzNDdjl0U2hhS2RxSkhtaDFXbSIsImlhdCI6MTYwNTQ1MjM4NCwiZXhwIjoxNjA1NzUyMzg0fQ.uAM0cTEg-CijAv6C6ZOxq5auOIdp0JuyZ0abHNAbIvbqYh240YZ6ITGVle7YoRWU5XpB-GEg0zzzxd7W2RnB8RXtO3CokqQQSa2R26yWT-Vrw7ADQQMLlId_4bF9-pLj7w7WYme9LHS8EqNQfp9sUsOG1HGD0s4ZluqvL0u7lI3M6oIGePgMGW4CtJiChkKUbRmjRTqZjHV6AqBdYAl-n5BaEmWh65Pf67qJ5ABPKjrjZEkmzzHO_M6XkQYw_zrZIjgMc0qeCM7cp63wUGWk5v7MvJlCdsdeyQi2vFj-_7-2rToGoTlrCgHm_R6ZwDNTeSHqSAhz2zrZ58u3_EciOg")
localStorage.setItem('accessToken', "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJqRkdRVEk0TWtZM1FUTTNRekZGUWtNNFJUazJNelU1TWtZMlJUSTNOekF4TVRBMk4wUXhNZyJ9.eyJpc3MiOiJodHRwczovL2NjYWkuYXV0aDAuY29tLyIsInN1YiI6ImF1dGgwfDVlOWQ5NGI3NDlmYjI0MGM4YTI3ZDI2NyIsImF1ZCI6WyJodHRwczovL2NjYWkuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2NjYWkuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTYwNTQ1MjM4NCwiZXhwIjoxNjA1NzUyMzg0LCJhenAiOiIwTjZ1SjhsVk1iaXplNzNDdjl0U2hhS2RxSkhtaDFXbSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwgdXBkYXRlOmN1cnJlbnRfdXNlcl9tZXRhZGF0YSIsImd0eSI6InBhc3N3b3JkIn0.u--tmynaDDKEjNroU0O7z5g81-IU4MAd0RcXjQPD1N_btovcACxNTAL0hN6XZ02xIQGzQmcucKqtuPY-dAy5xILASG9cLVCLxU_TQaIXmBQj_RZ4Mj_1MhWN8N4UJf7gvrz_rSv0576JZMhCfw13Li20qDb6M_yeebNrPXx2sJ4fhPLcyWcfCyhdyLWMYdWJTnY6K7TD3-KMD_-A88XAwHeUlX-C2XR52qE-_1sXnIhVouMO5nBmJOtk63WfpGVocWhuN0xFDYJqdQ8f6z6YgbVZi1ze3oTNutehMdDNuOp26MNHCuu0V7yaM4d0bp7KPkYtaDoHBAfIKmGB8U5C-Q")
localStorage.setItem('loginStatus', true)

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

  const themeMode = (getThemeModeQuery &&
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
            {/* <FontStyle /> */}
            <RestrictPopup
              open={isUserFromNotRestrictedCountry && authenticated}
            />
            <AppGridLayout
              id={'react-notification'}
              showFooter={showFooter}
              isPNL={isPNL}
              isChartPage={isChartPage}
              isUserFromNotRestrictedCountry={
                isUserFromNotRestrictedCountry && authenticated
              }
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

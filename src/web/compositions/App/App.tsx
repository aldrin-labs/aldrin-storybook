//
import CssBaseline from '@material-ui/core/CssBaseline'
import { createGenerateClassName, jssPreset } from '@material-ui/core/styles'
import { syncStorage } from '@storage'
import useWindowSize from '@webhooks/useWindowSize'
import { create } from 'jss'
import React, { useState } from 'react'
import JssProvider from 'react-jss/lib/JssProvider'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'

import { Footer } from '@sb/components/Footer'
import { Header } from '@sb/components/Header'
import DevUrlPopup from '@sb/components/PopupForDevUrl'
import { queryRendererHoc } from '@sb/components/QueryRenderer'
import { SolanaNetworkDegradedPerformanceBanner } from '@sb/components/SolanaNetworkDegradedPerformanceBanner/SolanaNetworkDegradedPerformanceBanner/SolanaNetworkDegradedPerformanceBanner'
import { getSearchParamsObject } from '@sb/compositions/App/App.utils'
import { GlobalStyles } from '@sb/compositions/Chart/Chart.styles'
import { ConnectionProvider } from '@sb/dexUtils/connection'
import { MarketProvider } from '@sb/dexUtils/markets'
import { TokenRegistryProvider } from '@sb/dexUtils/tokenRegistry'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { WalletProvider } from '@sb/dexUtils/wallet'
// import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/global.styles'
import { SnackbarUtilsConfigurator } from '@sb/utils/SnackbarUtils'

import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { withAuthStatus } from '@core/hoc/withAuthStatus'
import { LOCAL_BUILD, MASTER_BUILD } from '@core/utils/config'

import { MobileFooter } from '../Chart/components/MobileFooter/MobileFooter'
import ApolloPersistWrapper from './ApolloPersistWrapper/ApolloPersistWrapper'
import {
  AppGridLayout,
  AppInnerContainer,
  StyledToastContainer,
} from './App.styles'
import SnackbarWrapper from './SnackbarWrapper/SnackbarWrapper'
import { Theme, THEME_DARK } from './themes'
import ThemeWrapper from './ThemeWrapper/ThemeWrapper'

import 'react-toastify/dist/ReactToastify.min.css'

const generateClassName = createGenerateClassName({
  dangerouslyUseGlobalCSS: false,
  productionPrefix: 'c',
})

const jss = create(jssPreset())
// We define a custom insertion point that JSS will look for injecting the styles in the DOM.
jss.options.insertionPoint = document.getElementById('jss-insertion-point')

const version = `10.9.147-fix-open-orders`
const currentVersion = localStorage.getItem('version')

if (currentVersion !== version) {
  const isMeetRebalancePopupOpen = localStorage.getItem(
    'isMeetRebalancePopupOpen'
  )
  const isNotificationDone = localStorage.getItem('isNotificationDone')
  const isOnboardingDone = localStorage.getItem('isOnboardingDone')
  const isRebrandingPopupOpen = localStorage.getItem('isRebrandingPopupOpen')

  localStorage.clear()

  localStorage.setItem('isMeetRebalancePopupOpen', isMeetRebalancePopupOpen)
  localStorage.setItem('isNotificationDone', isNotificationDone)
  localStorage.setItem('isOnboardingDone', isOnboardingDone)
  localStorage.setItem('isRebrandingPopupOpen', isRebrandingPopupOpen)

  localStorage.setItem('version', version)
  document.location.reload()
}

const DetermineMobileWindowHeight = () => {
  const { height = 0 } = useWindowSize()
  const vh = height * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  return null
}

const AppRaw = ({
  children,
  location: { pathname: currentPage, search },
}: any) => {
  const [isDevUrlPopupOpen, openDevUrlPopup] = useLocalStorageState(
    'isDevUrlPopupOpen',
    true
  )
  const theme = localStorage.getItem('theme')

  const [currentTheme, setCurrentTheme] = useState(theme)
  if (!theme) {
    localStorage.setItem('theme', THEME_DARK)
  }

  const isChartPage = /chart/.test(currentPage)
  const isSwapPage = /swap/.test(currentPage)

  let themeMode = localStorage.getItem('themeMode')

  if (!themeMode) {
    themeMode = 'dark'
    localStorage.setItem('themeMode', THEME_DARK)
  }

  const showFooter = false

  const isPNL = currentPage.includes('/portfolio/main')
  const isRewards = currentPage.includes('rewards')

  const searchParamsObject = getSearchParamsObject({ search })
  const isRefInUrlParamExist = !!searchParamsObject.ref
  if (isRefInUrlParamExist) {
    const { ref } = searchParamsObject
    syncStorage.setItem('ref', ref)
  }
  const isDiscountCodeExist = !!searchParamsObject.code
  if (isDiscountCodeExist) {
    const { code } = searchParamsObject
    syncStorage.setItem('code', code)
  }

  return (
    <ApolloPersistWrapper>
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <ThemeWrapper themeMode={themeMode} isChartPage={isChartPage}>
          <Theme theme={currentTheme}>
            <StyledToastContainer />
            <SnackbarWrapper>
              <SnackbarUtilsConfigurator />
              <CssBaseline />
              <ConnectionProvider>
                <TokenRegistryProvider>
                  <MarketProvider>
                    <WalletProvider>
                      <AppGridLayout
                        id="react-notification"
                        showFooter={showFooter}
                        isRewards={isRewards}
                        isPNL={isPNL}
                        isChartPage={isChartPage}
                        isSwapPage={isSwapPage}
                      >
                        <SolanaNetworkDegradedPerformanceBanner />
                        <Header setCurrentTheme={setCurrentTheme} />
                        <AppInnerContainer isSwapPage={isSwapPage}>
                          {children}
                        </AppInnerContainer>
                        {/* {showFooter && (
                          <FooterWithTheme isRewards={isRewards} />
                        )} */}
                        {!isChartPage && <Footer />}
                        <MobileFooter />

                        {!MASTER_BUILD && !LOCAL_BUILD && (
                          <DevUrlPopup
                            open={isDevUrlPopupOpen}
                            close={() => {
                              openDevUrlPopup(false)
                            }}
                          />
                        )}
                        {/* <WarningBanner
                          localStorageProperty={'isPhantomIssuesPopupOpen'}
                          notification={[
                            'Phantom Wallet users may currently be experiencing problems with any action in dApps such as Aldrin DEX. The Phantom team is currently working on fixing these issues.',
                            'In the meantime, you can import your Seed Phrase into Aldrin Wallet or any other wallet and interact with DEX using it.',
                          ]}
                          needMobile={false}
                        /> */}
                        {/* <RebrandingPopup
                          open={isRebrandingPopupOpen}
                          onClose={() => setIsRebrandingPopupOpen(false)}
                        /> */}
                        {/* {!isWalletMigrationToNewUrlPopupDone && (
                        <WalletMigrationPopup
                          open={isMigrationToNewUrlPopupOpen}
                          close={() => {
                            openMigrationToNewUrlPopup(false)
                          }}
                        />
                      )} */}
                        <DetermineMobileWindowHeight />
                      </AppGridLayout>
                      {/* <ShowWarningOnMoblieDevice /> */}
                    </WalletProvider>
                  </MarketProvider>
                </TokenRegistryProvider>
              </ConnectionProvider>
              <GlobalStyle />
              <GlobalStyles />
            </SnackbarWrapper>
          </Theme>
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
  })
)(AppRaw)

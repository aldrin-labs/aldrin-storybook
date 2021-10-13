import React, { useState } from 'react'
// import './app.styles.global.css';
import styled from 'styled-components'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
// https://material-ui.com/customization/css-in-js/#other-html-element
import JssProvider from 'react-jss/lib/JssProvider'
import { create } from 'jss'
import {
  createGenerateClassName,
  jssPreset,
  withTheme,
} from '@material-ui/core/styles'
//

import CssBaseline from '@material-ui/core/CssBaseline'
// import Footer from '@sb/components/Footer'
import { SnackbarUtilsConfigurator } from '@sb/utils/SnackbarUtils'

// import ShowWarningOnMoblieDevice from '@sb/components/ShowWarningOnMoblieDevice'
import { GlobalStyle } from '@sb/styles/global.styles'
import { GlobalStyles } from '@sb/compositions/Chart/Chart.styles'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import { GET_VIEW_MODE } from '@core/graphql/queries/chart/getViewMode'
import { syncStorage } from '@storage'
import { getSearchParamsObject } from '@sb/compositions/App/App.utils'
import CardsPanel from '@sb/compositions/Chart/components/CardsPanel'

import { ConnectionProvider } from '@sb/dexUtils/connection'
import { WalletProvider } from '@sb/dexUtils/wallet'
import { MarketProvider } from '@sb/dexUtils/markets'
import { PreferencesProvider } from '@sb/dexUtils/preferences'
import { LOCAL_BUILD, MASTER_BUILD } from '@core/utils/config'
import DevUrlPopup from '@sb/components/PopupForDevUrl'
import { TokenRegistryProvider } from '@sb/dexUtils/tokenRegistry'
import useWindowSize from '@webhooks/useWindowSize'
import { RebrandingPopup } from '@sb/components/RebrandingPopup/RebrandingPopup'
import { useLocalStorageState } from '@sb/dexUtils/utils'
import { MobileNavBar } from '../Chart/components/MobileNavbar/MobileNavbar'
import { MobileFooter } from '../Chart/components/MobileFooter/MobileFooter'
import { AppGridLayout, AppInnerContainer } from './App.styles'
import SnackbarWrapper from './SnackbarWrapper/SnackbarWrapper'
import ApolloPersistWrapper from './ApolloPersistWrapper/ApolloPersistWrapper'
import ThemeWrapper from './ThemeWrapper/ThemeWrapper'

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
  const isRpcWarningPopupOpen = localStorage.getItem('isRpcWarningPopupOpen')

  localStorage.clear()

  localStorage.setItem('isMeetRebalancePopupOpen', isMeetRebalancePopupOpen)
  localStorage.setItem('isNotificationDone', isNotificationDone)
  localStorage.setItem('isOnboardingDone', isOnboardingDone)
  localStorage.setItem('isRebrandingPopupOpen', isRebrandingPopupOpen)
  // localStorage.setItem("isRpcWarningPopupOpen", isRpcWarningPopupOpen)

  localStorage.setItem('version', version)
  document.location.reload()
}

const DetermineMobileWindowHeight = () => {
  const { width, height } = useWindowSize()
  const vh = height * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)
  return null
}

const AppRaw = ({
  children,
  getViewModeQuery,
  location: { pathname: currentPage, search },
}: any) => {
  const [isDevUrlPopupOpen, openDevUrlPopup] = useState(true)
  const [isRebrandingPopupOpen, setIsRebrandingPopupOpen] =
    useLocalStorageState('isRebrandingPopupOpen', true)
  // const [isMigrationToNewUrlPopupOpen, openMigrationToNewUrlPopup] = useState(
  //   true
  // )

  const isChartPage = /chart/.test(currentPage)

  let themeMode = localStorage.getItem('themeMode')

  if (!themeMode) {
    themeMode = 'dark'
    localStorage.setItem('themeMode', 'dark')
  }

  const chartPageView =
    getViewModeQuery && getViewModeQuery.chart && getViewModeQuery.chart.view

  const fullscreen: boolean = isChartPage && chartPageView !== 'default'
  const showFooter = false

  const isPNL = currentPage.includes('/portfolio/main')
  // TODO: Check this variable
  const pageIsRegistration = currentPage.includes('regist')
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
          <SnackbarWrapper>
            <SnackbarUtilsConfigurator />
            <CssBaseline />
            <ConnectionProvider>
              <TokenRegistryProvider>
                <MarketProvider>
                  <WalletProvider>
                    <PreferencesProvider>
                      <AppGridLayout
                        id="react-notification"
                        showFooter={showFooter}
                        isRewards={isRewards}
                        isPNL={isPNL}
                        isChartPage={isChartPage}
                      >
                        <MobileNavBar pathname={currentPage} />
                        {!pageIsRegistration && (
                          <CardsPanel
                            pathname={currentPage}
                            hide={fullscreen}
                          />
                        )}
                        <AppInnerContainer
                          showFooter={showFooter}
                          isChartPage={isChartPage}
                          currentPage={currentPage}
                        >
                          {children}
                        </AppInnerContainer>
                        {showFooter && (
                          <FooterWithTheme isRewards={isRewards} />
                        )}
                        <MobileFooter pathname={currentPage} />
                        {/* 
                    <Footer
                      isChartPage={isChartPage}
                      fullscreenMode={fullscreen}
                      showFooter={showFooter}
                    /> */}
                        {!MASTER_BUILD && !LOCAL_BUILD && (
                          <DevUrlPopup
                            open={isDevUrlPopupOpen}
                            close={() => {
                              openDevUrlPopup(false)
                            }}
                          />
                        )}
                        <RebrandingPopup
                          open={isRebrandingPopupOpen}
                          onClose={() => setIsRebrandingPopupOpen(false)}
                        />
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
                    </PreferencesProvider>
                  </WalletProvider>
                </MarketProvider>
              </TokenRegistryProvider>
            </ConnectionProvider>
            <GlobalStyle />
            <GlobalStyles />
          </SnackbarWrapper>
        </ThemeWrapper>
      </JssProvider>
    </ApolloPersistWrapper>
  )
}

const Footer = (props) => {
  return (
    <RowContainer
      style={{
        background: props.theme.palette.grey.additional,
        height: '5.7rem',
        ...(props.isRewards ? { position: 'absolute', bottom: '0' } : {}),
      }}
    >
      <Line bottom="5.7rem" />
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://aldrin.com/"
      >
        Aldrin.com
      </Link>
      <Link
        href="https://t.me/CCAI_Official"
        target="_blank"
        rel="noopener noreferrer"
      >
        Telegram
      </Link>
      <Link
        href="https://twitter.com/CCAI_Official"
        target="_blank"
        rel="noopener noreferrer"
      >
        Twitter
      </Link>
      <Link
        href="https://discord.com/invite/2EaKvrs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Discord
      </Link>
    </RowContainer>
  )
}

const FooterWithTheme = compose(withTheme())(Footer)

const Row = styled.div`
  display: flex;
  flex-wrap: ${(props) => props.wrap || 'wrap'};
  justify-content: ${(props) => props.justify || 'center'};
  flex-direction: ${(props) => props.direction || 'row'};
  align-items: ${(props) => props.align || 'center'};
`
const RowContainer = styled(Row)`
  width: 100%;
`
const Line = styled.div`
  position: absolute;
  top: ${(props) => props.top || 'none'};
  bottom: ${(props) => props.bottom || 'none'};
  width: 100%;
  height: 0.1rem;
  background: ${(props) => props.background || theme.palette.grey.block};
`
const Link = styled.a`
  display: block;
  width: fit-content;
  color: ${(props) => props.color || theme.palette.blue.serum};

  text-decoration: none;
  text-transform: ${(props) => props.textTransform || 'capitalize'};

  font-family: 'DM Sans', sans-serif;
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 109.6%;
  letter-spacing: 0.1rem;
  padding: 0 1rem;
`

export const App = compose(
  withRouter,
  queryRendererHoc({
    query: GET_VIEW_MODE,
    name: 'getViewModeQuery',
    fetchPolicy: 'cache-and-network',
  })
)(AppRaw)

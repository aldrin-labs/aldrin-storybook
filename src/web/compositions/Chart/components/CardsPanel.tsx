import { TOGGLE_THEME_MODE } from '@core/graphql/mutations/app/toggleThemeMode'
import { changePositionMode } from '@core/graphql/mutations/chart/changePositionMode'
import { updateThemeMode } from '@core/graphql/mutations/chart/updateThemeMode'
import { MASTER_BUILD } from '@core/utils/config'
import AldrinLogo from '@icons/Aldrin.svg'
import LightLogo from '@icons/lightLogo.svg'
import WalletIcon from '@icons/walletIcon.svg'
import { withTheme } from '@material-ui/core'
import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown/index'
import { Label } from '@sb/components/Label/Label'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import SvgIcon from '@sb/components/SvgIcon'
import {
  ReusableTitle as Title,
  Row,
  RowContainer,
} from '@sb/compositions/AnalyticsRoute/index.styles'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { ChartGridContainer } from '@sb/compositions/Chart/Chart.styles'
import { useConnectionConfig } from '@sb/dexUtils/connection'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'
import React, { useState } from 'react'
import { graphql } from 'react-apollo'
import { Link, useLocation } from 'react-router-dom'
import { compose } from 'recompose'
import { CustomCard, PanelWrapper } from '../Chart.styles'
import ListingRequestPopup from './ListingRequestPopup/ListingRequestPopup'
import {
  RedButton,
  DropdownContainer,
  DropwodnItem,
  MenuDropdown,
  MenuDropdownInner,
  MenuDropdownLink,
} from './styles'
import { FeedbackPopup } from './UsersFeedbackPopup'

export const CardsPanel = ({ theme }) => {
  const location = useLocation()
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)
  const [isListingRequestPopupOpen, setIsListingRequestPopupOpen] = useState(
    false
  )

  const [tradingMenuOpen, setTradingMenuOpen] = useState(false)

  const CARD_STYLE: React.CSSProperties = {
    // position: 'relative',
    display: 'flex',
    maxWidth: '100%',
    flexGrow: 1,
    border: '0',
    overflow: 'visible',
  }

  const LOGO_LINK_STYLE: React.CSSProperties = {
    width: '13rem',
    height: '100%',
    marginRight: '4rem',
  }

  const NAV_LINK_STYLE: React.CSSProperties = { width: '13rem' }

  const isDarkTheme = theme.palette.type === 'dark'
  // const isAnalytics = location.pathname.includes('analytics')
  // const isChartPage = location.pathname.includes('chart')
  // console.log('page', location.pathname)

  return (
    <ChartGridContainer theme={theme}>
      <PanelWrapper>
        <CustomCard theme={theme} style={CARD_STYLE}>
          <Link to={'/'} style={LOGO_LINK_STYLE}>
            <img
              style={{
                width: '100%',
                height: '100%',
              }}
              src={isDarkTheme ? AldrinLogo : LightLogo}
            />
          </Link>
          <Row
            style={{
              borderLeft: theme.palette.border.new,
              justifyContent: 'flex-end',
              padding: '1rem 2rem',
              flexWrap: 'nowrap',
            }}
          >
            <NavLinkButton
              theme={theme}
              style={NAV_LINK_STYLE}
              onClick={() => setIsFeedBackPopupOpen(true)}
            >
              Feedback &amp; Support
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              style={NAV_LINK_STYLE}
              onClick={() => setIsListingRequestPopupOpen(true)}
            >
              Request listing
            </NavLinkButton>
          </Row>
          <div
            style={{
              width: '100%',
              padding: '1rem 4rem 1rem 4rem',
              borderRight: theme.palette.border.new,
              borderLeft: theme.palette.border.new,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/chart"
              page={'chart'}
              component={(props) => <Link to={`/chart`} {...props} />}
            >
              Trading
            </NavLinkButton>
            {/* <NavLinkButton
              theme={theme}
              data-tut="analytics"
              page={'analytics'}
              pathname={location.pathname}
              component={(props) => <Link to={`/analytics/all`} {...props} />}
            >
              Analytics
            </NavLinkButton> */}
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/rebalance"
              page={'rebalance'}
              style={{ width: '13rem' }}
              component={(props) => <Link to={`/rebalance`} {...props} />}
            >
              Rebalance
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/dashboard"
              page={'dashboard'}
              style={{ width: '13rem' }}
              component={(props) => <Link to={`/dashboard`} {...props} />}
            >
              Dashboard
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="farming"
              pathname={location.pathname}
              page={'wallet'}
              component={(props) => <a href={CCAIProviderURL} {...props} />}
            >
              Wallet
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              page={'/pools'}
              pathname={location.pathname}
              style={{ width: '17rem' }}
              component={(props) => <Link to={`/pools`} {...props} />}
            >
              Liquidity Pools
              <Label
                text={'New'}
                theme={theme}
                style={{ marginLeft: '.5rem', color: '#53DF11' }}
              />
            </NavLinkButton>
            {/* {!MASTER_BUILD && (
              <NavLinkButton
                style={{ color: '#386DE6' }}
                theme={theme}
                data-tut="farming"
                pathname={location.pathname}
                page={'wallet'}
                component={(props) => <a href={CCAIProviderURL} {...props} />}
              >
                SunWallet
              </NavLinkButton>
            )} */}
            <NavLinkButton
              theme={theme}
              data-tut="token"
              pathname={location.pathname}
              page={'token'}
              component={(props) => (
                <a
                  href="https://docs.aldrin.com/dex/how-to-get-started-on-aldrin-dex"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              )}
            >
              FAQ
            </NavLinkButton>
          </div>
        </CustomCard>

        <TopBar theme={theme} />
      </PanelWrapper>
      <FeedbackPopup
        theme={theme}
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false)
        }}
      />
      <ListingRequestPopup
        theme={theme}
        open={isListingRequestPopupOpen}
        onClose={() => {
          setIsListingRequestPopupOpen(false)
        }}
      />
    </ChartGridContainer>
  )
}

const TopBar = ({ theme }) => {
  const { connected, wallet, providerUrl, updateProviderUrl } = useWallet()

  const { endpoint, setEndpoint } = useConnectionConfig()

  const isCCAIActive = providerUrl === CCAIProviderURL
  const isSolletActive = providerUrl === 'https://www.sollet.io'
  const isSolletExtensionActive =
    providerUrl === 'https://www.sollet.io/extension'
  const isMathWalletActive = providerUrl === 'https://www.mathwallet.org'
  const isSolongWallet = providerUrl === 'https://solongwallet.com'

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {!connected && (
        <Row style={{ paddingLeft: '4rem' }} data-tut="wallet" wrap={'nowrap'}>
          <ConnectWalletDropdown
            theme={theme}
            height={'4rem'}
            id={'navBar'}
            isNavBar={true}
            showOnTop={true}
          />
        </Row>
      )}
      {connected && (
        <RowContainer wrap="nowrap">
          <SvgIcon
            src={WalletIcon}
            width="1.6rem"
            height="1.6rem"
            style={{ margin: '0 2rem' }}
          />
          <Row direction="column" align="flex-start" margin="0 0 1rem 0">
            <Title fontSize="1rem" fontFamily="Avenir Next">
              {isCCAIActive ? (
                <>
                  <span style={{ fontFamily: 'Avenir Next Demi' }}>
                    Wallet™
                  </span>{' '}
                  &nbsp; by Aldrin.com
                </>
              ) : isSolletActive ? (
                'Sollet Wallet'
              ) : isSolletExtensionActive ? (
                'Sollet Extension Wallet'
              ) : isMathWalletActive ? (
                'Math Wallet'
              ) : isSolongWallet ? (
                'Solong Wallet'
              ) : (
                'Wallet'
              )}
            </Title>
            <Title
              fontFamily="Avenir Next"
              color={'rgb(147, 160, 178)'}
              fontSize="1rem"
            >
              {wallet?.publicKey?.toBase58()}
            </Title>
          </Row>
          <RedButton
            width="10rem"
            height="2rem"
            theme={theme}
            fontSize="1.2rem"
            onClick={() => {
              wallet?.disconnect && wallet.disconnect()
            }}
            style={{
              position: 'absolute',
              right: '0',
              bottom: '.5rem',
              fontFamily: 'Avenir Next Demi',
            }}
          >
            Disconnect
          </RedButton>
        </RowContainer>
      )}
    </div>
  )
}

const MemoizedCardsPanel = React.memo(CardsPanel)

export default compose(
  withTheme(),
  withApolloPersist,
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeMode',
  }),
  graphql(changePositionMode, { name: 'changePositionModeMutation' }),
  graphql(updateThemeMode, { name: 'updateThemeModeMutation' })
)(MemoizedCardsPanel)

import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import styled from 'styled-components'

import { NavLink, useLocation, Link } from 'react-router-dom'
import { MASTER_BUILD } from '@core/utils/config'

import {
  RowContainer,
  Row,
  ReusableTitle as Title,
  Line,
} from '@sb/compositions/AnalyticsRoute/index.styles'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { changePositionMode } from '@core/graphql/mutations/chart/changePositionMode'
import { TOGGLE_THEME_MODE } from '@core/graphql/mutations/app/toggleThemeMode'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { updateThemeMode } from '@core/graphql/mutations/chart/updateThemeMode'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import {
  ChartGridContainer,
  PanelWrapper,
  CustomCard,
} from '@sb/compositions/Chart/Chart.styles'

import { DEFAULT_MARKET } from '@sb/dexUtils/markets'
import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { ENDPOINTS, useConnectionConfig } from '@sb/dexUtils/connection'
import OvalSelector from '@sb/components/OvalSelector'
import AldrinLogo from '@icons/Aldrin.svg'

import SerumCCAILogo from '@icons/serumCCAILogo.svg'
import LightLogo from '@icons/lightLogo.svg'
import SvgIcon from '@sb/components/SvgIcon'

import { withTheme } from '@material-ui/core'
import WalletIcon from '@icons/walletIcon.svg'
import NetworkDropdown from '@sb/compositions/Chart/components/NetworkDropdown/NetworkDropdown'

import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'
import ConnectWalletDropdown from '@sb/components/ConnectWalletDropdown/index'
import { BetaLabel } from '@sb/components/BetaLabel/BetaLabel'
import { WhiteButton } from '../../Homepage/styles'
import { FeedbackPopup } from './UsersFeedbackPopup'
import ListingRequestPopup from './ListingRequestPopup/ListingRequestPopup'

export const NavBarLink = styled(({ style, ...props }) => (
  <NavLink {...props} />
))`
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  ${(props) => props.style};

  &:hover {
    color: ${(props) => props.theme.palette.blue.serum};
  }
`

export const NavBarALink = styled(({ style, ...props }) => <a {...props} />)`
  font-family: Avenir Next Demi;
  text-transform: capitalize;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.4rem;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 100%;
  display: flex;
  align-items: center;
  ${(props) => props.style};

  &:hover {
    color: ${(props) => props.theme.palette.blue.serum};
  }
`

const Token = styled.a`
  height: 100%;
  width: 10rem;
  border-radius: 0.7rem;
  background: linear-gradient(106.89deg, #5eb5a8 17.87%, #3862c1 82.13%);
  font-family: 'Avenir Next Demi';
  color: #fff;
  padding: 1rem 0;
  text-align: center;
  font-size: 1.2rem;
`

const RedButton = styled((props) => (
  <BtnCustom
    btnWidth={props.width || '50%'}
    fontSize="1.4rem"
    height="4.5rem"
    textTransform="capitalize"
    backgroundColor={props.background || 'transparent'}
    borderColor={props.background || 'transparent'}
    btnColor={props.color || props.theme.palette.red.main}
    borderRadius="1rem"
    border={props.border || 'none'}
    {...props}
  />
))`
  outline: none;
`

export const CardsPanel = ({ theme }) => {
  const location = useLocation()
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)
  const [isListingRequestPopupOpen, setIsListingRequestPopupOpen] =
    useState(false)

  const isDarkTheme = theme.palette.type === 'dark'
  const isAnalytics = location.pathname.includes('analytics')
  const isChartPage = location.pathname.includes('chart')
  console.log('page', location.pathname)

  return (
    <ChartGridContainer isChartPage={isChartPage} theme={theme}>
      <PanelWrapper>
        <CustomCard
          theme={theme}
          style={{
            // position: 'relative',
            display: 'flex',
            maxWidth: '100%',
            flexGrow: 1,
            border: '0',
          }}
        >
          <Link
            to="/"
            style={{
              width: '13rem',
              height: '100%',
              marginRight: '4rem',
            }}
          >
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
              style={{ width: '16rem' }}
              onClick={() => setIsFeedBackPopupOpen(true)}
            >
              Feedback & Support
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              style={{ width: '13rem' }}
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
            {/* <NavLinkButton
              theme={theme}
              page={'/'}
              pathname={location.pathname === '/' ? location.pathname : ''}
              component={(props) => <Link to={`/`} {...props} />}
            >
              Home
            </NavLinkButton> */}
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/chart"
              page="chart"
              component={(props) => <Link to="/chart" {...props} />}
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
              page="rebalance"
              style={{ width: '13rem' }}
              component={(props) => <Link to="/rebalance" {...props} />}
            >
              Rebalance
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/dashboard"
              page="dashboard"
              style={{ width: '13rem' }}
              component={(props) => <Link to="/dashboard" {...props} />}
            >
              Dashboard
              <BetaLabel theme={theme} style={{ marginLeft: '.5rem' }} />
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="farming"
              pathname={location.pathname}
              page="wallet"
              component={(props) => <a href={CCAIProviderURL} {...props} />}
            >
              Wallet
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              page="/pools"
              pathname={location.pathname}
              component={(props) => <Link to="/pools" {...props} />}
            >
              Liquidity Pools
            </NavLinkButton>
            {/* 
            {!MASTER_BUILD && (
              <NavLinkButton
                theme={theme}
                page={'/swaps'}
                pathname={location.pathname}
                component={(props) => <Link to={`/swaps`} {...props} />}
              >
                Swaps
              </NavLinkButton>
            )}
            {!MASTER_BUILD && (
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
              page="token"
              component={(props) => (
                <a
                  href="https://rin.aldrin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              )}
            >
              Token
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
      <div data-tut="connection-dropdown">
        <NetworkDropdown
          endpoint={endpoint}
          setEndpoint={setEndpoint}
          theme={theme}
          isWalletConnected={connected}
        />
      </div>

      {!connected && (
        <Row style={{ paddingLeft: '4rem' }} data-tut="wallet" wrap="nowrap">
          <ConnectWalletDropdown
            theme={theme}
            height="4rem"
            id="navBar"
            isNavBar
            showOnTop
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
              color="rgb(147, 160, 178)"
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

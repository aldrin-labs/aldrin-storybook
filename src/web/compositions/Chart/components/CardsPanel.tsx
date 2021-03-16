import React, { useState, useCallback } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import greenArrow from '@icons/greenArrow.svg'
import { NavLink } from 'react-router-dom'

import copy from 'clipboard-copy'
import { useLocation, useHistory, Link } from 'react-router-dom'
import { RowContainer, Row } from '@sb/compositions/AnalyticsRoute/index.styles'

import MarketStats from './MarketStats/MarketStats'
import { TooltipCustom } from '@sb/components/index'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { changePositionMode } from '@core/graphql/mutations/chart/changePositionMode'
import { TOGGLE_THEME_MODE } from '@core/graphql/mutations/app/toggleThemeMode'
import { changeHedgeModeInCache } from '@core/utils/tradingComponent.utils'
import { checkLoginStatus } from '@core/utils/loginUtils'
import { PanelWrapper, CustomCard } from '../Chart.styles'
import { withApolloPersist } from '@sb/compositions/App/ApolloPersistWrapper/withApolloPersist'
import { updateThemeMode } from '@core/graphql/mutations/chart/updateThemeMode'
import { useMarket } from '@sb/dexUtils/markets'
import { getDecimalCount } from '@sb/dexUtils/utils'
import { ChartGridContainer } from '@sb/compositions/Chart/Chart.styles'
import { withMarketUtilsHOC } from '@core/hoc/withMarketUtilsHOC'

import { DEFAULT_MARKET } from '@sb/dexUtils/markets'
import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { ENDPOINTS, useConnectionConfig } from '@sb/dexUtils/connection'
import { Line } from '@sb/compositions/AnalyticsRoute/index.styles'
import styled from 'styled-components'
import OvalSelector from '@sb/components/OvalSelector'
import SerumCCAILogo from '@icons/serumCCAILogo.svg'
import LightLogo from '@icons/lightLogo.svg'
import SvgIcon from '@sb/components/SvgIcon'

import Wallet from '@icons/Wallet.svg'

import SunDisabled from '@icons/sunDisabled.svg'
import SunActive from '@icons/sunActive.svg'

import MoonDisabled from '@icons/moonDisabled.svg'
import MoonActive from '@icons/moonActive.svg'

import IconButton from '@material-ui/core/IconButton'
import TelegramIcon from '@icons/telegram.svg'
import DiscordIcon from '@icons/discord.svg'
import TwitterIcon from '@icons/twitter.svg'
import { withTheme } from '@material-ui/core'
import NetworkDropdown from '@sb/compositions/Chart/components/NetworkDropdown/NetworkDropdown'

import Dropdown from '@sb/components/Dropdown'
import NavLinkButton from '@sb/components/NavBar/NavLinkButton/NavLinkButton'

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

const LinkBlock = styled.a`
  display: flex;
  justify-content: center;
  height: 100%;
`

const WalletId = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1rem;
  cursor: pointer;
  transition: 2s;

  .wallet {
    visibility: hidden;
  }

  &:hover .wallet {
    transition: 2s;
    visibility: visible;
  }
`

export const CardsPanel = ({ theme, setMarketAddress }) => {
  const location = useLocation()

  const isDarkTheme = theme.palette.type === 'dark'
  const isAnalytics = location.pathname.includes('analytics')
  const isChartPage = location.pathname.includes('chart')

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
            to={'/chart/spot/SRM_USDT'}
            style={{
              padding: '1rem 0',
              height: '100%',
            }}
            onClick={() => {
              setMarketAddress(DEFAULT_MARKET?.address.toBase58())
            }}
          >
            <img
              style={{
                height: '100%',
              }}
              src={isDarkTheme ? SerumCCAILogo : LightLogo}
            />
          </Link>
          <div
            style={{
              width: '100%',
              marginLeft: '4rem',
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
              data-tut="farming"
              pathname={location.pathname}
              page={'wallet'}
              component={(props) => (
                <a
                  href="https://develop.wallet.cryptocurrencies.ai/"
                  {...props}
                />
              )}
            >
              Wallet
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              pathname={location.pathname}
              to="/chart"
              page={'chart'}
              component={(props) => <Link to={`/chart`} {...props} />}
            >
              Trading
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="analytics"
              page={'analytics'}
              pathname={location.pathname}
              component={(props) => <Link to={`/analytics/all`} {...props} />}
            >
              {' '}
              Analytics
            </NavLinkButton>
            <NavLinkButton
              theme={theme}
              data-tut="farming"
              page={'addressbook'}
              pathname={location.pathname}
              component={(props) => <Link to={`/addressbook`} {...props} />}
            >
              {' '}
              Addressbook
            </NavLinkButton>
          </div>
        </CustomCard>

        <TopBar theme={theme} />
      </PanelWrapper>
    </ChartGridContainer>
  )
}

const TopBar = ({ theme }) => {
  const {
    connected,
    wallet,
    providerUrl,
    updateProviderUrl,
    setProvider,
  } = useWallet()

  const { endpoint, setEndpoint } = useConnectionConfig()
  const location = useLocation()
  const history = useHistory()
  const [isOpenPopup, setPopupOpen] = useState(false)

  const publicKey = wallet?.publicKey?.toBase58()

  const isDarkTheme = theme.palette.type === 'dark'
  const isWalletConnected = connected
  const isCCAIActive =
    providerUrl === 'https://develop.wallet.cryptocurrencies.ai'

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {/* <SvgIcon
        width={'auto'}
        height={'100%'}
        styledComponentsAdditionalStyle={{
          padding: '1rem 2rem 1rem 0',
          cursor: 'pointer',
        }}
        src={isDarkTheme ? SunDisabled : SunActive}
        onClick={() => {
          if (isDarkTheme) {
            theme.updateMode('light')
          }
        }}
      />

      <SvgIcon
        width={'auto'}
        height={'100%'}
        styledComponentsAdditionalStyle={{
          padding: '1rem 2rem 1rem 0',
          cursor: 'pointer',
        }}
        src={isDarkTheme ? MoonActive : MoonDisabled}
        onClick={() => {
          if (!isDarkTheme) {
            theme.updateMode('dark')
          }
        }}
      /> */}

      {/* <div>
        <OvalSelector
          theme={theme}
          selectStyles={selectStyles(theme)}
          onChange={({ value }) => {
            setEndpoint(value)
          }}
          value={{
            value: endpoint,
            label: ENDPOINTS.find((a) => a.endpoint === endpoint).name,
          }}
          options={ENDPOINTS.map((endpoint) => ({
            value: endpoint.endpoint,
            label: endpoint.name,
          }))}
        />
      </div>
      <div>
        <OvalSelector
          theme={theme}
          selectStyles={selectStyles(theme)}
          onChange={({ value }) => {
            setProvider(value)
          }}
          value={{ value: providerUrl, label: providerName }}
          options={WALLET_PROVIDERS.map((provider) => ({
            value: provider.url,
            label: provider.name,
          }))}
        />
      </div> */}
      {/* <div>
        <OvalSelector
          theme={theme}
          selectStyles={selectStyles(theme)}
          onChange={({ value }) => {
            setProvider(value)
            console.log('value', value)
          }}
          value={{ value: providerUrl, label: providerName }}
          options={WALLET_PROVIDERS.map((provider) => ({
            value: provider.url,
            label: provider.name,
          }))}
        />
      </div> */}
      {/* <WalletBlock /> */}
      {/* <div data-tut="connection-dropdown">
        <NetworkDropdown
          endpoint={endpoint}
          setEndpoint={setEndpoint}
          theme={theme}
          isWalletConnected={connected}
        />
      </div> */}

      <Row data-tut="wallet" wrap={'nowrap'}>
        <Dropdown
          wallet={wallet}
          connected={connected}
          theme={theme}
          setProvider={setProvider}
          providerUrl={providerUrl}
        />
        {/* <BtnCustom
          btnWidth={'14rem'}
          height={'3.5rem'}
          borderRadius=".6rem"
          btnColor={theme.palette.blue.serum}
          fontSize={'1.2rem'}
          textTransform={'capitalize'}
          margin={'0 0 0 3rem'}
          style={{
            display: 'flex',
            textTransform: 'none',
            padding: '1rem',
          }}
          onClick={() => {
            console.log('CLICK ON CCAI')

            if (isCCAIActive && !isWalletConnected) {
              wallet.connect()
              return
            }

            updateProviderUrl('https://develop.wallet.cryptocurrencies.ai')
          }}
        >
          Connect Wallet™
        </BtnCustom> */}
      </Row>
      {connected && (
        <WalletId
          theme={theme}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 1rem',
            cursor: 'pointer',
          }}
        >
          <a
            target={'_blank'}
            rel={'noopener noreferrer'}
            href={`https://explorer.solana.com/address/${publicKey}`}
            style={{
              color: theme.palette.blue.serum,
              fontSize: '1.4rem',
              textDecoration: 'none',
            }}
          >
            <SvgIcon src={Wallet} />
          </a>
          <SvgIcon
            src={greenArrow}
            width={'1.3rem'}
            height={'1.3rem'}
            style={{ marginLeft: '1rem' }}
          />{' '}
          <div
            style={{
              position: 'absolute',
              right: '0',
              top: '5rem',
              zIndex: '10',
              background: theme.palette.white.background,
              border: theme.palette.border.main,
              padding: '2rem 1rem',
              boxShadow: '0px 4px 8px rgba(10, 19, 43, 0.1)',
            }}
            className="wallet"
          >
            <a
              target={'_blank'}
              rel={'noopener noreferrer'}
              href={`https://explorer.solana.com/address/${publicKey}`}
              style={{
                color: theme.palette.blue.serum,
                fontSize: '1.4rem',
                textDecoration: 'none',
              }}
            >
              {publicKey}
            </a>
          </div>
        </WalletId>
      )}
    </div>
  )
}

const MemoizedCardsPanel = React.memo(CardsPanel)

export default compose(
  withTheme(),
  withMarketUtilsHOC,
  withApolloPersist,
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeMode',
  }),
  graphql(changePositionMode, { name: 'changePositionModeMutation' }),
  graphql(updateThemeMode, { name: 'updateThemeModeMutation' })
)(MemoizedCardsPanel)

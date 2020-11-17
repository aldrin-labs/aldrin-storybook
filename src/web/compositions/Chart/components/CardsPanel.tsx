import React, { useState, useCallback } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import greenArrow from '@icons/greenArrow.svg'

import copy from 'clipboard-copy'
import { useLocation, useHistory, Link } from 'react-router-dom'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import { NavBarLink } from '@sb/components/PortfolioMainAllocation/PortfolioMainAllocation.styles'

import MarketStats from './MarketStats/MarketStats'
import { TooltipCustom } from '@sb/components/index'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
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

import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet'
import { ENDPOINTS, useConnectionConfig } from '@sb/dexUtils/connection'
import { Line } from '@sb/compositions/AnalyticsRoute/index'
import styled from 'styled-components'
import OvalSelector from '@sb/components/OvalSelector'
import SerumCCAILogo from '@icons/serumCCAILogo.svg'
import LightLogo from '@icons/lightLogo.svg'
import SvgIcon from '@sb/components/SvgIcon'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
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
import color from '@material-ui/core/colors/amber'

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

const TelegramLink = (props) => (
  <a
    href="https://t.me/CryptocurrenciesAi"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
)

const DiscordLink = (props) => (
  <a
    href="https://discord.com/invite/2EaKvrs"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
)

const TwitterLink = (props) => (
  <a
    href="https://twitter.com/CCAI_Official"
    target="_blank"
    rel="noopener noreferrer"
    {...props}
  />
)

const selectStyles = (theme: Theme) => ({
  height: '100%',
  background: theme.palette.white.background,
  marginRight: '.8rem',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: theme.palette.white.background,
  border: theme.palette.border.main,
  borderRadius: '0.75rem',
  boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
  width: '14rem',
  '& div': {
    cursor: 'pointer',
    color: theme.palette.dark.main,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  '& svg': {
    color: theme.palette.grey.light,
  },
  '.custom-select-box__control': {
    padding: '0 .75rem',
  },
  '.custom-select-box__menu': {
    minWidth: '130px',
    marginTop: '0',
    borderRadius: '0',
    boxShadow: '0px 4px 8px rgba(10,19,43,0.1)',
  },
})

const TopBar = ({ theme }) => {
  const {
    connected,
    wallet,
    providerUrl,
    providerName,
    setProvider,
  } = useWallet()
  const { endpoint, setEndpoint } = useConnectionConfig()
  const location = useLocation()
  const history = useHistory()
  const [isOpenPopup, setPopupOpen] = useState(false)

  const publicKey = wallet?.publicKey?.toBase58()

  const handleClick = useCallback(
    (e) => {
      history.push(e.key)
    },
    [history]
  )

  const isDarkTheme = theme.palette.type === 'dark'

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {/* </div> */}
      {/* <div style={{ display: 'flex' }}> */}

      <div>
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
      </div>
      <div data-tut="wallet">
        <BtnCustom
          type="text"
          size="large"
          onClick={connected ? wallet.disconnect : wallet.connect}
          btnColor={theme.palette.blue.serum}
          btnWidth={'14rem'}
          height={'100%'}
        >
          {/* <UserOutlined /> */}
          {!connected ? 'Connect wallet' : 'Disconnect'}
        </BtnCustom>
      </div>
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
          <SvgIcon src={Wallet} />
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

export const CardsPanel = ({
  view = 'default',
  theme,
  marketType = 0,
  activeExchange = 'serum',
}) => {
  const { market } = useMarket()
  const location = useLocation()

  const quantityPrecision =
    market?.minOrderSize && getDecimalCount(market.minOrderSize)
  const pricePrecision = market?.tickSize && getDecimalCount(market.tickSize)

  const isDarkTheme = theme.palette.type === 'dark'
  const isAnalytics = location.pathname.includes('analytics')
  const isChartPage = location.pathname.includes('chart')

  const pair = isChartPage ? location.pathname.split('/')[3] : 'SRM_USDT'

  if (isChartPage && !location.pathname.split('/')[3]) {
    return null
  }

  console.log('pair', pair)
  return (
    <ChartGridContainer>
      <PanelWrapper>
        {/* {view === 'onlyCharts' && (
          <LayoutSelector userId={_id} themeMode={themeMode} />
        )} */}

        {/* <SelectExchange
          style={{ height: '100%', width: '20%' }}
          changeActiveExchangeMutation={changeActiveExchangeMutation}
          activeExchange={activeExchange}
          currencyPair={pair}
          selectStyles={selectStyles}
        /> */}

        <CustomCard
          theme={theme}
          style={{
            // position: 'relative',
            display: 'flex',
            maxWidth: '75%',

            marginRight: '.4rem',
            flexGrow: 1,
            border: '0',
          }}
        >
          <Link to={'/chart/spot/SRM_USDT'} style={{ width: '17rem' }}>
            <img
              style={{
                height: '100%',
                padding: '0 3rem',
                borderRight: theme.palette.border.main,
              }}
              src={isDarkTheme ? SerumCCAILogo : LightLogo}
            />
          </Link>
          <div
            style={{
              width: '20%',
              marginLeft: '4rem',
              paddingRight: '4rem',
              borderRight: theme.palette.border.main,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <NavBarLink
              theme={theme}
              style={{
                color: location.pathname.includes('chart')
                  ? theme.palette.blue.serum
                  : theme.palette.grey.text,
                textDecoration: location.pathname.includes('chart')
                  ? 'underline'
                  : 'none',
              }}
              to="/chart"
            >
              Trading
            </NavBarLink>
            <NavBarLink
              theme={theme}
              data-tut="analytics"
              to="/analytics"
              style={{
                color: location.pathname.includes('analytics')
                  ? theme.palette.blue.serum
                  : theme.palette.grey.text,

                textDecoration: location.pathname.includes('analytics')
                  ? 'underline'
                  : 'none',
              }}
            >
              {' '}
              Analytics
            </NavBarLink>
            <NavBarLink
              theme={theme}
              data-tut="farming"
              to="/rewards"
              style={{
                color: location.pathname.includes('rewards')
                  ? theme.palette.blue.serum
                  : theme.palette.grey.text,
                textDecoration: location.pathname.includes('rewards')
                  ? 'underline'
                  : 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {' '}
              Farming 👨‍🌾
            </NavBarLink>
          </div>
          {isChartPage && (
            <div data-tut="pairs">
              <AutoSuggestSelect
                value={view === 'default' && pair}
                id={'pairSelector'}
                view={view}
                style={{ width: '13rem' }}
                activeExchange={activeExchange}
                selectStyles={{ ...selectStyles(theme) }}
                marketType={marketType}
                quantityPrecision={quantityPrecision}
                pricePrecision={pricePrecision}
              />
            </div>
          )}

          {/* <TooltipCustom
            title="Cryptocurrencies.ai is a Binance partner exchange"
            enterDelay={250}
            component={ */}
          {isChartPage && (
            <MarketStats
              theme={theme}
              symbol={pair}
              marketType={marketType}
              exchange={activeExchange}
              quantityPrecision={quantityPrecision}
              pricePrecision={pricePrecision}
            />
          )}

          {/* }
          /> */}
        </CustomCard>

        <TopBar theme={theme} />
        <Line top={'calc(100% + 1rem)'} />
        {/*         
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <TooltipCustom
            title={'Our Twitter'}
            enterDelay={250}
            component={
              <TwitterLink>
                <SvgIcon height={'80%'} width={'auto'} style={{ padding: '0 1rem', cursor: 'pointer'}} src={TwitterIcon} />
              </TwitterLink>
            }
          />


          <TooltipCustom
            title={'Discord chat'}
            enterDelay={250}
            component={
              <DiscordLink>
                <SvgIcon height={'80%'} width={'auto'} style={{ padding: '0 1rem', cursor: 'pointer'}} src={DiscordIcon} />
              </DiscordLink>
            }
          />

          <TooltipCustom
            title={'Telegram chat'}
            enterDelay={250}
            component={
              <TelegramLink>
                <SvgIcon height={'80%'} width={'auto'} style={{ padding: '0 1rem', cursor: 'pointer' }} src={TelegramIcon} />
              </TelegramLink>
            }
          />
          </div> */}
      </PanelWrapper>
    </ChartGridContainer>
  )
}

export default compose(
  withTheme(),
  withApolloPersist,
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeMode',
  }),
  graphql(changePositionMode, { name: 'changePositionModeMutation' }),
  graphql(updateThemeMode, { name: 'updateThemeModeMutation' })
)(CardsPanel)

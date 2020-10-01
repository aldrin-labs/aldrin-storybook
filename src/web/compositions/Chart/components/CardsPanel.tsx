import React, { useState, useCallback } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import copy from 'clipboard-copy'
import { useLocation, useHistory } from 'react-router-dom'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'

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

import { useWallet, WALLET_PROVIDERS } from '@sb/dexUtils/wallet';
import { ENDPOINTS, useConnectionConfig } from '@sb/dexUtils/connection';

import OvalSelector from '@sb/components/OvalSelector'
import SerumCCAILogo from '@icons/serumCCAILogo.svg'
import SvgIcon from '@sb/components/SvgIcon'

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'

import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import HelpIcon from '@material-ui/icons/Help';

import SunDisabled from '@icons/sunDisabled.svg'
import SunActive from '@icons/sunActive.svg'

import MoonDisabled from '@icons/moonDisabled.svg'
import MoonActive from '@icons/moonActive.svg'

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
  const { connected, wallet, providerUrl, providerName, setProvider } = useWallet();
  const { endpoint, setEndpoint } = useConnectionConfig();
  const location = useLocation();
  const history = useHistory();
  const [isOpenPopup, setPopupOpen] = useState(false)

  const publicKey = wallet?.publicKey?.toBase58();

  const handleClick = useCallback(
    (e) => {
      history.push(e.key);
    },
    [history],
  );

  const isDarkTheme = theme.palette.type === 'dark'

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SvgIcon 
          width={'auto'} 
          height={'100%'} 
          styledComponentsAdditionalStyle={{ padding: '0 2rem 0 0'}} 
          src={isDarkTheme ? SunDisabled : SunActive} 
          onClick={() => {
            if (isDarkTheme) {
              theme.updateMode('light')
            }
          }}
        />
        {/* </div> */}
        {/* <div style={{ display: 'flex' }}> */}
        <SvgIcon 
          width={'auto'} 
          height={'100%'} 
          styledComponentsAdditionalStyle={{ padding: '0 2rem 0 0'}} 
          src={isDarkTheme ? MoonActive : MoonDisabled} 
          onClick={() => {
            if (!isDarkTheme) {
              theme.updateMode('dark')
            }
          }} 
        />
      <div>
        <OvalSelector
          theme={theme}
          selectStyles={selectStyles(theme)}
          onChange={({ value }) => {
            setEndpoint(value)
          }}
          value={{ value: endpoint, label: ENDPOINTS.find(a => a.endpoint === endpoint).name }}
          options={ENDPOINTS.map(endpoint => ({ value: endpoint.endpoint, label: endpoint.name }))}
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
          options={WALLET_PROVIDERS.map(provider => ({ value: provider.url, label: provider.name }))}
        />
      </div>
      <div>
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
        <div
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem', cursor: 'pointer' }}
        >
          <HelpIcon onClick={() => setPopupOpen(!isOpenPopup)} style={{ color: theme.palette.blue.serum }} />
          {
            isOpenPopup && (
          <div 
            style={{ 
              position: 'absolute', 
              right: 0, 
              top: '5rem', 
              zIndex: 10, 
              background: theme.palette.white.background, 
              border: theme.palette.border.main, 
              padding: '2rem 1rem', 
              boxShadow: '0px 4px 8px rgba(10,19,43,0.1)' 
          }}>
            <a 
              target={'_blank'}
              rel={'noopener noreferrer'}
               href={`https://explorer.solana.com/address/${publicKey}`} 
              style={{ color: theme.palette.blue.serum, fontSize: '1.4rem', textDecoration: 'none' }}
            >{publicKey}</a>
          </div>)
          }
        </div>
      )}
    </div>
  );
}


export const CardsPanel = ({
  _id,
  pair,
  view,
  theme,
  marketType,
  quantityPrecision,
  pricePrecision,
  changePositionModeMutation,
  selectedKey,
  showChangePositionModeResult,
  activeExchange,
}) => {
  const isDarkTheme = theme.palette.type === 'dark'

  return (
    <>
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
            maxWidth: '58.33333%',
            marginRight: '.4rem',
            flexGrow: 1,
            border: '0',
          }}
        >
          <img style={{ height: '100%', padding: '0 3rem', borderRight: theme.palette.border.main }} src={SerumCCAILogo} />

          <AutoSuggestSelect
            value={view === 'default' && pair}
            id={'pairSelector'}
            view={view}
            style={{ width: '20rem' }}
            activeExchange={activeExchange}
            selectStyles={{ ...selectStyles(theme) }}
            marketType={marketType}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
          />

          {/* <TooltipCustom
            title="Cryptocurrencies.ai is a Binance partner exchange"
            enterDelay={250}
            component={ */}
          <MarketStats
            theme={theme}
            symbol={pair}
            marketType={marketType}
            exchange={activeExchange}
            quantityPrecision={quantityPrecision}
            pricePrecision={pricePrecision}
          />
          {/* }
          /> */}
        </CustomCard>

        <TopBar theme={theme} />
      </PanelWrapper>
    </>
  )
}

export default compose(
  withApolloPersist,
  graphql(TOGGLE_THEME_MODE, {
    name: 'toggleThemeMode',
  }),
  graphql(changePositionMode, { name: 'changePositionModeMutation' }),
  graphql(updateThemeMode, { name: 'updateThemeModeMutation' }),
)(CardsPanel)

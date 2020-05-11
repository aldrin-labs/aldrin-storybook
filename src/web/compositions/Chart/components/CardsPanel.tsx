import React from 'react'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import LayoutSelector from '@core/components/LayoutSelector'
import KeySelector from '@core/components/KeySelector'
import SelectExchange from '../Inputs/SelectExchange/SelectExchange'
import { SmartTradeButton } from '@sb/components/TraidingTerminal/styles'
import MarketStats from './MarketStats/MarketStats'
import { TooltipCustom } from '@sb/components/index'

import { PanelWrapper, CustomCard } from '../Chart.styles'

const selectStyles = {
  height: '100%',
  background: '#FFFFFF',
  marginRight: '.8rem',
  cursor: 'pointer',
  padding: 0,
  backgroundColor: '#fff',
  border: '0.1rem solid #e0e5ec',
  borderRadius: '0.75rem',
  boxShadow: '0px 0px 1.2rem rgba(8, 22, 58, 0.1)',
  width: '20%',
  '& div': {
    cursor: 'pointer',
    color: '#16253D',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  '& svg': {
    color: '#7284A0',
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
}

export const CardsPanel = ({
  _id,
  pair,
  view,
  themeMode,
  activeExchange,
  changeActiveExchangeMutation,
  isDefaultTerminalViewMode,
  updateTerminalViewMode,
  marketType,
  quantityPrecision,
  pricePrecision,
}) => {
  return (
    <>
      <PanelWrapper>
        {view === 'onlyCharts' && (
          <LayoutSelector userId={_id} themeMode={themeMode} />
        )}

        {/* <SelectExchange
          style={{ height: '100%', width: '20%' }}
          changeActiveExchangeMutation={changeActiveExchangeMutation}
          activeExchange={activeExchange}
          currencyPair={pair}
          selectStyles={selectStyles}
        /> */}

        <CustomCard
          style={{
            position: 'relative',
            display: 'flex',
            width: 'auto',
            marginRight: '1rem',
            flexGrow: 1,
          }}
        >
          <TooltipCustom
            title="Cryptocurrencies.ai is a Binance partner exchange"
            enterDelay={250}
            component={
              <MarketStats
                symbol={pair}
                marketType={marketType}
                exchange={activeExchange}
                quantityPrecision={quantityPrecision}
                pricePrecision={pricePrecision}
              />
            }
          />
        </CustomCard>

        {view === 'default' && (
          <KeySelector
            exchange={activeExchange}
            selectStyles={{ ...selectStyles, width: '20%' }}
            isAccountSelect={true}
          />
        )}

        <AutoSuggestSelect
          style={{ width: '20%', minWidth: '0' }}
          value={view === 'default' && pair}
          id={'pairSelector'}
          view={view}
          activeExchange={activeExchange}
          selectStyles={selectStyles}
          marketType={marketType}
          quantityPrecision={quantityPrecision}
          pricePrecision={pricePrecision}
        />

        <SmartTradeButton
          style={{ height: '100%', width: '20%', marginRight: '.4rem' }}
          type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
          id="smartTradingButton"
          onClick={() => {
            updateTerminalViewMode(
              isDefaultTerminalViewMode ? 'smartOrderMode' : 'default'
            )

            const joyrideStep = document.getElementById('react-joyride-step-7')
            const joyrideOverlay = document.getElementById(
              'react-joyride-portal'
            )

            if (joyrideStep && joyrideOverlay) {
              joyrideStep.style.display = 'none'
              joyrideOverlay.style.display = 'none'
            }
          }}
        >
          {isDefaultTerminalViewMode ? 'go to smart trading' : 'back'}
        </SmartTradeButton>

        {/* {view === 'default' && (
        <TransparentExtendedFAB
          onClick={() => {
            this.setState((prevState) => ({
              activeChart:
                prevState.activeChart === 'candle' ? 'depth' : 'candle',
            }))
          }}
        >
          {activeChart === 'candle' ? 'orderbook' : 'chart'}
        </TransparentExtendedFAB>
      )} */}
      </PanelWrapper>
    </>
  )
}

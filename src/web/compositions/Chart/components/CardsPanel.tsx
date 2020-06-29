import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { useLocation, useHistory } from 'react-router-dom'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import LayoutSelector from '@core/components/LayoutSelector'
import KeySelector from '@core/components/KeySelector'
import SelectExchange from '../Inputs/SelectExchange/SelectExchange'
import { SmartTradeButton } from '@sb/components/TraidingTerminal/styles'
import MarketStats from './MarketStats/MarketStats'
import { TooltipCustom } from '@sb/components/index'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'
import { changePositionMode } from '@core/graphql/mutations/chart/changePositionMode'
import { changeHedgeModeInCache } from '@core/utils/tradingComponent.utils'
import { getLoginStatus } from '@core/utils/auth.utils'
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
  isDefaultTerminalViewMode,
  updateTerminalViewMode,
  marketType,
  quantityPrecision,
  pricePrecision,
  changePositionModeMutation,
  selectedKey,
  showChangePositionModeResult,
}) => {
  const hedgeMode = selectedKey.hedgeMode

  const changePositionMode = async (hedgeMode: boolean) => {
    try {
      const result = await changePositionModeMutation({
        variables: {
          keyId: selectedKey.keyId,
          hedgeMode,
        },
      })

      return result.data.changePositionMode
    } catch (err) {
      return { errors: err }
    }
  }

  const changePositionModeWithStatus = async (hedgeMode: boolean) => {
    changeHedgeModeInCache({
      selectedTradingKey: selectedKey.keyId,
      hedgeMode,
      isFuturesWarsKey: selectedKey.isFuturesWarsKey,
    })

    const result = await changePositionMode(hedgeMode)

    if (
      (result.status === 'ERR' || result.errors) &&
      result.binanceMessage !== 'No need to change position side.'
    ) {
      changeHedgeModeInCache({
        selectedTradingKey: selectedKey.keyId,
        hedgeMode: !hedgeMode,
        isFuturesWarsKey: selectedKey.isFuturesWarsKey,
      })
    }

    showChangePositionModeResult(result, 'Position mode')
  }

  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const authenticated = getLoginStatus()

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
          style={{
            position: 'relative',
            display: 'flex',
            width: 'auto',
            marginRight: '.4rem',
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
            selectStyles={{
              ...selectStyles,
              width: marketType === 1 ? '11%' : '15%',
            }}
            isAccountSelect={true}
          />
        )}

        <AutoSuggestSelect
          style={{ width: '15%', minWidth: '0' }}
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
          style={{ height: '100%', width: '16.5%' }}
          type={isDefaultTerminalViewMode ? 'buy' : 'sell'}
          id="smartTradingButton"
          onClick={() => {
            // for guest mode
            if (!authenticated) {
              history.push(`/login?callbackURL=${pathname}`)
              return
            }

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
        {marketType === 1 && (
          <div style={{ width: '15.5%', margin: '0 .4rem 0 .6rem' }}>
            <PillowButton
              firstHalfText={'one-way'}
              secondHalfText={'hedge'}
              secondHalfTooltip={
                'You can open a long and short at the same time. Just turn on hedge mode and open opposite positions.'
              }
              activeHalf={hedgeMode ? 'second' : 'first'}
              buttonAdditionalStyle={{
                width: '50%',
              }}
              containerStyle={{ height: '100%', margin: 0 }}
              changeHalf={() => {
                // for guest mode
                if (!authenticated) {
                  return
                }

                changePositionModeWithStatus(hedgeMode ? false : true)
              }}
            />
          </div>
        )}
      </PanelWrapper>
    </>
  )
}

export default compose(
  graphql(changePositionMode, { name: 'changePositionModeMutation' })
)(CardsPanel)

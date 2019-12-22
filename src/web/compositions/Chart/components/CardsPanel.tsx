import React from 'react'

import ComingSoon from '@sb/components/ComingSoon'
import AutoSuggestSelect from '../Inputs/AutoSuggestSelect/AutoSuggestSelect'
import LayoutSelector from '@core/components/LayoutSelector'
import KeySelector from '@core/components/KeySelector'
import SelectExchange from '../Inputs/SelectExchange/SelectExchange'
import PillowButton from '@sb/components/SwitchOnOff/PillowButton'

import {
  PanelWrapper,
  PanelCard,
  PanelCardTitle,
  PanelCardValue,
  PanelCardSubValue,
  CustomCard,
} from '../Chart.styles'

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
  width: '8.5%',
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
}) => {
  return (
    <>
      <PanelWrapper>
        {view === 'onlyCharts' && (
          <LayoutSelector userId={_id} themeMode={themeMode} />
        )}

        <SelectExchange
          style={{ height: '100%' }}
          changeActiveExchangeMutation={changeActiveExchangeMutation}
          activeExchange={activeExchange}
          currencyPair={pair}
          selectStyles={selectStyles}
        />

        {view === 'default' && (
          <KeySelector
            exchange={activeExchange}
            selectStyles={{ ...selectStyles, width: '17%' }}
            isAccountSelect={true}
          />
        )}

        <AutoSuggestSelect
          value={view === 'default' && pair}
          id={'currencyPair'}
          view={view}
          activeExchange={activeExchange}
          selectStyles={selectStyles}
        />

        <CustomCard
          style={{ position: 'relative', display: 'flex', width: '50%' }}
        >
          <ComingSoon style={{ zIndex: 1 }} />
          <PanelCard first>
            <PanelCardTitle>Last price</PanelCardTitle>
            <span>
              <PanelCardValue color="#B93B2B">9,964.01</PanelCardValue>
              <PanelCardSubValue>$9964.01</PanelCardSubValue>
            </span>
          </PanelCard>

          <PanelCard>
            <PanelCardTitle>24h change</PanelCardTitle>
            <span>
              <PanelCardValue color="#2F7619">101.12</PanelCardValue>
              <PanelCardSubValue color="#2F7619">+1.03%</PanelCardSubValue>
            </span>
          </PanelCard>

          <PanelCard>
            <PanelCardTitle>24h high</PanelCardTitle>
            <PanelCardValue>10,364.01</PanelCardValue>
          </PanelCard>

          <PanelCard>
            <PanelCardTitle>24h low</PanelCardTitle>
            <PanelCardValue>9,525.00</PanelCardValue>
          </PanelCard>

          <PanelCard>
            <PanelCardTitle>24h volume</PanelCardTitle>
            <PanelCardValue>427,793,139.70</PanelCardValue>
          </PanelCard>

          <PanelCard style={{ borderRight: '0' }}>
            <PanelCardTitle>24h change</PanelCardTitle>
            <span>
              <PanelCardValue color="#2F7619">101.12</PanelCardValue>
              <PanelCardSubValue color="#2F7619">+1.03%</PanelCardSubValue>
            </span>
          </PanelCard>
        </CustomCard>

        <PillowButton
          firstHalfText={'single chart'}
          secondHalfText={'multichart'}
          activeHalf={'first'}
          changeHalf={() => {}}
          buttonAdditionalStyle={{ height: '100%', padding: '0 1rem' }}
        />

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

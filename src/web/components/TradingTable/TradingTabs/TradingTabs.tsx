import React from 'react'
import { IProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'
import { withTheme } from '@material-ui/styles'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'

const TradingTabs = ({ tab, handleTabChange, marketType }: IProps) => (
  <>
    <TitleTabsGroup>
      <TitleTab
        active={tab === 'activeTrades'}
        onClick={() => handleTabChange('activeTrades')}
      >
        Smart trades
      </TitleTab>
      {!isSPOTMarketType(marketType) && (
        <TitleTab
          active={tab === 'positions'}
          onClick={() => handleTabChange('positions')}
        >
          Positions
        </TitleTab>
      )}

      <TitleTab
        active={tab === 'openOrders'}
        onClick={() => handleTabChange('openOrders')}
      >
        Open orders
      </TitleTab>
      <TitleTab
        active={tab === 'orderHistory'}
        onClick={() => handleTabChange('orderHistory')}
      >
        Order history
      </TitleTab>
      <TitleTab
        active={tab === 'tradeHistory'}
        onClick={() => handleTabChange('tradeHistory')}
      >
        Trade history
      </TitleTab>

      {isSPOTMarketType(marketType) && (
        <TitleTab
          active={tab === 'funds'}
          onClick={() => handleTabChange('funds')}
        >
          Funds
        </TitleTab>
      )}
    </TitleTabsGroup>
  </>
)

export default withTheme(TradingTabs)

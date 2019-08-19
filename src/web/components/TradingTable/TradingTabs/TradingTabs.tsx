import React from 'react'
import { IProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'
import { withTheme } from '@material-ui/styles'

const TradingTabs = ({ tab, handleTabChange }: IProps) => (
  <>
    <TitleTabsGroup>
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
      <TitleTab
        active={tab === 'funds'}
        onClick={() => handleTabChange('funds')}
      >
        Funds
      </TitleTab>
    </TitleTabsGroup>
  </>
)

export default withTheme()(TradingTabs)

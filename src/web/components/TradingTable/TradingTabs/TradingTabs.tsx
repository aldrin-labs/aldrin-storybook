import React from 'react'
import { compose } from 'recompose'

import { IProps, IQueryProps, INextQueryProps } from './TradingTabs.types'
import {
  TitleTab,
  TitleTabsGroup,
  StyledTitleTab,
  ExpandTableButton,
  StyledTitleTabForMobile,
} from './TradingTabs.styles'
import SvgIcon from '@sb/components/SvgIcon'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  filterOpenOrders,
  filterPositions,
} from '@sb/components/TradingTable/TradingTable.utils'
import ExpandTableIcon from '@icons/expandIcon.svg'
import SqueezeTableIcon from '@icons/squeezeIcon.svg'

import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'

const TradingTabs = ({
  tab,
  theme,
  handleTabChange,
  marketType,
  getOpenOrderHistoryQuery: {
    getOpenOrderHistory = { orders: [], count: 0 },
  } = {
    getOpenOrderHistory: { orders: [], count: 0 },
  },
  getActivePositionsQuery: { getActivePositions = [] } = {
    getActivePositions: [],
  },
  getActiveStrategiesQuery: {
    getActiveStrategies = { strategies: [], count: 0 },
  } = {
    getActiveStrategies: { strategies: [], count: 0 },
  },
  canceledOrders,
  arrayOfMarketIds,
  currencyPair,
  subscribeToMore,
  showAllSmartTradePairs,
  showSmartTradesFromAllAccounts,
  updateTerminalViewMode,
  terminalViewMode,
  ...props
}: IProps) => {
  // const openOrdersLength = getOpenOrderHistory.orders.filter((order) =>
  //   filterOpenOrders({
  //     order,
  //     canceledOrders,
  //   })
  // ).length

  const positionsLength = getActivePositions.filter((position) =>
    filterPositions({
      position,
      canceledPositions: canceledOrders,
    })
  ).length

  const activeTradesLength = getActiveStrategies.strategies.filter(
    (a) =>
      a !== null &&
      (a.enabled ||
        (a.conditions.isTemplate && a.conditions.templateStatus !== 'disabled'))
  ).length
  return (
    <>
      <TitleTabsGroup theme={theme}>
        <StyledTitleTabForMobile
          theme={theme}
          active={tab === 'balances'}
          onClick={() => handleTabChange('balances')}
          style={{ width: '20%' }}
        >
          Balances
        </StyledTitleTabForMobile>
        <TitleTab
          theme={theme}
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders{' '}
        </TitleTab>
        <TitleTab
          theme={theme}
          active={tab === 'tradeHistory'}
          onClick={() => handleTabChange('tradeHistory')}
        >
          Recent Trade history
        </TitleTab>
        <StyledTitleTab
          theme={theme}
          active={tab === 'feeTiers'}
          onClick={() => handleTabChange('feeTiers')}
        >
          Fee Tiers
        </StyledTitleTab>
        <StyledTitleTab
          theme={theme}
          active={tab === 'balances'}
          onClick={() => handleTabChange('balances')}
        >
          Market Balances
        </StyledTitleTab>
        <ExpandTableButton
          onClick={() => {
            if (terminalViewMode === 'default') {
              updateTerminalViewMode('fullScreenTablesMobile')
            } else {
              updateTerminalViewMode('default')
            }
          }}
          theme={theme}
        >
          <SvgIcon
            src={
              terminalViewMode === 'fullScreenTablesMobile'
                ? SqueezeTableIcon
                : ExpandTableIcon
            }
            width={'25%'}
            height={'auto'}
          />
        </ExpandTableButton>
      </TitleTabsGroup>
    </>
  )
}

export default TradingTabs

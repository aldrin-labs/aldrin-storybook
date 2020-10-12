import React from 'react'
import { compose } from 'recompose'

import { IProps, IQueryProps, INextQueryProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  filterOpenOrders,
  filterPositions,
} from '@sb/components/TradingTable/TradingTable.utils'

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
        {/* <TitleTab
          theme={theme}
          active={tab === 'activeTrades'}
          onClick={() => handleTabChange('activeTrades')}
        >
          Smart trades{' '}
          {activeTradesLength > 0
            ? `(
          ${activeTradesLength}
          )`
            : ''}
        </TitleTab>
        <TitleTab
          theme={theme}
          active={tab === 'strategiesHistory'}
          onClick={() => handleTabChange('strategiesHistory')}
        >
          ST History
        </TitleTab>
        {!isSPOTMarketType(marketType) && (
          <TitleTab
            theme={theme}
            active={tab === 'positions'}
            onClick={() => {
              handleTabChange('positions')
            }}
          >
            Positions{' '}
            {positionsLength > 0
              ? `(
          ${positionsLength}
          )`
              : ''}
          </TitleTab>
        )} */}

        <TitleTab
          theme={theme}
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders{' '}
          {/* {openOrdersLength > 0
            ? `(
          ${openOrdersLength}
          )`
            : ''} */}
        </TitleTab>
        {/* <TitleTab
          theme={theme}
          active={tab === 'orderHistory'}
          onClick={() => handleTabChange('orderHistory')}
        >
          Order history
        </TitleTab> */}
        <TitleTab
          theme={theme}
          active={tab === 'tradeHistory'}
          onClick={() => handleTabChange('tradeHistory')}
        >
          Recent Trade history
        </TitleTab>

          <TitleTab
            theme={theme}
            active={tab === 'balances'}
            onClick={() => handleTabChange('balances')}
          >
            Balances
          </TitleTab>
          <TitleTab
            theme={theme}
            active={tab === 'feeDiscounts'}
            onClick={() => handleTabChange('feeDiscounts')}
          >
            Fee Discounts
          </TitleTab>

          <TitleTab
            theme={theme}
            active={tab === 'feeTiers'}
            onClick={() => handleTabChange('feeTiers')}
          >
            Fee Tiers
          </TitleTab>
      </TitleTabsGroup>
    </>
  )
}

export default TradingTabs

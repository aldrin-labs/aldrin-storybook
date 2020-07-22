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

  const openOrdersLength = getOpenOrderHistory.orders.filter((order) =>
    filterOpenOrders({
      order,
      canceledOrders,
    })
  ).length

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
      <TitleTabsGroup>
        <TitleTab
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
          active={tab === 'strategiesHistory'}
          onClick={() => handleTabChange('strategiesHistory')}
        >
          ST History
        </TitleTab>
        {!isSPOTMarketType(marketType) && (
          <TitleTab
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
        )}

        <TitleTab
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders{' '}
          {openOrdersLength > 0
            ? `(
          ${openOrdersLength}
          )`
            : ''}
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
}

export default compose(
  queryRendererHoc({
    query: getActiveStrategies,
    name: 'getActiveStrategiesQuery',
    fetchPolicy: 'cache-only',
    variables: (props: INextQueryProps) => ({
      activeStrategiesInput: {
        page: props.pageSmartTrades,
        perPage: props.perPageSmartTrades,
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: props.showSmartTradesFromAllAccounts,
        ...(!props.showAllSmartTradePairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  }),
  queryRendererHoc({
    query: getActivePositions,
    name: `getActivePositionsQuery`,
    fetchPolicy: 'cache-only',
    variables: (props: INextQueryProps) => ({
      input: {
        keyId: props.selectedKey.keyId,
        allKeys: props.showPositionsFromAllAccounts,
        ...(!props.showAllPositionPairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  }),
  queryRendererHoc({
    query: getOpenOrderHistory,
    name: `getOpenOrderHistoryQuery`,
    fetchPolicy: 'cache-and-network',
    variables: (props: INextQueryProps) => ({
      openOrderInput: {
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: props.showOpenOrdersFromAllAccounts,
        page: props.pageOpenOrders,
        perPage: props.perPageOpenOrders,
        ...(!props.showAllOpenOrderPairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    showLoadingWhenQueryParamsChange: false,
  })
)(TradingTabs)

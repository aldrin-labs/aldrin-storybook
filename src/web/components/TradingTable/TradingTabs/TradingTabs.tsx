import React, { useEffect } from 'react'

import { IProps, IQueryProps, INextQueryProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'

import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import QueryRenderer from '@core/components/QueryRenderer'
import {
  updateActivePositionsQuerryFunction,
  updateOpenOrderHistoryQuerryFunction,
  updateActiveStrategiesQuerryFunction,
  filterOpenOrders,
  filterPositions,
} from '@sb/components/TradingTable/TradingTable.utils'

import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'

import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { FUTURES_POSITIONS } from '@core/graphql/subscriptions/FUTURES_POSITIONS'

import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'

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
  let unsubscribeActiveTrades: Function | undefined

  useEffect(() => {
    unsubscribeActiveTrades && unsubscribeActiveTrades()
    unsubscribeActiveTrades = subscribeToMore()

    return () => {
      unsubscribeActiveTrades && unsubscribeActiveTrades()
    }
  }, [
    props.selectedKey.keyId,
    showAllSmartTradePairs,
    showSmartTradesFromAllAccounts,
  ])

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

const OpenOrdersWrapper = ({ ...props }: IQueryProps) => {
  return (
    <QueryRenderer
      component={PositionsWrapper}
      variables={{
        openOrderInput: {
          activeExchangeKey: props.selectedKey.keyId,
          marketType: props.marketType,
          allKeys: props.showOpenOrdersFromAllAccounts,
          // page: 0,
          //   perPage: 100,
          ...(!props.showAllOpenOrderPairs
            ? {}
            : { specificPair: props.currencyPair }),
        },
      }}
      withOutSpinner={true}
      withTableLoader={false}
      withoutLoading={true}
      showLoadingWhenQueryParamsChange={false}
      query={getOpenOrderHistory}
      name={`getOpenOrderHistoryQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: OPEN_ORDER_HISTORY,
        variables: {
          openOrderInput: {
            activeExchangeKey: props.selectedKey.keyId,
            marketType: props.marketType,
            allKeys: props.showOpenOrdersFromAllAccounts,
            ...(!props.showAllOpenOrderPairs
              ? {}
              : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

const PositionsWrapper = ({
  subscribeToMore,
  variables,
  showOpenOrdersFromAllAccounts,
  showAllOpenOrderPairs,
  ...props
}: INextQueryProps) => {
  let unsubscribeOpenOrders: Function | undefined

  useEffect(() => {
    unsubscribeOpenOrders && unsubscribeOpenOrders()
    unsubscribeOpenOrders = subscribeToMore()

    return () => {
      unsubscribeOpenOrders && unsubscribeOpenOrders()
    }
  }, [
    props.selectedKey.keyId,
    showOpenOrdersFromAllAccounts,
    showAllOpenOrderPairs,
  ])

  return (
    <QueryRenderer
      component={ActiveTradesWrapper}
      variables={{
        input: {
          keyId: props.selectedKey.keyId,
          allKeys: props.showPositionsFromAllAccounts,
          ...(!props.showAllPositionPairs
            ? {}
            : { specificPair: props.currencyPair }),
        },
      }}
      withOutSpinner={true}
      withTableLoader={false}
      withoutLoading={true}
      showLoadingWhenQueryParamsChange={false}
      query={getActivePositions}
      name={`getActivePositionsQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: FUTURES_POSITIONS,
        variables: {
          input: {
            keyId: props.selectedKey.keyId,
            allKeys: props.showPositionsFromAllAccounts,
            ...(!props.showAllPositionPairs
              ? {}
              : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateActivePositionsQuerryFunction,
      }}
      {...props}
    />
  )
}

const ActiveTradesWrapper = ({
  subscribeToMore,
  variables,
  showAllPositionPairs,
  showPositionsFromAllAccounts,
  ...props
}: INextQueryProps) => {
  let unsubscribePositions: Function | undefined

  useEffect(() => {
    unsubscribePositions && unsubscribePositions()
    unsubscribePositions = subscribeToMore()

    return () => {
      unsubscribePositions && unsubscribePositions()
    }
  }, [
    props.selectedKey.keyId,
    showAllPositionPairs,
    showPositionsFromAllAccounts,
  ])

  return (
    <QueryRenderer
      component={TradingTabs}
      variables={{
        activeStrategiesInput: {
          activeExchangeKey: props.selectedKey.keyId,
          marketType: props.marketType,
          allKeys: props.showSmartTradesFromAllAccounts,
          ...(!props.showAllSmartTradePairs
            ? {}
            : { specificPair: props.currencyPair }),
        },
      }}
      withOutSpinner={true}
      withTableLoader={false}
      withoutLoading={true}
      showLoadingWhenQueryParamsChange={false}
      query={getActiveStrategies}
      name={`getActiveStrategiesQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: ACTIVE_STRATEGIES,
        variables: {
          activeStrategiesInput: {
            activeExchangeKey: props.selectedKey.keyId,
            marketType: props.marketType,
            allKeys: props.showSmartTradesFromAllAccounts,
            ...(!props.showAllSmartTradePairs
              ? {}
              : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateActiveStrategiesQuerryFunction,
      }}
      {...props}
    />
  )
}

export default OpenOrdersWrapper

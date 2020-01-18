import React, { useEffect } from 'react'
import { compose } from 'recompose'
import { IProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'
import { withTheme } from '@material-ui/styles'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import QueryRenderer from '@core/components/QueryRenderer'
import {
  updateActivePositionsQuerryFunction,
  updateOpenOrderHistoryQuerryFunction,
  updateActiveStrategiesQuerryFunction,
  filterOpenOrders,
  filterPositions,
  filterActiveTrades,
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
  getOpenOrderHistoryQuery,
  getActivePositionsQuery,
  getActiveStrategiesQuery,
  canceledOrders,
  arrayOfMarketIds,
  currencyPair,
  subscribeToMore,
  ...props
}: IProps) => {
  let unsubscribeActiveTrades: Function | undefined

  useEffect(() => {
    unsubscribeActiveTrades && unsubscribeActiveTrades()
    unsubscribeActiveTrades = subscribeToMore()

    return () => {
      unsubscribeActiveTrades && unsubscribeActiveTrades()
    }
  }, [props.selectedKey.keyId])

  const openOrdersLength = getOpenOrderHistoryQuery.getOpenOrderHistory.filter(
    (order) =>
      filterOpenOrders({
        order,
        arrayOfMarketIds,
        canceledOrders,
        marketType,
      })
  ).length

  const positionsLength = getActivePositionsQuery.getActivePositions.filter(
    (position) =>
      filterPositions({
        position,
        pair: currencyPair,
        canceledPositions: canceledOrders,
      })
  ).length

  const activeTradesLength = getActiveStrategiesQuery.getActiveStrategies.filter(
    (trade) =>
      filterActiveTrades({
        trade,
        marketType,
      })
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
            onClick={() => handleTabChange('positions')}
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

const OpenOrdersWrapper = ({ variables, ...props }) => {
  return (
    <QueryRenderer
      component={PositionsWrapper}
      variables={{
        openOrderInput: {
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getOpenOrderHistory}
      name={`getOpenOrderHistoryQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: OPEN_ORDER_HISTORY,
        variables: {
          openOrderInput: {
            activeExchangeKey: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

const PositionsWrapper = ({ subscribeToMore, variables, ...props }) => {
  let unsubscribeOpenOrders: Function | undefined

  useEffect(() => {
    unsubscribeOpenOrders && unsubscribeOpenOrders()
    unsubscribeOpenOrders = subscribeToMore()

    return () => {
      unsubscribeOpenOrders && unsubscribeOpenOrders()
    }
  }, [props.selectedKey.keyId])

  return (
    <QueryRenderer
      component={ActiveTradesWrapper}
      variables={{
        input: {
          keyId: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getActivePositions}
      name={`getActivePositionsQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: FUTURES_POSITIONS,
        variables: {
          input: {
            keyId: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateActivePositionsQuerryFunction,
      }}
      {...props}
    />
  )
}

const ActiveTradesWrapper = ({ subscribeToMore, variables, ...props }) => {
  let unsubscribePositions: Function | undefined

  useEffect(() => {
    unsubscribePositions && unsubscribePositions()
    unsubscribePositions = subscribeToMore()

    return () => {
      unsubscribePositions && unsubscribePositions()
    }
  }, [props.selectedKey.keyId])

  return (
    <QueryRenderer
      component={TradingTabs}
      variables={{
        activeStrategiesInput: {
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getActiveStrategies}
      name={`getActiveStrategiesQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: ACTIVE_STRATEGIES,
        variables: {
          activeStrategiesInput: {
            activeExchangeKey: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateActiveStrategiesQuerryFunction,
      }}
      {...props}
    />
  )
}

export default OpenOrdersWrapper

// return compose(
// queryRendererHoc({
//   query: getOpenOrderHistory,
//   withOutSpinner: true,
//   withTableLoader: true,
//   name: 'getOpenOrderHistoryQuery',
//   variables: {
//     openOrderInput: {
//       activeExchangeKey: props.selectedKey.keyId,
//     },
//   },
//   fetchPolicy: 'cache-and-network',
//   subscriptionArgs: {
//     subscription: OPEN_ORDER_HISTORY,
//     variables: {
//       openOrderInput: {
//         activeExchangeKey: props.selectedKey.keyId,
//       },
//     },
//     updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
//   }
// })
// )(TradingTabs)

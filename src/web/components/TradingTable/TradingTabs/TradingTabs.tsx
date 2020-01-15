import React from 'react'
import { IProps } from './TradingTabs.types'
import { TitleTab, TitleTabsGroup } from './TradingTabs.styles'
import { withTheme } from '@material-ui/styles'
import { isSPOTMarketType } from '@core/utils/chartPageUtils'
import QueryRenderer from '@core/components/QueryRenderer'
import {
  updateOpenOrderHistoryQuerryFunction,
  isDataForThisMarket,
} from '@sb/components/TradingTable/TradingTable.utils'

import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'

const TradingTabs = ({
  tab,
  handleTabChange,
  marketType,
  getOpenOrderHistoryQuery,
  canceledOrders,
  arrayOfMarketIds,
}: IProps) => {
  return (
    <>
      <TitleTabsGroup>
        <TitleTab
          active={tab === 'activeTrades'}
          onClick={() => handleTabChange('activeTrades')}
        >
          Smart trades
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
            Positions
          </TitleTab>
        )}

        <TitleTab
          active={tab === 'openOrders'}
          onClick={() => handleTabChange('openOrders')}
        >
          Open orders (
          {
            getOpenOrderHistoryQuery.getOpenOrderHistory.filter(
              (order) =>
                !canceledOrders.includes(order.info.orderId) &&
                order.type !== 'market' &&
                isDataForThisMarket(
                  marketType,
                  arrayOfMarketIds,
                  order.marketId
                ) &&
                (order.status === 'open' ||
                  order.status === 'placing' ||
                  order.status === 'NEW')
            ).length
          }
          )
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

const TradingTabsWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={TradingTabs}
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

export default withTheme(TradingTabsWrapper)

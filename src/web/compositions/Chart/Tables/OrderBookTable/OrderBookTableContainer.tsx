import React, { Component, ChangeEvent } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  transformOrderbookData,
  addOrderToOrderbook,
  testJSON,
} from '@core/utils/chartPageUtils'

import { getSelectedKey } from '@core/graphql/queries/chart/getSelectedKey'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import { updateOpenOrderHistoryQuerryFunction } from '@sb/components/TradingTable/TradingTable.utils'

import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'
import LastTrade from './Tables/LastTrade/LastTrade'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import SortByBoth from '@icons/SortByBoth.svg'
import SortByAsks from '@icons/SortByAsks.svg'
import SortByBids from '@icons/SortByBids.svg'

import ComingSoon from '@sb/components/ComingSoon'
import {
  IProps,
  IState,
  OrderbookMode,
  OrderbookGroup,
  OrderbookGroupOptions,
} from './OrderBookTableContainer.types'

import { ModesContainer, SvgMode } from './OrderBookTableContainer.styles'
import { MASTER_BUILD } from '@core/utils/config'

import { GET_ORDERS } from '@core/graphql/queries/chart/getOrders'
import { SET_ORDERS } from '@core/graphql/mutations/chart/setOrders'

let unsubscribe: Function | undefined

class OrderBookTableContainer extends Component<IProps, IState> {
  state: IState = {
    asks: new Map(),
    bids: new Map(),
    // will use to compare data and update from query
    lastQueryData: null,
    group: 0.01,
    mode: 'both',
    i: 0,
  }

  // transforming data
  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    const { asks, bids } = state
    const { marketOrders } = newProps.data

    let updatedData = null

    // first get data from query
    if (
      asks.size === 0 &&
      bids.size === 0 &&
      marketOrders.asks &&
      marketOrders.bids &&
      testJSON(marketOrders.asks) &&
      testJSON(marketOrders.bids)
    ) {
      updatedData = transformOrderbookData({ marketOrders })
    }

    if (
      !(typeof marketOrders.asks === 'string') ||
      !(typeof marketOrders.bids === 'string')
    ) {
      const orderData = newProps.data.marketOrders
      const orderbookData = updatedData || { asks, bids }

      updatedData = addOrderToOrderbook(orderbookData, orderData)
    }

    return {
      ...updatedData,
    }

    // update depth chart every 100 iterations
    // if (iterator === 100) {
    //   newProps.setOrdersMutation({
    //     variables: {
    //       setOrdersInput: {
    //         bids,
    //         asks,
    //       },
    //     },
    //   })
    //   iterator = 0
    // } else {
    //   iterator += 1
    // }
  }

  componentDidMount() {
    console.log('props', this.props)

    if (this.props.subscribeToMore) {
      //  unsubscribe from old exchange when you first time change exchange
      unsubscribe && unsubscribe()

      unsubscribe = this.props.subscribeToMore()
    }
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.activeExchange.symbol !== this.props.activeExchange.symbol ||
      prevProps.currencyPair !== this.props.currencyPair
    ) {
      // when change exchange delete all data and...
      this.setState({ asks: [], bids: [] })

      //  unsubscribe from old exchange
      unsubscribe && unsubscribe()

      //  subscribe to new exchange and create new unsub link
      unsubscribe = this.props.subscribeToMore()
    }
  }

  setOrderbookMode = (mode: OrderbookMode) => this.setState({ mode })

  setOrderbookGroup = (group: OrderbookGroup) => this.setState({ group })

  render() {
    const { quote, lastTradeData, onButtonClick } = this.props
    const { bids, asks, mode, group } = this.state

    return (
      <>
        {MASTER_BUILD && <ComingSoon />}

        <ChartCardHeader
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>Orderbook</span>
          <ModesContainer>
            <SvgMode
              src={SortByBoth}
              isActive={mode === 'both'}
              onClick={() => this.setOrderbookMode('both')}
            />
            <SvgMode
              src={SortByBids}
              isActive={mode === 'bids'}
              onClick={() => this.setOrderbookMode('bids')}
            />
            <SvgMode
              src={SortByAsks}
              isActive={mode === 'asks'}
              onClick={() => this.setOrderbookMode('asks')}
            />
            <select
              onChange={(e: ChangeEvent) =>
                this.setOrderbookGroup(e.target.value)
              }
            >
              {OrderbookGroupOptions.map((option) => (
                <option key={option.value}>{option.value}</option>
              ))}
            </select>
          </ModesContainer>
        </ChartCardHeader>

        <OrderBookTable
          data={asks}
          mode={mode}
          group={group}
          onButtonClick={onButtonClick}
          quote={quote}
        />

        <LastTrade mode={mode} lastTradeData={lastTradeData} group={group} />

        <SpreadTable data={bids} mode={mode} group={group} quote={quote} />
      </>
    )
  }
}

const APIWrapper = (props) => {
  return (
    <QueryRenderer
      component={OrderBookTableContainer}
      variables={{
        openOrderInput: {
          activeExchangeKey: props.getSelectedKeyQuery.chart.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={false}
      query={getOpenOrderHistory}
      name={`getOpenOrderHistoryQuery`}
      fetchPolicy='network-only'
      subscriptionArgs={{
        subscription: OPEN_ORDER_HISTORY,
        variables: {
          openOrderInput: {
            activeExchangeKey:
              props.getSelectedKeyQuery.chart.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default compose(
  queryRendererHoc({
    query: GET_ORDERS,
    name: 'getOrders',
  }),
  graphql(SET_ORDERS, {
    name: 'setOrdersMutation',
  }),
  queryRendererHoc({
    query: getSelectedKey,
    name: 'getSelectedKeyQuery',
  })
)(APIWrapper)

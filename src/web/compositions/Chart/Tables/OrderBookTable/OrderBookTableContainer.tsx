import React, { Component, ChangeEvent } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  transformOrderbookData,
  addOrderToOrderbook,
} from '@core/utils/chartPageUtils'

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
    asks: [],
    bids: [],
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
    const newOrder = JSON.parse(
      '{"pair":"MATIC_BTC","exchange":"binance","id":"1573672480969MATIC_BTC3471028.000000000.00000170","size":"3471028","price":"10000.00000170","side":"bid","timestamp":1573672480.969}'
    )

    // first get data from query
    if (
      asks.length === 0 &&
      bids.length === 0 &&
      marketOrders.asks &&
      marketOrders.bids
    ) {
      updatedData = transformOrderbookData({ marketOrders })
    }

    if (
      newOrder
      // newProps &&
      // newProps.marketOrder
    ) {
      const orderData = newOrder
      const orderbookData = updatedData || { asks, bids }

      // testJSON(newProps.marketOrder)
      //   ? JSON.parse(newProps.marketOrder)
      //   : newProps.data.marketOrders

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

export default compose(
  queryRendererHoc({
    query: GET_ORDERS,
    name: 'getOrders',
  }),
  graphql(SET_ORDERS, {
    name: 'setOrdersMutation',
  })
)(OrderBookTableContainer)

import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { uniqBy } from 'lodash-es'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  maximumItemsInArray,
  findSpread,
  getNumberOfDigitsAfterDecimal,
  sortAndFilterOrders,
  bidsPriceFiltering,
  testJSON,
  sortAsc,
  sortDesc,
  removeZeroSizeOrders,
  reduceArrayLength,
} from '@core/utils/chartPageUtils'
import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'
import { HeadRow } from './Tables/HeadRow/HeadRow'
import ComingSoon from '@sb/components/ComingSoon'
import { IProps, IState } from './OrderBookTableContainer.types'
import { MASTER_BUILD } from '@core/utils/config'
import { IOrder } from '@core/types/ChartTypes'

import { GET_ORDERS } from '@core/graphql/queries/chart/getOrders'
import { SET_ORDERS } from '@core/graphql/mutations/chart/setOrders'

let unsubscribe: Function | undefined

class OrderBookTableContainer extends Component<IProps, IState> {
  state: IState = {
    asks: [],
    bids: [],
    spread: null,
    digitsAfterDecimalForAsksPrice: 0,
    digitsAfterDecimalForAsksSize: 0,
    digitsAfterDecimalForBidsPrice: 0,
    digitsAfterDecimalForBidsSize: 0,
    i: 0,
  }

  // transforming data
  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    // when get data from subscr
    // console.log(newProps.data.marketOrders)
    if (newProps.data && newProps.data.marketOrders) {
      let iterator = state.i

      console.log(newProps.data.marketOrders)

      const newDataAsks = JSON.parse(newProps.data.marketOrders.asks)
      const newDataBids = JSON.parse(newProps.data.marketOrders.bids)

      const asksData = newDataAsks.map((ask) => ({
        price: +(+ask[0]).toFixed(2),
        size: +ask[1][0],
        total: +ask[1][1],
      }))

      const bidsData = newDataBids.map((bid) => ({
        price: +(+bid[0]).toFixed(2),
        size: +bid[1][0],
        total: +bid[1][1],
      }))

      console.log(asksData)
      return { asks: asksData, bids: bidsData }

      const orderData = newProps.data.marketOrders[0]
      const order: IOrder = {
        price: +(+orderData.price).toFixed(8),
        size: +(+orderData.size).toFixed(8),
        type: orderData.side,
      }

      const asks =
        order.type === 'ask'
          ? sortDesc(
              removeZeroSizeOrders(uniqBy([order].concat(state.asks), 'price'))
            )
          : state.asks

      let bids =
        order.type === 'bid'
          ? sortDesc(
              removeZeroSizeOrders(uniqBy([order].concat(state.bids), 'price'))
            )
          : state.bids

      console.log('statefrom', asks, bids)
      // find spread
      const spread = findSpread(asks, bids)
      //  you must remove zero orders here after merge new order to orderbook
      bids = bidsPriceFiltering(asks, bids)

      // update depth chart every 100 iterations
      if (iterator === 100) {
        newProps.setOrdersMutation({
          variables: {
            setOrdersInput: {
              bids,
              asks,
            },
          },
        })
        iterator = 0
      } else {
        iterator += 1
      }

      return {
        spread,
        asks:
          order.type === 'ask'
            ? maximumItemsInArray(asks, 100, 40, true)
            : state.asks,
        bids: reduceArrayLength(bids),
        // bids: [],
        // asks: [],
        i: iterator,
        digitsAfterDecimalForAsksPrice: getNumberOfDigitsAfterDecimal(
          asks,
          'price'
        ),
        digitsAfterDecimalForAsksSize: getNumberOfDigitsAfterDecimal(
          asks,
          'size'
        ),
        digitsAfterDecimalForBidsPrice: getNumberOfDigitsAfterDecimal(
          bids,
          'price'
        ),
        digitsAfterDecimalForBidsSize: getNumberOfDigitsAfterDecimal(
          bids,
          'size'
        ),
      }
    }

    return null
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

  render() {
    const {
      quote,
      theme: { palette },
      onButtonClick,
    } = this.props
    const {
      bids,
      asks,
      spread,
      digitsAfterDecimalForAsksPrice,
      digitsAfterDecimalForAsksSize,
      digitsAfterDecimalForBidsPrice,
      digitsAfterDecimalForBidsSize,
    } = this.state

    const { primary, type } = palette

    return (
      <>
        {MASTER_BUILD && <ComingSoon />}
        <OrderBookTable
          digitsAfterDecimalForAsksSize={digitsAfterDecimalForAsksSize}
          digitsAfterDecimalForAsksPrice={digitsAfterDecimalForAsksPrice}
          data={asks}
          onButtonClick={onButtonClick}
          quote={quote}
        />

        {/* <HeadRow
          {...{
            primary,
            type,
            palette,
            quote,
            spread,
            digitsAfterDecimalForSpread: Math.max(
              digitsAfterDecimalForBidsPrice,
              digitsAfterDecimalForAsksPrice
            ),
            key: 'bids_headrow',
          }}
        /> */}

        <div style={{ width: '100%', height: '30px', background: '#F2F4F6' }} />

        <SpreadTable
          data={bids}
          digitsAfterDecimalForBidsSize={digitsAfterDecimalForBidsSize}
          digitsAfterDecimalForBidsPrice={digitsAfterDecimalForBidsPrice}
          quote={quote}
        />
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

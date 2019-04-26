import React, { Component } from 'react'
import { uniqBy } from 'lodash-es'

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
let unsubscribe: Function | undefined

class OrderBookTableContainer extends Component<IProps, IState> {
  state = {
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
    if (
      newProps.data &&
      newProps.data.marketOrders &&
      newProps.data.marketOrders.length > 0
    ) {

      let iterator = state.i

      const orderData = newProps.data.marketOrders[0]
      const order: IOrder = {
        price: +((+orderData.price).toFixed(8)),
        size: +((+orderData.size).toFixed(8)),
        type: orderData.side,
      }

      const asks =
        order.type === 'ask'
          ? sortDesc(removeZeroSizeOrders(uniqBy([order].concat(state.asks), 'price')))
          : state.asks


      let bids =
        order.type === 'bid'
          ? sortDesc(removeZeroSizeOrders(uniqBy([order].concat(state.bids), 'price')))
          : state.bids



      // find spread
      const spread = findSpread(asks, bids)
      //  you must remove zero orders here after merge new order to orderbook
      bids = bidsPriceFiltering(asks, bids)


      // update depth chart every 100 iterations
      if (iterator === 100) {
        newProps.setOrders({
          bids,
          asks: asks.slice().reverse(),
        })
        iterator = 0
      } else {
        iterator += 1
      }


      return {
        spread,
        asks: order.type === 'ask' ? maximumItemsInArray(asks, 100, 40, true): state.asks,
        bids: reduceArrayLength(bids.slice()),
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

        <HeadRow
          {...{
            primary,
            type,
            palette,
            quote,
            spread,
            digitsAfterDecimalForSpread: Math.max(digitsAfterDecimalForBidsPrice, digitsAfterDecimalForAsksPrice),
            key: 'bids_headrow',
          }}
        />
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

export default OrderBookTableContainer

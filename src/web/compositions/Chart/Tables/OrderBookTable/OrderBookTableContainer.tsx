import React, { Component } from 'react'
import { uniqBy } from 'lodash-es'

import {
  maximumItemsInArray,
  findSpread,
  getNumberOfDigitsAfterDecimal,
  sortAndFilterOrders,
  bidsPriceFiltering,
  testJSON,
} from '@core/utils/chartPageUtils'
import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'
import ComingSoon from '@sb/components/ComingSoon'
import { IProps, IState } from './OrderBookTableContainer.types'
import { MASTER_BUILD } from '@core/utils/config'
let unsubscribe: Function | undefined

class OrderBookTableContainer extends Component<IProps, IState> {
  state = {
    asks: [],
    bids: [],
    spread: null,
    digitsAfterDecimalForAsksPrice: 0,
    digitsAfterDecimalForAsksSize: 0,
    i: 0,
  }

  // transforming data
  static getDerivedStateFromProps(newProps: IProps, state: IState) {
    let iterator = state.i

    // when get data from subscr
    if (
      newProps.data &&
      newProps.data.marketOrders &&
      newProps.data.marketOrders.length > 0
    ) {
      const orderData = newProps.data.marketOrders[0]
      const order = {
        price: Number(Number(orderData.price).toFixed(8)),
        size: Number(Number(orderData.size).toFixed(8)),
        type: orderData.side,
      }

      let bids =
        order.type === 'bid'
          ? sortAndFilterOrders(uniqBy([order, ...state.bids], 'price'))
          : state.bids

      const asks =
        order.type === 'ask'
          ? sortAndFilterOrders(uniqBy([order, ...state.asks], 'price'))
          : state.asks
      bids = bidsPriceFiltering(asks, bids)
      //  you must remove zero orders here after merge new order to otderbook
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

      const spread = findSpread(asks, bids)

      return {
        spread,
        bids: maximumItemsInArray([...bids], 100, 40),
        asks: maximumItemsInArray([...asks], 100, 40, true),
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
      data,
      //  useless functions
      ...rest
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
    return (
      <>
        {MASTER_BUILD && <ComingSoon />}
        <OrderBookTable
          digitsAfterDecimalForAsksSize={digitsAfterDecimalForAsksSize}
          digitsAfterDecimalForAsksPrice={digitsAfterDecimalForAsksPrice}
          data={asks}
          {...rest}
        />
        <SpreadTable
          data={bids}
          digitsAfterDecimalForBidsSize={digitsAfterDecimalForBidsSize}
          digitsAfterDecimalForBidsPrice={digitsAfterDecimalForBidsPrice}
          digitsAfterDecimalForSpread={Math.max(
            digitsAfterDecimalForBidsPrice,
            digitsAfterDecimalForAsksPrice
          )}
          spread={spread || 0}
          {...rest}
        />
      </>
    )
  }
}

export default OrderBookTableContainer

import React, { Component, ChangeEvent } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { uniqBy } from 'lodash-es'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import {
  maximumItemsInArray,
  findSpread,
  getNumberOfDigitsAfterDecimal,
  reduceArrayLength,
  transformOrderbookData,
  addOrderToOrderbook,
} from '@core/utils/chartPageUtils'

import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'
import LastTrade from './Tables/LastTrade/LastTrade'
import ChartCardHeader from '@sb/components/ChartCardHeader'

import SvgIcon from '@sb/components/SvgIcon'
import ExchangeLogo from '@icons/ExchangeLogo.svg'

import ComingSoon from '@sb/components/ComingSoon'
import {
  IProps,
  IState,
  OrderbookMode,
  OrderbookGroup,
  OrderbookGroupOptions,
} from './OrderBookTableContainer.types'
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
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <span>Orderbook</span>
          <div>
            {/* separate to one component */}
            <SvgIcon
              src={ExchangeLogo}
              onClick={() => this.setOrderbookMode('both')}
              width='1rem'
              height='auto'
              style={{
                marginRight: '.8rem',
              }}
            />
            <SvgIcon
              src={ExchangeLogo}
              onClick={() => this.setOrderbookMode('bids')}
              width='1rem'
              height='auto'
              style={{
                marginRight: '.8rem',
              }}
            />
            <SvgIcon
              src={ExchangeLogo}
              onClick={() => this.setOrderbookMode('asks')}
              width='1rem'
              height='auto'
              style={{
                marginRight: '.8rem',
              }}
            />
            <select
              // value={[group]}
              onChange={(e: ChangeEvent) =>
                this.setOrderbookGroup(e.target.value)
              }
              // options={OrderbookGroupOptions}
              // isSearchable={false}
              // isClearable={false}
              // menuIsOpen={true}
              // singleValueStyles={{
              //   color: '#165BE0',
              //   fontSize: '.8rem',
              //   padding: '0',
              // }}
              // controlStyles={{
              //   background: 'transparent',
              //   border: 'none',
              // }}
              // menuStyles={{
              //   padding: '5px 8px',
              //   borderRadius: '14px',
              //   textAlign: 'center',
              //   marginLeft: '3rem',
              //   zIndex: 1000,
              // }}
              // optionStyles={{
              //   color: '#7284A0',
              //   background: 'transparent',
              //   textAlign: 'center',
              //   fontSize: '0.8rem',
              //   '&:hover': {
              //     borderRadius: '14px',
              //     color: '#16253D',
              //     background: '#E7ECF3',
              //   },
              // }}
            >
              {OrderbookGroupOptions.map((option) => (
                <option key={option.value}>{option.value}</option>
              ))}
            </select>
          </div>
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

import React, { Component, ChangeEvent } from 'react'

import QueryRenderer from '@core/components/QueryRenderer'

import { checkLoginStatus } from '@core/utils/loginUtils'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import {
  filterOpenOrders,
  updateOpenOrderHistoryQuerryFunction,
} from '@sb/components/TradingTable/TradingTable.utils'

import OrderBookTable from './Tables/Asks/OrderBookTable'
import SpreadTable from './Tables/Bids/SpreadTable'
import LastTrade from './Tables/LastTrade/LastTrade'
import ChartCardHeader from '@sb/components/ChartCardHeader'
import {
  StyledSelect,
  StyledOption,
} from '@sb/components/TradingWrapper/styles'

import SortByBoth from '@icons/SortByBoth.svg'
import SortByAsks from '@icons/SortByAsks.svg'
import SortByBids from '@icons/SortByBids.svg'

import { IProps, IState, OrderbookMode } from './OrderBookTableContainer.types'

import { ModesContainer, SvgMode } from './OrderBookTableContainer.styles'
import { getAggregationsFromMinPriceDigits, getAggregationsFromPricePrecision } from '@core/utils/chartPageUtils'

class OrderBookTableContainer extends Component<IProps, IState> {
  state: IState = {
    // will use to compare data and update from query
    lastQueryData: null,
    mode: 'both',
    i: 0,
  }

  componentDidUpdate(prevProps) {
    const { getOpenOrderHistoryQuery, addOrderToOrderbookTree } = this.props
    const { getOpenOrderHistoryQuery: prevOpenOrderHistoryQuery } = prevProps

    const {
      getOpenOrderHistory = { orders: [], count: 0 },
    } = getOpenOrderHistoryQuery || {
      getOpenOrderHistory: { orders: [], count: 0 },
    }

    const {
      getOpenOrderHistory: prevOpenOrderHistory = { orders: [], count: 0 },
    } = prevOpenOrderHistoryQuery || {
      getOpenOrderHistory: { orders: [], count: 0 },
    }

    const isNewOrder =
      getOpenOrderHistory.orders.length > prevOpenOrderHistory.orders.length
    const newCachedOrder = getOpenOrderHistory.orders.find(
      (order) => order.marketId === '0'
    )

    if (isNewOrder && newCachedOrder) {
      const transformedOrder = {
        timestamp: +new Date() / 1000,
        price: newCachedOrder.price,
        size: newCachedOrder.info.origQty,
      }

      console.log('add order to ob')
      addOrderToOrderbookTree(transformedOrder)
    }
  }

  setOrderbookMode = (mode: OrderbookMode) => this.setState({ mode })

  render() {
    const {
      data,
      quote,
      theme,
      marketType,
      marketOrders,
      aggregation,
      currencyPair,
      onButtonClick,
      minPriceDigits,
      arrayOfMarketIds,
      amountForBackground,
      setOrderbookAggregation,
      updateTerminalPriceFromOrderbook,
      getOpenOrderHistoryQuery,
      markPrice,
      pricePrecision
    } = this.props

    const { mode } = this.state
    const {
      getOpenOrderHistory = { orders: [], count: 0 },
    } = getOpenOrderHistoryQuery || {
      getOpenOrderHistory: { orders: [], count: 0 },
    }

    const openOrders = getOpenOrderHistory.orders.filter((order) =>
      filterOpenOrders({ order, canceledOrders: [] })
    )
    const aggregationModes = getAggregationsFromPricePrecision(pricePrecision)

    return (
      <>
        <ChartCardHeader
          theme={theme}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{ width: '40%', whiteSpace: 'pre-line', textAlign: 'left' }}
          >
            Order book
          </span>
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
            <div style={{ width: '60%', padding: '0 1rem' }}>
              <StyledSelect
                theme={theme}
                onChange={(e: ChangeEvent) => {
                  setOrderbookAggregation(
                    aggregationModes.find(
                      (mode) => String(mode.label) === e.target.value
                    ).value
                  )
                }}
              >
                {aggregationModes.map((option) => (
                  <StyledOption key={option.label}>{option.label}</StyledOption>
                ))}
              </StyledSelect>
            </div>
          </ModesContainer>
        </ChartCardHeader>

        <OrderBookTable
          data={data}
          mode={mode}
          theme={theme}
          marketType={marketType}
          arrayOfMarketIds={arrayOfMarketIds}
          aggregation={aggregation}
          onButtonClick={onButtonClick}
          openOrderHistory={openOrders}
          currencyPair={currencyPair}
          amountForBackground={amountForBackground}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
        />

        <LastTrade
          mode={mode}
          data={data}
          theme={theme}
          minPriceDigits={minPriceDigits}
          marketType={marketType}
          marketOrders={marketOrders}
          aggregation={aggregation}
          symbol={currencyPair}
          markPrice={markPrice}
          exchange={this.props.exchange}
          pricePrecision={pricePrecision}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
        />

        <SpreadTable
          data={data}
          mode={mode}
          theme={theme}
          marketType={marketType}
          arrayOfMarketIds={arrayOfMarketIds}
          aggregation={aggregation}
          openOrderHistory={openOrders}
          currencyPair={currencyPair}
          amountForBackground={amountForBackground}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
        />
      </>
    )
  }
}

// const APIWrapper = (props) => {
//   const authenticated = checkLoginStatus()

//   return (
//     <QueryRenderer
//       component={OrderBookTableContainer}
//       variables={{
//         openOrderInput: {
//           activeExchangeKey: props.selectedKey.keyId,
//           marketType: props.marketType,
//           allKeys: true,
//           page: 0,
//           perPage: 30,
//         },
//       }}
//       withOutSpinner={true}
//       withTableLoader={false}
//       skip={!authenticated}
//       query={getOpenOrderHistory}
//       name={`getOpenOrderHistoryQuery`}
//       fetchPolicy="cache-and-network"
//       subscriptionArgs={{
//         subscription: OPEN_ORDER_HISTORY,
//         variables: {
//           openOrderInput: {
//             marketType: props.marketType,
//             activeExchangeKey: props.selectedKey.keyId,
//             allKeys: true,
//           },
//         },
//         updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
//       }}
//       withoutLoading={true}
//       {...props}
//     />
//   )
// }

export default OrderBookTableContainer

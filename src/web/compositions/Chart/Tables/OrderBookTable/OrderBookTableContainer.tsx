import React, { Component, ChangeEvent } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'

import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import { updateOpenOrderHistoryQuerryFunction } from '@sb/components/TradingTable/TradingTable.utils'

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
import { getAggregationsFromMinPriceDigits } from '@core/utils/chartPageUtils'

import { GET_ORDERS } from '@core/graphql/queries/chart/getOrders'
import { SET_ORDERS } from '@core/graphql/mutations/chart/setOrders'

class OrderBookTableContainer extends Component<IProps, IState> {
  state: IState = {
    // will use to compare data and update from query
    lastQueryData: null,
    mode: 'both',
    i: 0,
  }

  setOrderbookMode = (mode: OrderbookMode) => this.setState({ mode })

  render() {
    const {
      data,
      quote,
      marketType,
      aggregation,
      currencyPair,
      onButtonClick,
      minPriceDigits,
      arrayOfMarketIds,
      amountForBackground,
      setOrderbookAggregation,
      updateTerminalPriceFromOrderbook,
      getOpenOrderHistoryQuery: { getOpenOrderHistory },
    } = this.props

    const { mode } = this.state
    const aggregationModes = getAggregationsFromMinPriceDigits(minPriceDigits)

    return (
      <>
        <ChartCardHeader
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
            <StyledSelect
              onChange={(e: ChangeEvent) => {
                setOrderbookAggregation(
                  aggregationModes
                    .find((mode) => String(mode.label) === e.target.value)
                    .value
                )
              }
              }
            >
              {aggregationModes.map((option) => (
                <StyledOption key={option.label}>{option.label}</StyledOption>
              ))}
            </StyledSelect>
          </ModesContainer>
        </ChartCardHeader>

        <OrderBookTable
          data={data}
          mode={mode}
          arrayOfMarketIds={arrayOfMarketIds}
          aggregation={aggregation}
          onButtonClick={onButtonClick}
          openOrderHistory={getOpenOrderHistory}
          currencyPair={currencyPair}
          amountForBackground={amountForBackground}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
        />

        <LastTrade
          mode={mode}
          marketType={marketType}
          aggregation={aggregation}
          symbol={currencyPair}
          exchange={this.props.exchange}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
        />

        <SpreadTable
          data={data}
          mode={mode}
          arrayOfMarketIds={arrayOfMarketIds}
          aggregation={aggregation}
          openOrderHistory={getOpenOrderHistory}
          currencyPair={currencyPair}
          amountForBackground={amountForBackground}
          updateTerminalPriceFromOrderbook={updateTerminalPriceFromOrderbook}
          quote={quote}
        />
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

export default compose(
  queryRendererHoc({
    query: GET_ORDERS,
    name: 'getOrders',
  }),
  graphql(SET_ORDERS, {
    name: 'setOrdersMutation',
  })
)(APIWrapper)

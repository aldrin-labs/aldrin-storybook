import React, { Component, ChangeEvent } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'

import { getSelectedKey } from '@core/graphql/queries/chart/getSelectedKey'
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
      setOrderbookAggregation,
      getOpenOrderHistoryQuery: { getOpenOrderHistory },
    } = this.props
    const { mode } = this.state

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
              onChange={(e: ChangeEvent) =>
                setOrderbookAggregation(+e.target.value)
              }
            >
              {OrderbookGroupOptions.map((option) => (
                <StyledOption key={option.value}>{option.value}</StyledOption>
              ))}
            </StyledSelect>
          </ModesContainer>
        </ChartCardHeader>

        <OrderBookTable
          data={data}
          mode={mode}
          aggregation={aggregation}
          onButtonClick={onButtonClick}
          openOrderHistory={getOpenOrderHistory}
          quote={quote}
        />

        <LastTrade
          mode={mode}
          marketType={marketType}
          aggregation={aggregation}
          symbol={currencyPair}
          exchange={this.props.activeExchange.symbol}
        />

        <SpreadTable
          data={data}
          mode={mode}
          aggregation={aggregation}
          openOrderHistory={getOpenOrderHistory}
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
          activeExchangeKey: props.getSelectedKeyQuery.chart.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getOpenOrderHistory}
      name={`getOpenOrderHistoryQuery`}
      fetchPolicy="network-only"
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

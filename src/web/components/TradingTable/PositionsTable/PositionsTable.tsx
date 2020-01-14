import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'
import { client } from '@core/graphql/apolloClient'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import {
  updateActivePositionsQuerryFunction,
  combinePositionsTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { FUTURES_POSITIONS } from '@core/graphql/subscriptions/FUTURES_POSITIONS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'

import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'

import { createOrder } from '@core/graphql/mutations/chart/createOrder'
import { cancelOrderStatus } from '@core/utils/tradingUtils'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'

@withTheme
class PositionsTable extends React.PureComponent {
  state = {
    positionsData: [],
    marketPrice: 0,
    needUpdate: true,
  }

  unsubscribeFunction: null | Function = null

  createOrder = async (variables) => {
    const { createOrderMutation } = this.props

    try {
      const result = await createOrderMutation({ variables })

      if (result.errors) {
        return {
          status: 'error',
          message: 'Something went wrong',
        }
      }
      if (result.data.createOrder.status === 'ERR') {
        return {
          status: 'error',
          message: result.data.createOrder.binanceMessage,
        }
      }
      if (result.data.createOrder.orderId) {
        return {
          status: 'success',
          message: 'Order placed',
          orderId: result.data.createOrder.orderId,
        }
      }
      return {
        status: 'error',
        message: 'Something went wrong',
      }
    } catch (err) {
      return {
        status: 'error',
        message: 'Something went wrong',
      }
    }
  }

  createOrderWithStatus = async (variables) => {
    const { showOrderResult, cancelOrder, marketType } = this.props

    const result = await this.createOrder(variables)
    await showOrderResult(result, cancelOrder, marketType)
  }

  onCancelOrder = async (keyId: string, orderId: string, pair: string) => {
    const { cancelOrderMutation, marketType } = this.props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
            marketType,
          },
        },
      })

      return responseResult
    } catch (err) {
      return { errors: err }
    }
  }

  cancelOrderWithStatus = async (
    keyId: string,
    orderId: string,
    pair: string
  ) => {
    const { showCancelResult } = this.props

    const result = await this.onCancelOrder(keyId, orderId, pair)
    showCancelResult(cancelOrderStatus(result))
  }

  // TODO: here should be a mutation order to cancel a specific order
  // TODO: Also it should receive an argument to edentify the order that we should cancel

  onCancelAll = async () => {
    // TODO: here should be a mutation func to cancel all orders
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  subscribe() {
    const { theme } = this.props

    const that = this

    this.subscription = client
      .subscribe({
        query: LISTEN_PRICE,
        variables: {
          input: {
            exchange: 'binance',
            pair: that.props.currencyPair,
          }
        },
        fetchPolicy: 'cache-only',
        // pollInterval: 15000,
      })
      .subscribe({
        next: (data) => {
          if (data.loading || data.data.listenPrice === that.state.marketPrice)
            return
          that.setState({ marketPrice: data.data.listenPrice })
        },
      })

    // this.subscription = client
    //   .subscribe({
    //     query: MARKET_TICKERS,
    //     variables: {
    //       symbol: that.props.currencyPair,
    //       exchange: that.props.exchange,
    //       marketType: String(that.props.marketType),
    //     },
    //   })
    //   .subscribe({
    //     next: (data) => {
    //       if (
    //         data &&
    //         data.data &&
    //         data.data.listenMarketTickers &&
    //         that.state.needUpdate
    //       ) {
    //         const marketPrice =
    //           data.data.listenMarketTickers[
    //             data.data.listenMarketTickers.length - 1
    //           ].price

    //         const positionsData = combinePositionsTable(
    //           that.props.getActivePositionsQuery.getActivePositions,
    //           that.cancelOrderWithStatus,
    //           that.createOrderWithStatus,
    //           theme,
    //           marketPrice,
    //           this.props.currencyPair,
    //           this.props.selectedKey.keyId
    //         )

    //         that.setState({
    //           positionsData,
    //           marketPrice,
    //           needUpdate: false,
    //         })
    //       }
    //     },
    //   })
  }

  componentDidMount() {
    const { getActivePositionsQuery, subscribeToMore, theme } = this.props

    this.subscribe()

    const positionsData = combinePositionsTable(
      getActivePositionsQuery.getActivePositions,
      this.cancelOrderWithStatus,
      this.createOrderWithStatus,
      theme,
      this.state.marketPrice,
      this.props.currencyPair,
      this.props.selectedKey.keyId
    )

    this.setState({
      positionsData,
    })

    const that = this

    client
      .watchQuery({
        query: getActivePositions,
        variables: {
          input: {
            keyId: this.props.selectedKey.keyId,
          },
        },
        fetchPolicy: 'cache-and-network',
      })
      .subscribe({
        next: async (data) => {
          if (!data.data || data.data.getActivePositions.length === 0) return

          const orderData =
            data.data.getActivePositions[
              data.data.getActivePositions.length - 1
            ]

          const positionData = await client.readQuery({
            query: getActivePositions,
            variables: {
              input: {
                keyId: that.props.selectedKey.keyId,
              },
            },
          })

          const currentPosition = positionData.getActivePositions.find(
            (pos) => pos.symbol === that.props.currencyPair
          )

          await client.writeQuery({
            query: getActivePositions,
            variables: {
              input: {
                keyId: that.props.selectedKey.keyId,
              },
            },
            data: {
              getActivePositions: positionData.getActivePositions.filter(
                (order) =>
                  !(
                    order._id === '0' &&
                    currentPosition.positionAmt === order.positionAmt &&
                    order.symbol === that.props.currencyPair
                  )
              ),
            },
          })
        },
      })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps) {
    if (!this.state.needUpdate) {
      setTimeout(() => this.setState({ needUpdate: true }), 10000)
    }

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType
    ) {
      this.subscription && this.subscription.unsubscribe()
      this.subscribe()
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }

    this.subscription && this.subscription.unsubscribe()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const positionsData = combinePositionsTable(
      nextProps.getActivePositionsQuery.getActivePositions,
      this.cancelOrderWithStatus,
      this.createOrderWithStatus,
      nextProps.theme,
      this.state.marketPrice,
      this.props.currencyPair,
      this.props.selectedKey.keyId
    )

    this.setState({
      positionsData,
    })
  }

  render() {
    const { positionsData } = this.state
    const { tab, handleTabChange, show, marketType } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%' }}
        stylesForTable={{ backgroundColor: '#fff' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        withCheckboxes={false}
        tableStyles={{
          headRow: {
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
          },
          heading: {
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            color: '#16253D',
            boxShadow: 'none',
            top: '0',
          },
          cell: {
            color: '#16253D',
            fontSize: '1rem', // 1.2 if bold
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
            paddingTop: '.5rem',
            paddingBottom: '.5rem',
          },
          tab: {
            padding: 0,
            boxShadow: 'none',
          },
          row: {
            height: '4.5rem',
            cursor: 'initial',
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              tab={tab}
              handleTabChange={handleTabChange}
              marketType={marketType}
            />
          </div>
        }
        rowsWithHover={false}
        data={{ body: positionsData }}
        columnNames={getTableHead(tab)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={PositionsTable}
      variables={{
        input: {
          keyId: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getActivePositions}
      name={`getActivePositionsQuery`}
      fetchPolicy="cache-and-network"
      pollInterval={15000}
      subscriptionArgs={{
        subscription: FUTURES_POSITIONS,
        variables: {
          input: {
            keyId: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateActivePositionsQuerryFunction,
      }}
      {...props}
    />
  )
}

export default compose(
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' }),
  graphql(createOrder, { name: 'createOrderMutation' })
)(TableDataWrapper)

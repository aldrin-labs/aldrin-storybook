import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './OpenOrdersTable.types'
import { OrderType } from '@core/types/ChartTypes'

import {
  updateOpenOrderHistoryQuerryFunction,
  combineOpenOrdersTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'
import { ordersHealthcheck } from '@core/graphql/mutations/chart/ordersHealthcheck'

import { client } from '@core/graphql/apolloClient'
import { cancelOrderStatus } from '@core/utils/tradingUtils'

@withTheme
class OpenOrdersTable extends React.PureComponent<IProps> {
  state: IState = {
    openOrdersProcessedData: [],
  }

  interval: null | number = null

  unsubscribeFunction: null | Function = null

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

    await this.props.addOrderToCanceled(orderId)
    const result = await this.onCancelOrder(keyId, orderId, pair)
    const status = await cancelOrderStatus(result)

    if (status.result === 'error') {
      await this.props.clearCanceledOrders()
    }

    showCancelResult(status)
  }

  // TODO: here should be a mutation order to cancel a specific order
  // TODO: Also it should receive an argument to edentify the order that we should cancel

  onCancelAll = async () => {
    // TODO: here should be a mutation func to cancel all orders
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  componentDidMount() {
    const {
      getOpenOrderHistoryQuery,
      subscribeToMore,
      theme,
      arrayOfMarketIds,
      marketType,
    } = this.props

    const openOrdersProcessedData = combineOpenOrdersTable(
      getOpenOrderHistoryQuery.getOpenOrderHistory,
      this.cancelOrderWithStatus,
      theme,
      arrayOfMarketIds,
      marketType,
      this.props.canceledOrders
    )

    client.writeQuery({
      query: getOpenOrderHistory,
      variables: {
        openOrderInput: {
          activeExchangeKey: this.props.selectedKey.keyId,
        },
      },
      data: {
        getOpenOrderHistory: getOpenOrderHistoryQuery.getOpenOrderHistory,
      },
    })

    this.setState({
      openOrdersProcessedData,
    })

    const that = this

    this.interval = window.setInterval(() => {
      const data = client.readQuery({
        query: getOpenOrderHistory,
        variables: {
          openOrderInput: {
            activeExchangeKey: this.props.selectedKey.keyId,
          },
        },
      })

      if (
        !this.props.show ||
        data.getOpenOrderHistory.find(
          (order: OrderType) => order.marketId === '0'
        )
      ) {
        return
      }

      that.props.getOpenOrderHistoryQueryRefetch()
    }, 60000)

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps: IProps) {
    const refetch = async () => {
      await this.props.getOpenOrderHistoryQueryRefetch()
    }

    if (this.props.show !== prevProps.show && this.props.show) {
      const data = client.readQuery({
        query: getOpenOrderHistory,
        variables: {
          openOrderInput: {
            activeExchangeKey: this.props.selectedKey.keyId,
          },
        },
      })

      if (
        data.getOpenOrderHistory.find(
          (order: OrderType) => order.marketId === '0'
        )
      ) {
        return
      }

      this.props.ordersHealthcheckMutation({
        variables: {
          input: {
            keyId: this.props.selectedKey.keyId,
            pair: this.props.currencyPair,
          },
        },
      })
      refetch()
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }

    this.interval && clearInterval(this.interval)
  }

  componentWillReceiveProps(nextProps: IProps) {
    const openOrdersProcessedData = combineOpenOrdersTable(
      nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory.filter(
        (order) => !this.props.canceledOrders.includes(order.info.orderId)
      ),
      this.cancelOrderWithStatus,
      nextProps.theme,
      nextProps.arrayOfMarketIds,
      nextProps.marketType,
      nextProps.canceledOrders
    )

    this.setState({
      openOrdersProcessedData,
    })
  }

  render() {
    const { openOrdersProcessedData } = this.state
    const {
      tab,
      handleTabChange,
      show,
      marketType,
      selectedKey,
      canceledOrders,
      currencyPair,
      arrayOfMarketIds,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%', overflowX: 'hidden' }}
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
          },
          cell: {
            color: '#7284A0',
            fontSize: '1rem', // 1.2 if bold
            fontWeight: 'bold',
            letterSpacing: '1px',
            borderBottom: '1px solid #e0e5ec',
            boxShadow: 'none',
          },
          tab: {
            padding: 0,
            boxShadow: 'none',
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              tab={tab}
              handleTabChange={handleTabChange}
              marketType={marketType}
              canceledOrders={canceledOrders}
              selectedKey={selectedKey}
              currencyPair={currencyPair}
              arrayOfMarketIds={arrayOfMarketIds}
            />
          </div>
        }
        data={{ body: openOrdersProcessedData }}
        columnNames={getTableHead(tab, marketType)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={OpenOrdersTable}
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

const MemoizedWrapper = React.memo(TableDataWrapper, (prevProps, nextProps) => {
  if (!nextProps.show && !prevProps.show) {
    return true
  }

  return false
})

export default compose(
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' }),
  graphql(ordersHealthcheck, { name: 'ordersHealthcheckMutation' })
)(MemoizedWrapper)

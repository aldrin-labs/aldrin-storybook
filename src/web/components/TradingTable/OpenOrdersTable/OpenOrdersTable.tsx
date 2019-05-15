import React from 'react'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './OpenOrdersTable.types'
import {
  updateOpenOrderHistoryQuerryFunction,
  combineOpenOrdersTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'

import { cancelOrderStatus } from '@core/utils/tradingUtils'

@withTheme()
class OpenOrdersTable extends React.PureComponent<IProps> {
  state: IState = {
    openOrdersProcessedData: [],
  }

  onCancelOrder = async (keyId: string, orderId: string, pair: string) => {
    const { cancelOrderMutation } = this.props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
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

  componentDidMount() {
    const { getOpenOrderHistoryQuery, subscribeToMore, theme } = this.props

    const openOrdersProcessedData = combineOpenOrdersTable(
      getOpenOrderHistoryQuery.getOpenOrderHistory,
      this.cancelOrderWithStatus,
      theme
    )
    this.setState({
      openOrdersProcessedData,
    })

    subscribeToMore()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const openOrdersProcessedData = combineOpenOrdersTable(
      nextProps.getOpenOrderHistoryQuery.getOpenOrderHistory,
      this.cancelOrderWithStatus,
      nextProps.theme
    )
    this.setState({
      openOrdersProcessedData,
    })
  }

  render() {
    const { openOrdersProcessedData } = this.state
    const { tab, tabIndex, handleTabChange, show } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        withCheckboxes={false}
        tableStyles={{
          heading: {
            fontSize: CSS_CONFIG.chart.headCell.fontSize,
            top: CSS_CONFIG.chart.headCell.customTop,
          },
          cell: {
            fontSize: CSS_CONFIG.chart.headCell.fontSize,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              tabIndex={tabIndex}
              handleTabChange={handleTabChange}
            />
          </div>
        }
        data={{ body: openOrdersProcessedData }}
        columnNames={getTableHead(tab)}
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
      fetchPolicy="network-only"
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

export default graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' })(
  TableDataWrapper
)

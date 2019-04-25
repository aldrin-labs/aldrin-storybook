import React from 'react'
import { graphql } from 'react-apollo'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps } from './OpenOrdersTable.types'
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
import { CANCEL_ORDER } from '@core/graphql/mutations/chart/cancelOrder'

class OpenOrdersTable extends React.PureComponent<IProps> {
  state = {
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

      console.log('responseResult', responseResult)
    } catch (e) {
      console.log('error in cancelOrder', e);

    }


    // TODO: here should be a mutation order to cancel a specific order
    // TODO: Also it should receive an argument to edentify the order that we should cancel
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  onCancelAll = async () => {
    // TODO: here should be a mutation func to cancel all orders
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  componentDidMount() {

    const { getOpenOrderHistory, subscribeToMore } = this.props

    const openOrdersProcessedData = combineOpenOrdersTable(
      getOpenOrderHistory.getOpenOrderHistory,
      this.onCancelOrder
    )
    this.setState({
      openOrdersProcessedData,
    })

    subscribeToMore()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const openOrdersProcessedData = combineOpenOrdersTable(
      nextProps.getOpenOrderHistory.getOpenOrderHistory,
      this.onCancelOrder
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
      withOutSpinner={true}
      withTableLoader={true}
      query={getOpenOrderHistory}
      name={`getOpenOrderHistory`}
      fetchPolicy="network-only"
      subscriptionArgs={{
        subscription: OPEN_ORDER_HISTORY,
        updateQueryFunction: updateOpenOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default graphql(CANCEL_ORDER, { name: 'cancelOrderMutation' })(
  TableDataWrapper
)

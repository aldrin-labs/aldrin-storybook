import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'
import TablePlaceholderLoader from '@sb/components/TablePlaceholderLoader'

import { IProps } from './OpenOrdersTable.types'
import {
  updateOrderHistoryQuerryFunction,
  combineOrderHistoryTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getOrderHistory } from '@core/graphql/queries/chart/getOrderHistory'
import { ORDER_HISTORY } from '@core/graphql/subscriptions/ORDER_HISTORY'

class OrderHistoryTable extends React.PureComponent<IProps> {
  state = {
    orderHistoryProcessedData: [],
  }

  componentDidMount() {
    const orderHistoryProcessedData = combineOrderHistoryTable(
      this.props.getOrderHistory.getOrderHistory
    )
    this.setState({
      orderHistoryProcessedData,
    })
  }

  componentWillReceiveProps(nextProps) {
    const orderHistoryProcessedData = combineOrderHistoryTable(
      nextProps.getOrderHistory.getOrderHistory
    )
    this.setState({
      orderHistoryProcessedData,
    })
  }

  render() {
    const { orderHistoryProcessedData } = this.state
    const {
      tab,
      tabIndex,
      show,
      handleTabChange,
      focusedInput,
      endDate,
      activeDateButton,
      startDate,
      maximumDate,
      minimumDate,
      onSearchDateButtonClick,
      onClearDateButtonClick,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        withCheckboxes={false}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              tabIndex={tabIndex}
              handleTabChange={handleTabChange}
            />
            <TradingTitle
              {...{
                startDate,
                endDate,
                focusedInput,
                activeDateButton,
                minimumDate,
                maximumDate,
                onDateButtonClick,
                onDatesChange,
                onFocusChange,
                onSearchDateButtonClick,
                onClearDateButtonClick,
              }}
            />
          </div>
        }
        data={{ body: orderHistoryProcessedData }}
        columnNames={getTableHead(tab)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  const { startDate, endDate } = props

  return (
    <QueryRenderer
      component={OrderHistoryTable}
      withOutSpinner
      query={getOrderHistory}
      fetchPolicy="network-only"
      placeholder={TablePlaceholderLoader}
      variables={{ startDate, endDate }}
      subscriptionArgs={{
        subscription: ORDER_HISTORY,
        variables: { startDate, endDate },
        updateQueryFunction: updateOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default TableDataWrapper

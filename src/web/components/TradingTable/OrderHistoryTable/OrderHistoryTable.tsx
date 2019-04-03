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
} from '@components/TradingTable/TradingTable.utils'
import TradingTabs from '@components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@components/TradingTable/TradingTitle/TradingTitle'
import { getOpenOrderHistory } from '@core/graphql/queries/chart/getOpenOrderHistory'
import { OPEN_ORDER_HISTORY } from '@core/graphql/subscriptions/OPEN_ORDER_HISTORY'

class OrderHistoryTable extends React.PureComponent<IProps> {
  state = {
    orderHistoryProcessedData: [],
  }

  componentDidMount() {
    const orderHistoryProcessedData = combineOrderHistoryTable(
      this.props.getOpenOrderHistory.getOpenOrderHistory
    )
    this.setState({
      orderHistoryProcessedData,
    })
  }

  componentWillReceiveProps(nextProps) {
    const orderHistoryProcessedData = combineOrderHistoryTable(
      nextProps.getOpenOrderHistory.getOpenOrderHistory
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
      query={getOpenOrderHistory}
      fetchPolicy="network-only"
      placeholder={TablePlaceholderLoader}
      variables={{ startDate, endDate }}
      subscriptionArgs={{
        subscription: OPEN_ORDER_HISTORY,
        variables: { startDate, endDate },
        updateQueryFunction: updateOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default TableDataWrapper

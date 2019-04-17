import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

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
import { CSS_CONFIG } from '@sb/config/cssConfig'

class OrderHistoryTable extends React.PureComponent<IProps> {
  state = {
    orderHistoryProcessedData: [],
  }

  componentDidMount() {
    const { getOrderHistory, subscribeToMore } = this.props

    const orderHistoryProcessedData = combineOrderHistoryTable(
      getOrderHistory.getOrderHistory
    )
    this.setState({
      orderHistoryProcessedData,
    })

    subscribeToMore()
  }

  componentWillReceiveProps(nextProps: IProps) {
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
  let { startDate, endDate } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={OrderHistoryTable}
      withOutSpinner={true}
      withTableLoader={true}
      query={getOrderHistory}
      name={`getOrderHistory`}
      fetchPolicy="network-only"
      variables={{ orderHistoryInput: { startDate, endDate } }}
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

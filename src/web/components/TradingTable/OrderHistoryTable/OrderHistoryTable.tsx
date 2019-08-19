import React from 'react'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './OrderHistoryTable.types'
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

@withTheme()
class OrderHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    orderHistoryProcessedData: [],
  }

  componentDidMount() {
    const { getOrderHistoryQuery, subscribeToMore, theme } = this.props

    const orderHistoryProcessedData = combineOrderHistoryTable(
      getOrderHistoryQuery.getOrderHistory,
      theme
    )
    this.setState({
      orderHistoryProcessedData,
    })

    subscribeToMore()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const orderHistoryProcessedData = combineOrderHistoryTable(
      nextProps.getOrderHistoryQuery.getOrderHistory,
      nextProps.theme
    )
    this.setState({
      orderHistoryProcessedData,
    })
  }

  render() {
    const { orderHistoryProcessedData } = this.state
    const {
      tab,
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
        defaultSort={{
          sortColumn: getTableHead(tab)[0].id,
          sortDirection: 'desc',
        }}
        withCheckboxes={false}
        tableStyles={{
          heading: {
            fontSize: CSS_CONFIG.chart.headCell.fontSize,
            top: CSS_CONFIG.chart.headCell.top,
          },
          cell: {
            fontSize: CSS_CONFIG.chart.headCell.fontSize,
          },
          tab: {
            padding: 0,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs tab={tab} handleTabChange={handleTabChange} />
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
      variables={{
        orderHistoryInput: {
          startDate,
          endDate,
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getOrderHistory}
      name={`getOrderHistoryQuery`}
      fetchPolicy="network-only"
      subscriptionArgs={{
        subscription: ORDER_HISTORY,
        variables: {
          orderHistoryInput: {
            startDate,
            endDate,
            activeExchangeKey: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default TableDataWrapper

import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'
import TablePlaceholderLoader from '@sb/components/TablePlaceholderLoader'

import { IProps } from './OpenOrdersTable.types'
import {
  combineTradeHistoryTable,
  updateTradeHistoryQuerryFunction,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@components/TradingTable/TradingTable.utils'
import TradingTabs from '@components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@components/TradingTable/TradingTitle/TradingTitle'
import { getTradeHistory } from '@core/graphql/queries/chart/getTradeHistory'
import { TRADE_HISTORY } from '@core/graphql/subscriptions/TRADE_HISTORY'

class TradeHistoryTable extends React.PureComponent<IProps> {
  state = {
    tradeHistoryProcessedData: [],
  }

  componentDidMount() {
    const tradeHistoryProcessedData = combineTradeHistoryTable(
      this.props.getTradeHistory.getTradeHistory
    )
    this.setState({
      tradeHistoryProcessedData,
    })
  }

  componentWillReceiveProps(nextProps) {
    const tradeHistoryProcessedData = combineTradeHistoryTable(
      nextProps.getTradeHistory.getTradeHistory
    )
    this.setState({
      tradeHistoryProcessedData,
    })
  }

  render() {
    const { tradeHistoryProcessedData } = this.state
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
        data={{ body: tradeHistoryProcessedData }}
        columnNames={getTableHead(tab)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  const { startDate, endDate } = props

  return (
    <QueryRenderer
      component={TradeHistoryTable}
      withOutSpinner
      query={getTradeHistory}
      fetchPolicy="network-only"
      placeholder={TablePlaceholderLoader}
      variables={{ startDate, endDate }}
      subscriptionArgs={{
        subscription: TRADE_HISTORY,
        variables: { startDate, endDate },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default TableDataWrapper

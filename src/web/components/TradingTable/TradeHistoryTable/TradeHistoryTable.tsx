import React from 'react'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps } from './OpenOrdersTable.types'
import {
  combineTradeHistoryTable,
  updateTradeHistoryQuerryFunction,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
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
    console.log('this.props in TradeHistoryTable', this.props);
    console.log('tradeHistoryProcessedData', tradeHistoryProcessedData);

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
        // emptyTableText={getEmptyTextPlaceholder(tab)}
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
  let { startDate, endDate } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={TradeHistoryTable}
      withOutSpinner={true}
      withTableLoader={true}
      query={getTradeHistory}
      name={`getTradeHistory`}
      fetchPolicy="network-only"
      variables={{ tradeHistoryInput: {startDate, endDate} }}
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

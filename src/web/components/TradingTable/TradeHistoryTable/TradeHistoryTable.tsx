import React from 'react'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradeHistoryTable.types'
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
import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme()
class TradeHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    tradeHistoryProcessedData: [],
  }

  componentDidMount() {
    const { getTradeHistoryQuery, subscribeToMore, theme } = this.props

    const tradeHistoryProcessedData = combineTradeHistoryTable(
      getTradeHistoryQuery.getTradeHistory,
      theme
    )
    this.setState({
      tradeHistoryProcessedData,
    })

    subscribeToMore()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const tradeHistoryProcessedData = combineTradeHistoryTable(
      nextProps.getTradeHistoryQuery.getTradeHistory,
      nextProps.theme
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
      name={`getTradeHistoryQuery`}
      fetchPolicy="network-only"
      variables={{
        tradeHistoryInput: {
          startDate,
          endDate,
          activeExchangeKey: props.selectedKey,
        },
      }}
      subscriptionArgs={{
        subscription: TRADE_HISTORY,
        variables: {
          tradeHistoryInput: {
            startDate,
            endDate,
            activeExchangeKey: props.selectedKey,
          },
        },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default TableDataWrapper

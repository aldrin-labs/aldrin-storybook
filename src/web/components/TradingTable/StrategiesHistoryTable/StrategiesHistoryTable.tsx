import React from 'react'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradeHistoryTable.types'

import {
  updateActiveStrategiesQuerryFunction,
  combineStrategiesHistoryTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getStrategiesHistory } from '@core/graphql/queries/chart/getStrategiesHistory'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'
// import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme
class StrategiesHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    strategiesHistoryProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

  componentDidMount() {
    const {
      getStrategiesHistoryQuery,
      subscribeToMore,
      theme,
      marketType,
    } = this.props

    const strategiesHistoryProcessedData = combineStrategiesHistoryTable(
      getStrategiesHistoryQuery.getStrategiesHistory,
      theme,
      marketType
    )

    this.setState({
      strategiesHistoryProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const strategiesHistoryProcessedData = combineStrategiesHistoryTable(
      nextProps.getStrategiesHistoryQuery.getStrategiesHistory,
      nextProps.theme,
      nextProps.marketType
    )

    this.setState({
      strategiesHistoryProcessedData,
    })
  }

  render() {
    const { strategiesHistoryProcessedData } = this.state

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
      marketType,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%' }}
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
        data={{ body: strategiesHistoryProcessedData }}
        columnNames={getTableHead(tab, marketType)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  // let { startDate, endDate } = props

  // startDate = +startDate
  // endDate = +endDate

  return (
    <QueryRenderer
      component={StrategiesHistoryTable}
      variables={{
        strategiesHistoryInput: {
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getStrategiesHistory}
      name={`getStrategiesHistoryQuery`}
      fetchPolicy="cache-and-network"
      pollInterval={20000}
      subscriptionArgs={{
        subscription: ACTIVE_STRATEGIES,
        variables: {
          activeStrategiesInput: {
            activeExchangeKey: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateActiveStrategiesQuerryFunction,
      }}
      {...props}
    />
  )
}

export default TableDataWrapper

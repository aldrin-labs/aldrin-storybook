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
// import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme
class OrderHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    orderHistoryProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

  componentDidMount() {
    const {
      getOrderHistoryQuery,
      subscribeToMore,
      theme,
      arrayOfMarketIds,
      marketType,
    } = this.props

    const orderHistoryProcessedData = combineOrderHistoryTable(
      getOrderHistoryQuery.getOrderHistory,
      theme,
      arrayOfMarketIds,
      marketType
    )
    this.setState({
      orderHistoryProcessedData,
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
    const orderHistoryProcessedData = combineOrderHistoryTable(
      nextProps.getOrderHistoryQuery.getOrderHistory,
      nextProps.theme,
      nextProps.arrayOfMarketIds,
      nextProps.marketType
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
        data={{ body: orderHistoryProcessedData }}
        columnNames={getTableHead(tab, marketType)}
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
      fetchPolicy="cache-and-network"
      pollInterval={60000}
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

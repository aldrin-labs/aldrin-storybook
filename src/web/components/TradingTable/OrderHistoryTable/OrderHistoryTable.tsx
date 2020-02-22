import React from 'react'
import copy from 'clipboard-copy'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './OrderHistoryTable.types'
import {
  updatePaginatedOrderHistoryQuerryFunction,
  combineOrderHistoryTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getPaginatedOrderHistory } from '@core/graphql/queries/chart/getPaginatedOrderHistory'
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
      getPaginatedOrderHistoryQuery,
      subscribeToMore,
      theme,
      arrayOfMarketIds,
      marketType,
    } = this.props

    console.log('props', this.props)

    const orderHistoryProcessedData = combineOrderHistoryTable(
      getPaginatedOrderHistoryQuery.getPaginatedOrderHistory,
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
      nextProps.getPaginatedOrderHistoryQuery.getPaginatedOrderHistory,
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
      page,
      perPage,
      theme,
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
      selectedKey,
      canceledOrders,
      currencyPair,
      arrayOfMarketIds,
      handleChangePage,
      handleChangeRowsPerPage,
    } = this.props

    if (!show) {
      return null
    }

    const maxRows = this.props.getPaginatedOrderHistoryQuery
      .getPaginatedOrderHistory.count

    return (
      <TableWithSort
        style={{ borderRadius: 0, height: '100%' }}
        stylesForTable={{ backgroundColor: '#fff' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        onTrClick={(row) => {
          copy(row.id.split('_')[0])
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
              arrayOfMarketIds={arrayOfMarketIds}
              canceledOrders={canceledOrders}
              selectedKey={selectedKey}
              currencyPair={currencyPair}
            />
            <TradingTitle
              {...{
                page,
                perPage,
                startDate,
                endDate,
                theme,
                maxRows,
                focusedInput,
                activeDateButton,
                minimumDate,
                maximumDate,
                onDateButtonClick,
                onDatesChange,
                onFocusChange,
                onClearDateButtonClick,
                handleChangePage,
                handleChangeRowsPerPage,
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
  let { startDate, endDate, page, perPage, marketType } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={OrderHistoryTable}
      variables={{
        paginatedOrderHistoryInput: {
          page,
          perPage,
          startDate,
          endDate,
          marketType,
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      showLoadingWhenQueryParamsChange={false}
      query={getPaginatedOrderHistory}
      name={`getPaginatedOrderHistoryQuery`}
      fetchPolicy="cache-and-network"
      pollInterval={props.show ? 45000 : 0}
      subscriptionArgs={{
        subscription: ORDER_HISTORY,
        variables: {
          orderHistoryInput: {
            startDate,
            endDate,
            marketType,
            activeExchangeKey: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updatePaginatedOrderHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

export default React.memo(TableDataWrapper, (prevProps, nextProps) => {
  if (!nextProps.show && !prevProps.show) {
    return true
  }

  return false
})

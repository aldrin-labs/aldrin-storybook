import React from 'react'
import copy from 'clipboard-copy'
import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradeHistoryTable.types'

import {
  updateStrategiesHistoryQuerryFunction,
  combineStrategiesHistoryTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import { PaginationBlock } from '../TradingTablePagination'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getStrategiesHistory } from '@core/graphql/queries/chart/getStrategiesHistory'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'
import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'

// import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme()
class StrategiesHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    strategiesHistoryProcessedData: [],
    expandedRows: [],
  }

  unsubscribeFunction: null | Function = null

  componentDidMount() {
    const {
      getStrategiesHistoryQuery,
      subscribeToMore,
      theme,
      marketType,
      keys,
    } = this.props

    const strategiesHistoryProcessedData = combineStrategiesHistoryTable(
      getStrategiesHistoryQuery.getStrategiesHistory.strategies,
      theme,
      marketType,
      keys
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
      nextProps.getStrategiesHistoryQuery.getStrategiesHistory.strategies,
      nextProps.theme,
      nextProps.marketType,
      nextProps.keys
    )

    this.setState({
      strategiesHistoryProcessedData,
    })
  }

  setExpandedRows = (id: string) => {
    this.setState(
      (prevState) => ({
        expandedRows: onCheckBoxClick(prevState.expandedRows, id),
      }),
      () => this.forceUpdate()
    )
  }

  render() {
    const { strategiesHistoryProcessedData, expandedRows } = this.state

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
      allKeys,
      specificPair,
      handleToggleAllKeys,
      handleToggleSpecificPair,
      onClearDateButtonClick,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,
      marketType,
      selectedKey,
      canceledOrders,
      currencyPair,
      arrayOfMarketIds,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
      handleChangePage,
      handleChangeRowsPerPage,
      getStrategiesHistoryQuery,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        hideCommonCheckbox
        expandableRows={true}
        expandedRows={expandedRows}
        onChange={this.setExpandedRows}
        rowsWithHover={false}
        style={{ borderRadius: 0 }}
        stylesForTable={{ backgroundColor: '#fff' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        onTrClick={(row) => {
          this.setExpandedRows(row.id)
          copy(row.id)
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
        pagination={{
          fakePagination: false,
          enabled: true,
          totalCount: getStrategiesHistoryQuery.getStrategiesHistory.count,
          page: page,
          rowsPerPage: perPage,
          rowsPerPageOptions: [10, 20, 30, 50, 100],
          handleChangePage: handleChangePage,
          handleChangeRowsPerPage: handleChangeRowsPerPage,
          additionalBlock: (
            <PaginationBlock
              {...{
                allKeys,
                specificPair,
                handleToggleAllKeys,
                handleToggleSpecificPair,
              }}
            />
          ),
          paginationStyles: { width: 'calc(100% - 0.4rem)' },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTabs
              {...{
                tab,
                marketType,
                selectedKey,
                currencyPair,
                canceledOrders,
                handleTabChange,
                arrayOfMarketIds,
                showAllPositionPairs,
                showAllOpenOrderPairs,
                showAllSmartTradePairs,
                showPositionsFromAllAccounts,
                showOpenOrdersFromAllAccounts,
                showSmartTradesFromAllAccounts,
              }}
            />
            <TradingTitle
              {...{
                page,
                perPage,
                startDate,
                endDate,
                theme,
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
                maxRows: getStrategiesHistoryQuery.getStrategiesHistory.count,
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
  let { startDate, endDate, page, perPage, allKeys, specificPair } = props

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={StrategiesHistoryTable}
      variables={{
        strategiesHistoryInput: {
          marketType: props.marketType,
          activeExchangeKey: props.selectedKey.keyId,
          perPage,
          page,
          startDate,
          endDate,
          allKeys,
          ...(!specificPair ? {} : { specificPair: props.currencyPair }),
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getStrategiesHistory}
      showLoadingWhenQueryParamsChange={false}
      name={`getStrategiesHistoryQuery`}
      fetchPolicy="cache-and-network"
      pollInterval={props.show ? 25000 : 0}
      subscriptionArgs={{
        subscription: ACTIVE_STRATEGIES,
        variables: {
          activeStrategiesInput: {
            activeExchangeKey: props.selectedKey.keyId,
            marketType: props.marketType,
            allKeys,
            ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateStrategiesHistoryQuerryFunction,
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

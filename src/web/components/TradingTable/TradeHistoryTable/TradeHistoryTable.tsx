import React from 'react'
import copy from 'clipboard-copy'
import { compose } from 'recompose'
import { withTheme } from '@material-ui/styles'

import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import { IProps, IState } from './TradeHistoryTable.types'
import {
  combineTradeHistoryTable,
  updateTradeHistoryQuerryFunction,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import { PaginationBlock } from '../TradingTablePagination'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import TradingTitle from '@sb/components/TradingTable/TradingTitle/TradingTitle'
import { getTradeHistory } from '@core/graphql/queries/chart/getTradeHistory'
import { TRADE_HISTORY } from '@core/graphql/subscriptions/TRADE_HISTORY'
// import { CSS_CONFIG } from '@sb/config/cssConfig'

@withTheme()
class TradeHistoryTable extends React.PureComponent<IProps> {
  state: IState = {
    tradeHistoryProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

  componentDidMount() {
    const {
      getTradeHistoryQuery,
      subscribeToMore,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision
    } = this.props

    const tradeHistoryProcessedData = combineTradeHistoryTable({
      data: getTradeHistoryQuery.getTradeHistory.trades,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision
    })

    this.setState({
      tradeHistoryProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys ||
      prevProps.marketType !== this.props.marketType
    ) {
      const {
        startDate,
        endDate,
        marketType,
        selectedKey,
        allKeys,
        currencyPair,
        specificPair,
      } = this.props

      this.unsubscribeFunction && this.unsubscribeFunction()
      this.unsubscribeFunction = this.props.getTradeHistoryQuery.subscribeToMore(
        {
          document: TRADE_HISTORY,
          variables: {
            tradeHistoryInput: {
              startDate: startDate.valueOf(),
              endDate: endDate.valueOf(),
              marketType,
              activeExchangeKey: selectedKey.keyId,
              allKeys,
              ...(!specificPair ? {} : { specificPair: currencyPair }),
            },
          },
          updateQuery: updateTradeHistoryQuerryFunction,
        }
      )
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }

  componentWillReceiveProps(nextProps: IProps) {

    const {
      getTradeHistoryQuery,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision
    } = nextProps

    const tradeHistoryProcessedData = combineTradeHistoryTable({
      data: getTradeHistoryQuery.getTradeHistory.trades,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision
    })

    this.setState({
      tradeHistoryProcessedData,
    })
  }

  render() {
    const { tradeHistoryProcessedData } = this.state

    const {
      tab,
      show,
      page,
      perPage,
      theme,
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
      allKeys,
      specificPair,
      handleToggleAllKeys,
      handleToggleSpecificPair,
      handleChangePage,
      getTradeHistoryQuery,
      handleChangeRowsPerPage,
    } = this.props

    if (!show) {
      return null
    }

    return (
      <TableWithSort
        style={{
          borderRadius: 0,
          backgroundColor: theme.palette.white.background,
        }}
        onTrClick={(row) => {
          copy(row.id.split('_')[0])
        }}
        stylesForTable={{ backgroundColor: theme.palette.white.background }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        withCheckboxes={false}
        tableStyles={{
          headRow: {
            borderBottom: theme.palette.border.main,
            boxShadow: 'none',
          },
          heading: {
            fontSize: '1.4rem',
            fontWeight: 'bold',
            backgroundColor: theme.palette.white.background,
            color: theme.palette.grey.light,
            boxShadow: 'none',
            textTransform: 'capitalize',
          },
          cell: {
            color: theme.palette.grey.onboard,
            fontSize: '1.1rem', // 1.2 if bold
            fontFamily: 'Avenir Next Demi',
            backgroundColor: theme.palette.white.background,
            letterSpacing: '.1rem',
            borderBottom: theme.palette.border.main,
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
          totalCount: getTradeHistoryQuery.getTradeHistory.count,
          page: page,
          rowsPerPage: perPage,
          rowsPerPageOptions: [10, 20, 30, 50, 100],
          handleChangePage: handleChangePage,
          handleChangeRowsPerPage: handleChangeRowsPerPage,
          additionalBlock: (
            <PaginationBlock
              {...{
                theme,
                allKeys,
                specificPair,
                handleToggleAllKeys,
                handleToggleSpecificPair,
                loading: getTradeHistoryQuery.queryParamsWereChanged,
              }}
            />
          ),
          paginationStyles: {
            width: 'calc(100%)',
            backgroundColor: theme.palette.white.background,
            border: theme.palette.border.main,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
            <TradingTitle
              {...{
                page,
                perPage,
                theme,
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
                handleChangePage,
                handleChangeRowsPerPage,
                maxRows: getTradeHistoryQuery.getTradeHistory.count,
              }}
            />
          </div>
        }
        data={{ body: tradeHistoryProcessedData }}
        columnNames={getTableHead(tab, marketType)}
      />
    )
  }
}

const TableDataWrapper = compose(
  queryRendererHoc({
    withOutSpinner: false,
    withTableLoader: false,
    query: getTradeHistory,
    name: `getTradeHistoryQuery`,
    fetchPolicy: 'cache-and-network',
    showLoadingWhenQueryParamsChange: false,
    variables: (props: any) => ({
      tradeHistoryInput: {
        page: props.page,
        perPage: props.perPage,
        startDate: +props.startDate,
        endDate: +props.endDate,
        activeExchangeKey: props.selectedKey.keyId,
        marketType: props.marketType,
        allKeys: props.allKeys,
        ...(!props.specificPair ? {} : { specificPair: props.currencyPair }),
      },
    }),
    subscriptionArgs: {
      subscription: TRADE_HISTORY,
      variables: (props: any) => ({
        tradeHistoryInput: {
          startDate: +props.startDate,
          endDate: +props.endDate,
          activeExchangeKey: props.selectedKey.keyId,
          marketType: props.marketType,
          allKeys: props.allKeys,
          ...(!props.specificPair ? {} : { specificPair: props.currencyPair }),
        },
      }),
      updateQueryFunction: updateTradeHistoryQuerryFunction,
    },
  })
)(TradeHistoryTable)

export default React.memo(TableDataWrapper, (prevProps, nextProps) => {
  // TODO: Refactor isShowEqual --- not so clean
  const isShowEqual = !nextProps.show && !prevProps.show
  const showAllAccountsEqual = prevProps.allKeys === nextProps.allKeys
  const showAllPairsEqual = prevProps.specificPair === nextProps.specificPair
  // TODO: here must be smart condition if specificPair is not changed
  const pairIsEqual = prevProps.currencyPair === nextProps.currencyPair
  // TODO: here must be smart condition if showAllAccountsEqual is true & is not changed
  const selectedKeyIsEqual =
    prevProps.selectedKey.keyId === nextProps.selectedKey.keyId
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType
  const startDateIsEqual = +prevProps.startDate === +nextProps.startDate
  const endDateIsEqual = +prevProps.endDate === +nextProps.endDate
  const pageIsEqual = prevProps.page === nextProps.page
  const perPageIsEqual = prevProps.perPage === nextProps.perPage

  if (
    isShowEqual &&
    showAllAccountsEqual &&
    showAllPairsEqual &&
    pairIsEqual &&
    selectedKeyIsEqual &&
    isMarketIsEqual &&
    startDateIsEqual &&
    endDateIsEqual &&
    pageIsEqual &&
    perPageIsEqual
  ) {
    return true
  }

  return false
})

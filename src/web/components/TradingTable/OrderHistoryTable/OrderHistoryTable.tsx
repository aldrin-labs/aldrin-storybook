import React from 'react'
import copy from 'clipboard-copy'
import { withTheme } from '@material-ui/styles'
import { useSnackbar } from 'notistack'
import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'
import { PaginationBlock } from '../TradingTablePagination'
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

@withTheme()
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
      keys,
      arrayOfMarketIds,
      marketType,
      handlePairChange,
    } = this.props

    const orderHistoryProcessedData = combineOrderHistoryTable(
      getPaginatedOrderHistoryQuery.getPaginatedOrderHistory.orders,
      theme,
      arrayOfMarketIds,
      marketType,
      keys,
      handlePairChange
    )
    this.setState({
      orderHistoryProcessedData,
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
        enqueueSnackbar,
      } = this.props

      this.unsubscribeFunction && this.unsubscribeFunction()
      this.unsubscribeFunction = this.props.getPaginatedOrderHistoryQuery.subscribeToMore(
        {
          document: ORDER_HISTORY,
          variables: {
            orderHistoryInput: {
              startDate: startDate.valueOf(),
              endDate: endDate.valueOf(),
              marketType,
              activeExchangeKey: selectedKey.keyId,
              allKeys,
              ...(!specificPair ? {} : { specificPair: currencyPair }),
            },
          },
          updateQuery: (prev, data) =>
            updatePaginatedOrderHistoryQuerryFunction(
              prev,
              data,
              enqueueSnackbar
            ),
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
    const orderHistoryProcessedData = combineOrderHistoryTable(
      nextProps.getPaginatedOrderHistoryQuery.getPaginatedOrderHistory.orders,
      nextProps.theme,
      nextProps.arrayOfMarketIds,
      nextProps.marketType,
      nextProps.keys,
      nextProps.handlePairChange
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
      focusedInput,
      endDate,
      activeDateButton,
      startDate,
      maximumDate,
      minimumDate,
      allKeys,
      specificPair,
      onClearDateButtonClick,
      onDateButtonClick,
      onDatesChange,
      onFocusChange,
      marketType,
      handleChangePage,
      handleChangeRowsPerPage,
      handleToggleAllKeys,
      handleToggleSpecificPair,
    } = this.props

    if (!show) {
      return null
    }

    const maxRows = this.props.getPaginatedOrderHistoryQuery
      .getPaginatedOrderHistory.count

    return (
      <TableWithSort
        style={{
          borderRadius: 0,
          height: 'calc(100% - 6rem)',
          backgroundColor: theme.palette.white.background,
        }}
        stylesForTable={{ backgroundColor: theme.palette.white.background }}
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
            borderBottom: theme.palette.border.main,
            boxShadow: 'none',
          },
          heading: {
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: theme.palette.white.background,
            color: theme.palette.dark.main,
            boxShadow: 'none',
          },
          cell: {
            color: theme.palette.dark.main,
            fontSize: '1rem', // 1.2 if bold
            fontWeight: 'bold',
            letterSpacing: '.1rem',
            borderBottom: theme.palette.border.main,
            backgroundColor: theme.palette.white.background,
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
          totalCount: maxRows,
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
              }}
            />
          ),
          paginationStyles: {
            width: 'calc(100%)',
            backgroundColor: theme.palette.white.background,
            border: theme.palette.border.main,
            borderRight: 0,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
        title={
          <div>
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
  let {
    startDate,
    endDate,
    page,
    perPage,
    marketType,
    allKeys,
    specificPair,
  } = props

  const { enqueueSnackbar } = useSnackbar()

  startDate = +startDate
  endDate = +endDate

  return (
    <QueryRenderer
      component={OrderHistoryTable}
      enqueueSnackbar={enqueueSnackbar}
      variables={{
        paginatedOrderHistoryInput: {
          page,
          perPage,
          startDate,
          endDate,
          marketType,
          allKeys,
          ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={false}
      withTableLoader={false}
      showLoadingWhenQueryParamsChange={false}
      query={getPaginatedOrderHistory}
      name={`getPaginatedOrderHistoryQuery`}
      fetchPolicy="cache-and-network"
      // pollInterval={props.show ? 45000 : 0}
      subscriptionArgs={{
        subscription: ORDER_HISTORY,
        variables: {
          orderHistoryInput: {
            startDate,
            endDate,
            marketType,
            activeExchangeKey: props.selectedKey.keyId,
            allKeys,
            ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: (prev, data) =>
          updatePaginatedOrderHistoryQuerryFunction(
            prev,
            data,
            enqueueSnackbar
          ),
      }}
      {...props}
    />
  )
}

export default React.memo(TableDataWrapper, (prevProps, nextProps) => {
  // TODO: Refactor isShowEqual --- not so clean
  const isShowEqual = !nextProps.show && !prevProps.show
  const showAllAccountsEqual =
    prevProps.allKeys ===
    nextProps.allKeys
  const showAllPairsEqual =
    prevProps.specificPair === nextProps.specificPair
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

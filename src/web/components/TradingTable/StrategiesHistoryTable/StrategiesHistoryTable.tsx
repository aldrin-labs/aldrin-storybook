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
  SMMock,
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
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    } = this.props

    const strategiesHistoryProcessedData = combineStrategiesHistoryTable({
      data: getStrategiesHistoryQuery.getStrategiesHistory.strategies,
      theme,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    })

    this.setState({
      strategiesHistoryProcessedData,
    })

    // this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys ||
      prevProps.marketType !== this.props.marketType
    ) {
      // const {
      //   startDate,
      //   endDate,
      //   marketType,
      //   selectedKey,
      //   allKeys,
      //   currencyPair,
      //   specificPair,
      // } = this.props
      // this.unsubscribeFunction && this.unsubscribeFunction()
      // this.unsubscribeFunction = this.props.getStrategiesHistoryQuery.subscribeToMore(
      //   {
      //     document: ACTIVE_STRATEGIES,
      //     variables: {
      //       activeStrategiesInput: {
      //         marketType,
      //         activeExchangeKey: selectedKey.keyId,
      //         allKeys,
      //         ...(!specificPair ? {} : { specificPair: currencyPair }),
      //       },
      //     },
      //     updateQuery: updateStrategiesHistoryQuerryFunction,
      //   }
      // )
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
      getStrategiesHistoryQuery,
      theme,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    } = nextProps

    const strategiesHistoryProcessedData = combineStrategiesHistoryTable({
      data: getStrategiesHistoryQuery.getStrategiesHistory.strategies,
      theme,
      marketType,
      keys,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    })

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
        // expandableRows={true}
        // expandedRows={expandedRows}
        // onChange={this.setExpandedRows}
        rowsWithHover={false}
        style={{
          borderRadius: 0,
          backgroundColor: 'inherit',
        }}
        stylesForTable={{ backgroundColor: 'inherit' }}
        defaultSort={{
          sortColumn: 'date',
          sortDirection: 'desc',
        }}
        onTrClick={(row) => {
          this.setExpandedRows(row.id)
          copy(row.id.split('_')[0])
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
            backgroundColor: 'inherit',
            color: theme.palette.grey.light,
            boxShadow: 'none',
            textTransform: 'capitalize',
          },
          cell: {
            color: theme.palette.grey.onboard,
            fontSize: '1.3rem', // 1.2 if bold
            fontFamily: 'Avenir Next Demi',
            backgroundColor: 'inherit',
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
          totalCount: getStrategiesHistoryQuery.getStrategiesHistory.count,
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
                loading: getStrategiesHistoryQuery.queryParamsWereChanged,
              }}
            />
          ),
          paginationStyles: {
            width: 'calc(100%)',
            backgroundColor: 'inherit',
            border: theme.palette.border.main,
          },
        }}
        emptyTableText={getEmptyTextPlaceholder(tab)}
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
    <StrategiesHistoryTable
      getStrategiesHistoryQuery={{
        getStrategiesHistory: {
          strategies: [
            SMMock
          ],
          count: 0,
        },
      }}
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
      withOutSpinner={false}
      withTableLoader={false}
      query={getStrategiesHistory}
      showLoadingWhenQueryParamsChange={false}
      name={`getStrategiesHistoryQuery`}
      fetchPolicy="cache-and-network"
      // pollInterval={props.show ? 25000 : 0}
      // subscriptionArgs={{
      //   subscription: ACTIVE_STRATEGIES,
      //   variables: {
      //     activeStrategiesInput: {
      //       activeExchangeKey: props.selectedKey.keyId,
      //       marketType: props.marketType,
      //       allKeys,
      //       ...(!specificPair ? {} : { specificPair: props.currencyPair }),
      //     },
      //   },
      //   updateQueryFunction: updateStrategiesHistoryQuerryFunction,
      // }}
      {...props}
    />
  )
}

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

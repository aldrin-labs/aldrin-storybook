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
      handlePairChange,
    } = this.props

    const strategiesHistoryProcessedData = combineStrategiesHistoryTable(
      getStrategiesHistoryQuery.getStrategiesHistory.strategies,
      theme,
      marketType,
      keys,
      handlePairChange
    )

    this.setState({
      strategiesHistoryProcessedData,
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
      this.unsubscribeFunction = this.props.getStrategiesHistoryQuery.subscribeToMore(
        {
          document: ACTIVE_STRATEGIES,
          variables: {
            activeStrategiesInput: {
              marketType,
              activeExchangeKey: selectedKey.keyId,
              allKeys,
              ...(!specificPair ? {} : { specificPair: currencyPair }),
            },
          },
          updateQuery: updateStrategiesHistoryQuerryFunction,
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
    const strategiesHistoryProcessedData = combineStrategiesHistoryTable(
      nextProps.getStrategiesHistoryQuery.getStrategiesHistory.strategies,
      nextProps.theme,
      nextProps.marketType,
      nextProps.keys,
      nextProps.handlePairChange
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
        expandableRows={true}
        expandedRows={expandedRows}
        onChange={this.setExpandedRows}
        rowsWithHover={false}
        style={{
          height: 'calc(100% - 6rem)',
          borderRadius: 0,
          backgroundColor: theme.palette.white.background,
        }}
        stylesForTable={{ backgroundColor: theme.palette.white.background }}
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
            fontSize: '1rem',
            fontWeight: 'bold',
            backgroundColor: theme.palette.white.background,
            color: theme.palette.dark.main,
            boxShadow: 'none',
          },
          cell: {
            color: theme.palette.dark.main,
            backgroundColor: theme.palette.white.background,
            fontSize: '1rem', // 1.2 if bold
            fontWeight: 'bold',
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
      withOutSpinner={false}
      withTableLoader={false}
      query={getStrategiesHistory}
      showLoadingWhenQueryParamsChange={false}
      name={`getStrategiesHistoryQuery`}
      fetchPolicy="cache-and-network"
      // pollInterval={props.show ? 25000 : 0}
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

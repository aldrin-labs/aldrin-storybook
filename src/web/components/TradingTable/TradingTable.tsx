import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose, shallowEqual } from 'recompose'
import { withTheme } from '@material-ui/styles'
const isEqual = require('react-fast-compare')

import { difference, shallowDifference } from '@core/utils/difference'
import { queryRendererHoc } from '@core/components/QueryRenderer'
import withAuth from '@core/hoc/withAuth'

import { Key } from '@core/types/ChartTypes'
import {
  IProps,
  IPropsTradingTableWrapper,
  IState,
  IStateKeys,
} from './TradingTable.types'
import { StyleForCalendar } from '@sb/components/GitTransactionCalendar/Calendar.styles'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'

import ActiveTrades from './ActiveTrades/ActiveTrades'
import PositionsTable from './PositionsTable/PositionsTable'
import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import OrderHistoryTable from './OrderHistoryTable/OrderHistoryDataWrapper'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'
import StrategiesHistoryTable from './StrategiesHistoryTable/StrategiesHistoryDataWrapper'
import Funds from './FundsTable/FundsTable'

import { getAllUserKeys } from '@core/graphql/queries/user/getAllUserKeys'
import { withErrorFallback } from '@core/hoc/withErrorFallback'

class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'activeTrades',
    canceledOrders: [],
    showAllPositionPairs: false,
    showAllOpenOrderPairs: false,
    showAllSmartTradePairs: false,
    showPositionsFromAllAccounts: true,
    showOpenOrdersFromAllAccounts: true,
    showSmartTradesFromAllAccounts: true,
    pageOpenOrders: 0,
    perPageOpenOrders: 30,
    pagePositions: 0,
    perPagePositions: 30,
    pageSmartTrades: 0,
    perPageSmartTrades: 30,
    allKeys: true,
    specificPair: true,
  }

  componentDidMount() {
    if (
      this.props.terminalViewMode === 'default' &&
      (this.state.tab === 'activeTrades' ||
        this.state.tab === 'strategiesHistory')
    ) {
      if (this.props.marketType === 0) {
        this.setState({ tab: 'openOrders' })
      } else {
        this.setState({ tab: 'positions' })
      }
    }
  }

  componentDidUpdate(prevProps) {
    // console.log('TradingTable componentDidUpdate prevProps', prevProps)
    // console.log('TradingTable componentDidUpdate this.props', this.props)

    console.log('TradingTable diff: ', difference(prevProps, this.props))

    if (prevProps.marketType !== this.props.marketType) {
      // change from spot to futures when funds is open
      if (this.props.marketType === 1 && this.state.tab === 'funds') {
        if (this.props.terminalViewMode === 'onlyTables') {
          this.setState({ tab: 'activeTrades' })
        } else {
          this.setState({ tab: 'positions' })
        }
      }

      // change from futures to spot when positions is open
      if (this.props.marketType === 0 && this.state.tab === 'positions') {
        if (this.props.terminalViewMode === 'onlyTables') {
          this.setState({ tab: 'activeTrades' })
        } else {
          this.setState({ tab: 'openOrders' })
        }
      }
    }

    // change from onlyTables to basic when SM tables is open
    if (prevProps.terminalViewMode !== this.props.terminalViewMode) {
      if (
        this.props.terminalViewMode === 'default' &&
        (this.state.tab === 'activeTrades' ||
          this.state.tab === 'strategiesHistory')
      ) {
        if (this.props.marketType === 0) {
          this.setState({ tab: 'openOrders' })
        } else {
          this.setState({ tab: 'positions' })
        }
      }
    }
  }

  handleChangePage = (tab: IStateKeys, value: number) => {
    this.setState(({ [tab]: value } as unknown) as Pick<IState, keyof IState>)
  }

  handleChangeRowsPerPage = (
    tab: IStateKeys,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    this.setState(({ [tab]: +event.target.value } as unknown) as Pick<
      IState,
      keyof IState
    >)
  }

  handlePairChange = (value: string) => {
    const { history, marketType } = this.props

    const chartPageType = marketType === 0 ? 'spot' : 'futures'
    history.push(`/chart/${chartPageType}/${value}`)
  }

  handleTabChange = (tab: string | any) => {
    this.setState({
      tab,
    })
  }

  handleToggleAllKeys = () => {
    this.setState((prev) => ({ allKeys: !prev.allKeys }))
  }

  handleToggleSpecificPair = () => {
    const { currencyPair } = this.props

    this.setState((prev) => ({
      specificPair: !prev.specificPair ? currencyPair : false,
    }))
  }

  addOrderToCanceled = (orderId: string) => {
    this.setState((prev) => {
      return { canceledOrders: [...prev.canceledOrders].concat([orderId]) }
    })
  }

  clearCanceledOrders = () => {
    this.setState({ canceledOrders: [] })
  }

  render() {
    const {
      tab,
      canceledOrders,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
      pageOpenOrders,
      perPageOpenOrders,
      pagePositions,
      perPagePositions,
      pageSmartTrades,
      perPageSmartTrades,
      allKeys,
      specificPair,
    } = this.state

    const {
      theme,
      selectedKey,
      marketType,

      exchange,
      currencyPair,
      maxLeverage,
      arrayOfMarketIds,
      priceFromOrderbook,
      updateTerminalViewMode,
      isDefaultTerminalViewMode,
      isDefaultOnlyTables,
      minFuturesStep,
      isSmartOrderMode,
      terminalViewMode,
      getAllUserKeysQuery = {
        myPortfolios: [],
        refetch: () => {},
      },
      pricePrecision,
      quantityPrecision,
    } = this.props
    const { refetch, myPortfolios = [] } = getAllUserKeysQuery || {
      refetch: () => {},
      myPortfolios: [],
    }

    const keysObjects: Key[] = []

    myPortfolios.forEach((portfolio) => {
      keysObjects.push(...portfolio.keys)
    })

    const keys = keysObjects.reduce(
      (acc, key) => ({
        ...acc,
        [key.keyId]: key.name,
      }),
      {}
    )

    console.log('TradingTable RENDER',       pricePrecision,
    quantityPrecision,)

    return (
      <div
        id="tables"
        style={{
          height: '100%',
          backgroundColor: theme.palette.white.background,
          borderLeft: theme.palette.border.main,
          borderBottom: theme.palette.border.main,
        }}
      >
        <TradingTabs
          {...{
            updateTerminalViewMode,
            isDefaultTerminalViewMode,
            isDefaultOnlyTables,
            tab,
            theme,
            marketType,
            selectedKey,
            currencyPair,
            canceledOrders,
            handleTabChange: this.handleTabChange,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            pageOpenOrders,
            perPageOpenOrders,
            pageSmartTrades,
            perPageSmartTrades,
            
          }}
        />
        <ActiveTrades
          {...{
            tab,
            updateTerminalViewMode,
            isDefaultOnlyTables,
            keys,
            theme,
            selectedKey,
            marketType,
            maxLeverage,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            minFuturesStep,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'activeTrades',
            page: pageSmartTrades,
            perPage: perPageSmartTrades,
            pricePrecision,
            quantityPrecision,
            allKeys,
            specificPair,
            handleToggleSpecificPair: this.handleToggleSpecificPair,
            handleToggleAllKeys: this.handleToggleAllKeys,
            handleChangePage: (value: number) =>
              this.handleChangePage('pageSmartTrades', value),
            handleChangeRowsPerPage: (
              event: React.ChangeEvent<HTMLSelectElement>
            ) => this.handleChangeRowsPerPage('perPageSmartTrades', event),
            handleTabChange: this.handleTabChange,
            addOrderToCanceled: this.addOrderToCanceled,
            handlePairChange: this.handlePairChange,
          }}
        />
        <StrategiesHistoryTable
          {...{
            tab,
            keys,
            theme,
            allKeys,
            specificPair,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            pricePrecision,
            quantityPrecision,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            handleToggleSpecificPair: this.handleToggleSpecificPair,
            handleToggleAllKeys: this.handleToggleAllKeys,
            show: tab === 'strategiesHistory',
            handleTabChange: this.handleTabChange,
            handlePairChange: this.handlePairChange,
          }}
        />
        <PositionsTable
          {...{
            tab,
            keys,
            theme,
            keysObjects,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            minFuturesStep,
            pricePrecision,
            quantityPrecision,
            allKeys,
            specificPair,
            priceFromOrderbook,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            page: pagePositions,
            perPage: perPagePositions,
            show: tab === 'positions',
            handleToggleSpecificPair: this.handleToggleSpecificPair,
            handleToggleAllKeys: this.handleToggleSpecificPair,
            handleChangePage: (value: number) =>
              this.handleChangePage('pagePositions', value),
            handleChangeRowsPerPage: (
              event: React.ChangeEvent<HTMLSelectElement>
            ) => this.handleChangeRowsPerPage('perPagePositions', event),
            handleTabChange: this.handleTabChange,
            clearCanceledOrders: this.clearCanceledOrders,
            addOrderToCanceled: this.addOrderToCanceled,
            handlePairChange: this.handlePairChange,
            refetchKeys: refetch,
          }}
        />
        <OpenOrdersTable
          {...{
            tab,
            keys,
            theme,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            pricePrecision,
            quantityPrecision,
            allKeys,
            specificPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            page: pageOpenOrders,
            perPage: perPageOpenOrders,
            show: tab === 'openOrders',
            handleToggleSpecificPair: this.handleToggleSpecificPair,
            handleToggleAllKeys: this.handleToggleSpecificPair,
            handleChangePage: (value: number) =>
              this.handleChangePage('pageOpenOrders', value),
            handleChangeRowsPerPage: (
              event: React.ChangeEvent<HTMLSelectElement>
            ) => this.handleChangeRowsPerPage('perPageOpenOrders', event),
            handleTabChange: this.handleTabChange,
            clearCanceledOrders: this.clearCanceledOrders,
            addOrderToCanceled: this.addOrderToCanceled,
            handlePairChange: this.handlePairChange,
          }}
        />
        <OrderHistoryTable
          {...{
            tab,
            keys,
            theme,
            allKeys,
            specificPair,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            pricePrecision,
            quantityPrecision,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'orderHistory',
            handleToggleSpecificPair: this.handleToggleSpecificPair,
            handleToggleAllKeys: this.handleToggleSpecificPair,
            handleTabChange: this.handleTabChange,
            handlePairChange: this.handlePairChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            keys,
            allKeys,
            specificPair,
            theme,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            pricePrecision,
            quantityPrecision,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'tradeHistory',
            handleTabChange: this.handleTabChange,
            handlePairChange: this.handlePairChange,
            handleToggleSpecificPair: this.handleToggleSpecificPair,
            handleToggleAllKeys: this.handleToggleSpecificPair,
          }}
        />
        <Funds
          {...{
            tab,
            theme,
            selectedKey,
            marketType,
            canceledOrders,
            arrayOfMarketIds,
            currencyPair,
            pricePrecision,
            quantityPrecision,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'funds',
            handleTabChange: this.handleTabChange,
          }}
        />
        <StyleForCalendar theme={theme} />
      </div>
    )
  }
}

const MemoizedTradingTable = React.memo(TradingTable, (prev, next) => {
  console.log('TradingTable INSIDE memo diff: ', difference(prev, next))
  console.log('TradingTable INSIDE memo diff: ', shallowDifference(prev, next))
  console.log(
    'TradingTable INSIDE memo shallowEqual diff',
    shallowEqual(prev, next)
  )
  console.log(
    'TradingTable INSIDE memo react-fast-compare',
    isEqual(prev, next)
  )

  return isEqual(prev, next)
})

const TradingTableWrapper = compose(
  withAuth,
  withRouter,
  withErrorFallback,
  withTheme(),
  queryRendererHoc({
    query: getAllUserKeys,
    name: 'getAllUserKeysQuery',
    withOutSpinner: true,
    withTableLoader: false,
    withoutLoading: true,
    fetchPolicy: 'cache-first',
  })
)(MemoizedTradingTable)

export default React.memo(
  TradingTableWrapper,
  (prev: IPropsTradingTableWrapper, next: IPropsTradingTableWrapper) => {
    console.log('TradingTable MEMO diff: ', difference(prev, next))
    console.log(
      'TradingTable MEMO shallowDifference: ',
      shallowDifference(prev, next)
    )
    console.log('TradingTable shallowEqual MEMO diff', shallowEqual(prev, next))

    return isEqual(prev, next)
  }
)

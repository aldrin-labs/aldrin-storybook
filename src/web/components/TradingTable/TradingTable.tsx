import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { isEqual } from 'lodash'
import { withTheme } from '@material-ui/styles'

import { Key } from '@core/types/ChartTypes'
import { IProps, IState, IStateKeys } from './TradingTable.types'
import { StyleForCalendar } from '@sb/components/GitTransactionCalendar/Calendar.styles'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'

import OpenOrdersTable from './OpenOrdersTable/OpenOrdersTable'
import Balances from './Balances/Balances'
import FeeTiers from './Fee/FeeTiers'
import TradeHistoryTable from './TradeHistoryTable/TradeHistoryDataWrapper'
import { withErrorFallback } from '@core/hoc/withErrorFallback'
import StrategiesHistoryTable from './StrategiesHistoryTable/StrategiesHistoryTable'
import ActiveTrades from './ActiveTrades/ActiveTrades'
import { SMMock } from './TradingTable.utils'

class TradingTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    tabIndex: 0,
    tab: 'openOrders',
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
    specificPair: false,
  }

  componentDidMount() {
    if (
      this.props.terminalViewMode === 'default' &&
      (this.state.tab === 'activeTrades' ||
        this.state.tab === 'strategiesHistory')
    ) {
      this.setState({ tab: 'openOrders' })
    }
  }

  componentDidUpdate(prevProps) {
    // change from onlyTables to basic when SM tables is open
    if (prevProps.terminalViewMode !== this.props.terminalViewMode) {
      if (
        this.props.terminalViewMode === 'default' &&
        (this.state.tab === 'activeTrades' ||
          this.state.tab === 'strategiesHistory')
      ) {
        this.setState({ tab: 'openOrders' })
      }

      if (this.props.terminalViewMode === 'onlyTables') {
        this.setState({
          tab: 'activeTrades',
        })
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
      arrayOfMarketIds,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      isFullScreenTablesMode,
      isDefaultOnlyTablesMode,
      isSmartOrderMode,
      updateTerminalViewMode,
      terminalViewMode,
      isDefaultTerminalViewMode,
      getAllUserKeysQuery = {
        myPortfolios: [],
      },
    } = this.props
    const { myPortfolios = [] } = getAllUserKeysQuery || { myPortfolios: [] }

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

    return (
      <div
        id="tables"
        style={{
          height: '100%',
          backgroundColor: theme.palette.dark.background,
          borderLeft: theme.palette.border.main,
          borderBottom: theme.palette.border.main,
        }}
      >
        <TradingTabs
          {...{
            tab,
            theme,
            marketType,
            selectedKey,
            currencyPair,
            canceledOrders,
            terminalViewMode,
            isFullScreenTablesMode,
            isDefaultTerminalViewMode,
            isDefaultOnlyTablesMode,
            isSmartOrderMode,
            updateTerminalViewMode,
            handleTabChange: this.handleTabChange,
            arrayOfMarketIds,
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
          }}
        />
        <ActiveTrades
          {...{
            tab,
            updateTerminalViewMode,
            isDefaultOnlyTables: isDefaultOnlyTablesMode,
            isFullScreenTablesMode,
            keys,
            theme,
            selectedKey,
            marketType,
            maxLeverage: 1,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            minFuturesStep: 1,
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
            getActiveStrategiesQuery: {
              subscribeToMoreFunction: () => {},
              getActiveStrategies: {
                strategies: [SMMock],
                count: 0,
              },
            },
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
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            page: pageOpenOrders,
            perPage: perPageOpenOrders,
            show: tab === 'openOrders',
            handleToggleAllKeys: () =>
              this.setState((prev) => ({
                showOpenOrdersFromAllAccounts: !prev.showOpenOrdersFromAllAccounts,
              })),
            handleToggleSpecificPair: () =>
              this.setState((prev) => ({
                showAllOpenOrderPairs: !prev.showAllOpenOrderPairs,
              })),
            handleChangePage: (value: number) =>
              this.handleChangePage('pageOpenOrders', value),
            handleChangeRowsPerPage: (
              event: React.ChangeEvent<HTMLSelectElement>
            ) => this.handleChangeRowsPerPage('perPageOpenOrders', event),
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
            clearCanceledOrders: this.clearCanceledOrders,
            addOrderToCanceled: this.addOrderToCanceled,
            handlePairChange: this.handlePairChange,
          }}
        />
        <TradeHistoryTable
          {...{
            tab,
            keys,
            theme,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'tradeHistory',
            handleTabChange: this.handleTabChange,
            handlePairChange: this.handlePairChange,
          }}
        />

        <Balances
          {...{
            tab,
            keys,
            theme,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'balances',
            handleTabChange: this.handleTabChange,
            handlePairChange: this.handlePairChange,
          }}
        />
        <FeeTiers
          {...{
            tab,
            keys,
            theme,
            selectedKey,
            marketType,
            arrayOfMarketIds,
            canceledOrders,
            currencyPair,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'feeTiers',
            handleTabChange: this.handleTabChange,
            handlePairChange: this.handlePairChange,
          }}
        />
        <StyleForCalendar theme={theme} />
      </div>
    )
  }
}

export default compose(withRouter, withErrorFallback, withTheme())(TradingTable)

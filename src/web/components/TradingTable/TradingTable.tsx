import React from 'react'
import { withRouter } from 'react-router-dom'
import { compose } from 'recompose'
import { isEqual } from 'lodash'
import { withTheme } from '@material-ui/styles'

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
    } = this.state

    // console.log('TradingTable render')

    const {
      theme,
      selectedKey,
      marketType,
      exchange,
      currencyPair,
      arrayOfMarketIds,
      priceFromOrderbook,
      updateTerminalViewMode,
      isDefaultTerminalViewMode,
      isDefaultOnlyTables,
      isSmartOrderMode,
      terminalViewMode,
      pricePrecision,
      quantityPrecision,
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
          backgroundColor: theme.palette.white.background,
          borderLeft: theme.palette.border.main,
          borderBottom: theme.palette.border.main,
        }}
      >
        <TradingTabs
          {...{
            updateTerminalViewMode,
            terminalViewMode,
            isDefaultTerminalViewMode,
            isDefaultOnlyTables,
            isSmartOrderMode,
            tab,
            theme,
            marketType,
            selectedKey,
            currencyPair,
            canceledOrders,
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
            isDefaultOnlyTables,
            keys,
            theme,
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
            show: tab === 'activeTrades',
            page: pageSmartTrades,
            perPage: perPageSmartTrades,
            allKeys: showSmartTradesFromAllAccounts,
            specificPair: showAllSmartTradePairs,
            handleToggleAllKeys: () =>
              this.setState((prev) => ({
                showSmartTradesFromAllAccounts: !prev.showSmartTradesFromAllAccounts,
              })),
            handleToggleSpecificPair: () =>
              this.setState((prev) => ({
                showAllSmartTradePairs: !prev.showAllSmartTradePairs,
              })),
            handleChangePage: (value: number) =>
              this.handleChangePage('pageSmartTrades', value),
            handleChangeRowsPerPage: (
              event: React.ChangeEvent<HTMLSelectElement>
            ) => this.handleChangeRowsPerPage('perPageSmartTrades', event),
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
            addOrderToCanceled: this.addOrderToCanceled,
            handlePairChange: this.handlePairChange,
          }}
        />
        <StrategiesHistoryTable
          {...{
            tab,
            keys,
            theme,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            showAllPositionPairs,
            showAllOpenOrderPairs,
            showAllSmartTradePairs,
            showPositionsFromAllAccounts,
            showOpenOrdersFromAllAccounts,
            showSmartTradesFromAllAccounts,
            show: tab === 'strategiesHistory',
            handleTabChange: this.handleTabChange,
            showCancelResult: this.props.showCancelResult,
            handlePairChange: this.handlePairChange,
          }}
        />
        <PositionsTable
          {...{
            tab,
            keys,
            theme,
            selectedKey,
            marketType,
            exchange,
            currencyPair,
            canceledOrders,
            arrayOfMarketIds,
            pricePrecision,
            quantityPrecision,
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
            handleToggleAllKeys: () =>
              this.setState((prev) => ({
                showPositionsFromAllAccounts: !prev.showPositionsFromAllAccounts,
              })),
            handleToggleSpecificPair: () =>
              this.setState((prev) => ({
                showAllPositionPairs: !prev.showAllPositionPairs,
              })),
            handleChangePage: (value: number) =>
              this.handleChangePage('pagePositions', value),
            handleChangeRowsPerPage: (
              event: React.ChangeEvent<HTMLSelectElement>
            ) => this.handleChangeRowsPerPage('perPagePositions', event),
            handleTabChange: this.handleTabChange,
            showOrderResult: this.props.showOrderResult,
            showCancelResult: this.props.showCancelResult,
            clearCanceledOrders: this.clearCanceledOrders,
            addOrderToCanceled: this.addOrderToCanceled,
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
        <OrderHistoryTable
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
            show: tab === 'orderHistory',
            handleTabChange: this.handleTabChange,
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
        <Funds
          {...{
            tab,
            theme,
            selectedKey,
            marketType,
            canceledOrders,
            arrayOfMarketIds,
            currencyPair,
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
    fetchPolicy: 'cache-only',
  })
)(TradingTable)

export default React.memo(
  TradingTableWrapper,
  (
    prevProps: IPropsTradingTableWrapper,
    nextProps: IPropsTradingTableWrapper
  ) => {
    // console.log('prevProps: ', prevProps)
    // console.log('nextProps: ', nextProps)

    if (
      prevProps.maxLeverage === nextProps.maxLeverage &&
      isEqual(prevProps.selectedKey, nextProps.selectedKey) &&
      prevProps.marketType === nextProps.marketType &&
      prevProps.exchange === nextProps.exchange &&
      prevProps.pricePrecision === nextProps.pricePrecision &&
      prevProps.quantityPrecision === nextProps.quantityPrecision &&
      prevProps.priceFromOrderbook === nextProps.priceFromOrderbook &&
      prevProps.currencyPair === nextProps.currencyPair &&
      prevProps.arrayOfMarketIds.length === nextProps.arrayOfMarketIds.length &&
      prevProps.theme.palette.type === nextProps.theme.palette.type &&
      prevProps.isDefaultOnlyTables === nextProps.isDefaultOnlyTables &&
      prevProps.isDefaultTerminalViewMode ===
        nextProps.isDefaultTerminalViewMode &&
      prevProps.terminalViewMode === nextProps.terminalViewMode &&
      prevProps.isSmartOrderMode === nextProps.isSmartOrderMode
    ) {
      return true
    }

    return false
  }
)

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
  }

  // componentDidMount() {
  //   console.log('TradingTable componentDidMount')
  // }

  componentDidUpdate(prevProps) {
    // console.log('TradingTable componentDidUpdate prevProps', prevProps)
    // console.log('TradingTable componentDidUpdate this.props', this.props)

    if (prevProps.marketType !== this.props.marketType) {
      if (
        (this.props.marketType === 0 && this.state.tab === 'positions') ||
        (this.props.marketType === 1 && this.state.tab === 'funds')
      ) {
        this.setState({ tab: 'activeTrades' })
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
      pricePrecision,
      quantityPrecision,
      getAllUserKeysQuery = {
        myPortfolios: [],
      },
      updateTerminalViewMode,
      terminalViewMode,
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
            updateTerminalViewMode,
            terminalViewMode,
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

const TradingTableWrapper = compose(
  withRouter,
  withErrorFallback,
  withTheme()
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
      prevProps.terminalViewMode === nextProps.terminalViewMode
    ) {
      return true
    }

    return false
  }
)

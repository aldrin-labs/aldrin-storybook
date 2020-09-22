import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { client } from '@core/graphql/apolloClient'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { withSnackbar } from 'notistack'

import { withTheme } from '@material-ui/styles'

import {
  getTakeProfitFromStrategy,
  getStopLossFromStrategy,
  transformTakeProfitProperties,
  transformStopLossProperties,
  transformEntryOrderProperties,
  validateStopLoss,
  validateTakeProfit,
  validateEntryOrder,
  getTakeProfitArgsForUpdate,
  getStopLossArgsForUpdate,
  getEntryOrderArgsForUpdate,
  getEntryOrderFromStrategy,
} from '@core/utils/chartPageUtils'

import {
  EditTakeProfitPopup,
  EditStopLossPopup,
  EditEntryOrderPopup,
} from '@sb/compositions/Chart/components/SmartOrderTerminal/EditOrderPopups'

import { TableWithSort } from '@sb/components'
import { PaginationBlock } from '../TradingTablePagination'

import {
  updateActiveStrategiesQuerryFunction,
  combineActiveTradesTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { IProps, IState, SmartOrder, Price } from './ActiveTrades.types'

import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'
import { updateEntryPointStrategy } from '@core/graphql/mutations/chart/updateEntryPointStrategy'
import { updateStopLossStrategy } from '@core/graphql/mutations/chart/updateStopLossStrategy'
import { updateTakeProfitStrategy } from '@core/graphql/mutations/chart/updateTakeProfitStrategy'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'
import { disableStrategy } from '@core/graphql/mutations/strategies/disableStrategy'
import { changeTemplateStatus } from '@core/graphql/mutations/chart/changeTemplateStatus'

import { FUNDS } from '@core/graphql/subscriptions/FUNDS'

import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'

import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { LISTEN_TABLE_PRICE } from '@core/graphql/subscriptions/LISTEN_TABLE_PRICE'
import { LISTEN_MARK_PRICES } from '@core/graphql/subscriptions/LISTEN_MARK_PRICES'

@withTheme()
class ActiveTradesTable extends React.Component<IProps, IState> {
  state: IState = {
    editTrade: null,
    selectedTrade: {},
    cachedOrder: null,
    expandedRows: [],
    activeStrategiesProcessedData: [],
    prices: [],
  }

  unsubscribeFunctionGetActiveStrategies: null | Function = null
  unsubscribeFunctionGetFunds: null | Function = null

  subscription: null | { unsubscribe: () => void } = null

  interval: undefined | number = undefined

  componentDidMount() {
    const {
      keys,
      getActiveStrategiesQuery,
      getFundsQuery,
      theme,
      marketType,
      currencyPair,
      pricePrecision,
      quantityPrecision,
      addOrderToCanceled,
      canceledOrders,
      handlePairChange,
    } = this.props

    const activeStrategiesProcessedData = combineActiveTradesTable({
      data: getActiveStrategiesQuery.getActiveStrategies.strategies,
      queryVariables: getActiveStrategiesQuery.variables,
      queryBody: getActiveStrategiesQuery.query,
      cancelOrderFunc: this.cancelOrderWithStatus,
      changeStatusWithStatus: this.changeStatusWithStatus,
      editTrade: this.editTrade,
      addOrderToCanceled,
      canceledOrders,
      theme,
      keys,
      prices: this.state.prices,
      marketType,
      currencyPair,
      pricePrecision,
      quantityPrecision,
      handlePairChange,
    })

    this.setState({
      activeStrategiesProcessedData,
    })

    this.subscribe()
    this.unsubscribeFunctionGetActiveStrategies = getActiveStrategiesQuery.subscribeToMoreFunction()
    this.unsubscribeFunctionGetFunds = getFundsQuery.subscribeToMoreFunction()
  }

  componentDidUpdate(prevProps: IProps) {
    const newOrders = this.props.getActiveStrategiesQuery.getActiveStrategies.strategies.filter(
      (order) => order.enabled && order._id !== '-1'
    )

    const prevOrders = prevProps.getActiveStrategiesQuery.getActiveStrategies.strategies.filter(
      (order) => order.enabled && order._id !== '-1'
    )

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType ||
      newOrders.length > prevOrders.length
    ) {
      this.subscription && this.subscription.unsubscribe()
      this.subscribe()
    }

    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys ||
      prevProps.marketType !== this.props.marketType
    ) {
      this.unsubscribeFunctionGetActiveStrategies &&
        this.unsubscribeFunctionGetActiveStrategies()
      this.unsubscribeFunctionGetFunds && this.unsubscribeFunctionGetFunds()

      this.unsubscribeFunctionGetFunds = this.props.getFundsQuery.subscribeToMoreFunction()
      this.unsubscribeFunctionGetActiveStrategies = this.props.getActiveStrategiesQuery.subscribeToMoreFunction()
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunctionGetActiveStrategies !== null) {
      this.unsubscribeFunctionGetActiveStrategies()
    }

    if (this.unsubscribeFunctionGetFunds !== null) {
      this.unsubscribeFunctionGetFunds()
    }

    this.subscription && this.subscription.unsubscribe()
    clearInterval(this.interval)
  }

  componentWillReceiveProps(nextProps: IProps) {
    const {
      keys,
      theme,
      marketType,
      currencyPair,
      quantityPrecision,
      pricePrecision,
      getActiveStrategiesQuery,
      addOrderToCanceled,
      canceledOrders,
      handlePairChange,
    } = nextProps

    const { prices } = this.state

    const activeStrategiesProcessedData = combineActiveTradesTable({
      data: getActiveStrategiesQuery.getActiveStrategies.strategies,
      queryVariables: getActiveStrategiesQuery.variables,
      queryBody: getActiveStrategiesQuery.query,
      cancelOrderFunc: this.cancelOrderWithStatus,
      changeStatusWithStatus: this.changeStatusWithStatus,
      editTrade: this.editTrade,
      addOrderToCanceled,
      canceledOrders,
      theme,
      prices,
      keys,
      marketType,
      currencyPair,
      pricePrecision,
      quantityPrecision,
      handlePairChange,
    })

    this.setState({
      activeStrategiesProcessedData,
    })

    return null
  }

  subscribe() {
    const that = this
    const pairs = this.props.getActiveStrategiesQuery.getActiveStrategies.strategies
      .map((strategy) => {
        if (strategy.enabled) {
          return `${strategy.conditions.pair}:${this.props.marketType}`
        }
        return
      })
      .filter((pair, i, arr) => arr.indexOf(pair) === i && !!pair)
    const pairsWithoutMarketType = this.props.getActiveStrategiesQuery.getActiveStrategies.strategies
      .map((strategy) => {
        if (strategy.enabled) {
          return `${strategy.conditions.pair}`
        }
        return
      })
      .filter((pair, i, arr) => arr.indexOf(pair) === i && !!pair)
    this.subscription = client
      .subscribe({
        query:
          this.props.marketType === 1 ? LISTEN_MARK_PRICES : LISTEN_TABLE_PRICE,
        variables: {
          input: {
            exchange: this.props.exchange,
            pairs: this.props.marketType === 1 ? pairsWithoutMarketType : pairs,
          },
        },
        fetchPolicy: 'cache-only',
      })
      .subscribe({
        next: (data: {
          loading: boolean
          data: { listenTablePrice: Price[]; listenMarkPrices: Price[] }
        }) => {
          const orders = that.props.getActiveStrategiesQuery.getActiveStrategies.strategies
            .filter(
              (strategy: SmartOrder) =>
                (strategy.enabled ||
                  (strategy.conditions.isTemplate &&
                    strategy.conditions.templateStatus !== 'disabled')) &&
                strategy._id !== '-1'
            )
            .concat(that.state.cachedOrder)
          if (
            !data ||
            data.loading ||
            !that.props.show ||
            // we always have cachedOrder at least
            orders.length === 1
          ) {
            return
          }
          const {
            theme,
            marketType,
            currencyPair,
            keys,
            quantityPrecision,
            pricePrecision,
            addOrderToCanceled,
            canceledOrders,
            handlePairChange,
            getActiveStrategiesQuery,
          } = that.props

          const subscriptionPropertyKey =
            marketType === 1 ? `listenMarkPrices` : `listenTablePrice`

          const activeStrategiesProcessedData = combineActiveTradesTable({
            data: orders,
            queryVariables: getActiveStrategiesQuery.variables,
            queryBody: getActiveStrategiesQuery.query,
            cancelOrderFunc: this.cancelOrderWithStatus,
            changeStatusWithStatus: this.changeStatusWithStatus,
            addOrderToCanceled,
            canceledOrders,
            editTrade: this.editTrade,
            theme,
            keys,
            prices: data.data[subscriptionPropertyKey],
            marketType,
            currencyPair,
            pricePrecision,
            quantityPrecision,
            handlePairChange,
          })
          that.setState({
            activeStrategiesProcessedData,
            prices: data.data[subscriptionPropertyKey],
          })
        },
      })
  }

  onCancelOrder = async (
    keyId: string,
    strategyId: string
  ): Promise<
    | { data: { disableStrategy: { enabled: boolean } } }
    | { errors: string; data: null }
  > => {
    const { disableStrategyMutation } = this.props

    try {
      const responseResult = await disableStrategyMutation({
        variables: {
          input: {
            keyId,
            strategyId,
          },
        },
      })

      return responseResult
    } catch (err) {
      return { errors: err, data: null }
    }
  }

  onChangeStatus = async (
    keyId: string,
    strategyId: string,
    status: string
  ): Promise<
    | {
        data: {
          changeTemplateStatus: { conditions: { templateStatus: string } }
        }
      }
    | { errors: string; data: null }
  > => {
    const { changeTemplateStatusMutation } = this.props

    try {
      const responseResult = await changeTemplateStatusMutation({
        variables: {
          input: {
            keyId,
            strategyId,
            status,
          },
        },
      })

      return responseResult
    } catch (err) {
      return { errors: err, data: null }
    }
  }

  editTrade = (block: string, selectedTrade: any) => {
    this.setState({ editTrade: block, selectedTrade })
  }

  cancelOrderWithStatus = async (
    strategyId: string,
    keyId: string
  ): Promise<{
    status: 'success' | 'error'
    message: 'Smart order disabled' | 'Smart order disabling failed'
  }> => {
    const { showCancelResult } = this.props

    const result = await this.onCancelOrder(keyId, strategyId)

    // TODO: move to utils
    const statusResult: {
      status: 'success' | 'error'
      message: 'Smart order disabled' | 'Smart order disabling failed'
    } =
      result &&
      result.data &&
      result.data.disableStrategy &&
      result.data.disableStrategy.enabled === false
        ? {
            status: 'success',
            message: 'Smart order disabled',
          }
        : {
            status: 'error',
            message: 'Smart order disabling failed',
          }

    showCancelResult(statusResult)

    return statusResult
  }

  changeStatusWithStatus = async (
    strategyId: string,
    keyId: string,
    status: string
  ): Promise<{
    status: 'success' | 'error'
    message:
      | 'Smart order template status changed'
      | 'Smart order template status change failed'
  }> => {
    const { showCancelResult } = this.props

    const result = await this.onChangeStatus(keyId, strategyId, status)

    // TODO: move to utils
    const statusResult: {
      status: 'success' | 'error'
      message:
        | 'Smart order template status changed'
        | 'Smart order template status change failed'
    } =
      result &&
      result.data &&
      result.data.changeTemplateStatus &&
      result.data.changeTemplateStatus.conditions.templateStatus
        ? {
            status: 'success',
            message: 'Smart order template status changed',
          }
        : {
            status: 'error',
            message: 'Smart order template status change failed',
          }

    showCancelResult(statusResult)

    return statusResult
  }

  setExpandedRows = (id: string) => {
    this.setState(
      (prevState) => ({
        expandedRows: onCheckBoxClick(prevState.expandedRows, id),
      }),
      () => this.forceUpdate()
    )
  }

  getEntryPrice = () => {
    const { selectedTrade } = this.state
    const { currencyPair, marketType } = this.props

    const currentPrice = (
      this.state.prices.find(
        (priceObj) => priceObj.pair === `${currencyPair}:${marketType}:binance`
      ) || { price: 0 }
    ).price

    let price =
      selectedTrade.conditions.entryOrder.orderType === 'market' &&
      !!selectedTrade.conditions.entryOrder.activatePrice &&
      selectedTrade.conditions.entryOrder.activatePrice !== 0
        ? currentPrice
        : selectedTrade.conditions.entryOrder.price

    if (selectedTrade.conditions.entryOrder.activatePrice >= 0) {
      price =
        selectedTrade.conditions.entryOrder.side === 'buy'
          ? price *
            (1 +
              selectedTrade.conditions.entryOrder.entryDeviation /
                100 /
                selectedTrade.conditions.leverage)
          : price *
            (1 -
              selectedTrade.conditions.entryOrder.entryDeviation /
                100 /
                selectedTrade.conditions.leverage)
    }

    // console.log('price', price)

    if (selectedTrade.state && !!selectedTrade.state.entryPrice) {
      price = selectedTrade.state.entryPrice
    }

    return price
  }

  render() {
    const {
      activeStrategiesProcessedData,
      editTrade,
      selectedTrade,
      expandedRows,
      cachedOrder,
    } = this.state

    const {
      tab,
      theme,
      currencyPair,
      show,
      page,
      perPage,
      marketType,
      allKeys,
      specificPair,
      pricePrecision,
      quantityPrecision,
      updateEntryPointStrategyMutation,
      updateStopLossStrategyMutation,
      updateTakeProfitStrategyMutation,
      showCancelResult,
      getFundsQuery = {
        getFunds: [],
      },
      handleToggleAllKeys,
      handleToggleSpecificPair,
      getActiveStrategiesQuery,
      handleChangePage,
      handleChangeRowsPerPage,
    } = this.props

    if (!show) {
      return null
    }

    const pair = currencyPair.split('_')

    const funds = pair.map((coin, index) => {
      const asset = getFundsQuery.getFunds.find(
        (el) => el.asset.symbol === pair[index]
      )
      const quantity = asset !== undefined ? asset.free : 0
      const value = asset !== undefined ? asset.free * asset.asset.priceUSD : 0

      return { quantity, value }
    })

    const [
      USDTFuturesFund = { quantity: 0, value: 0 },
    ] = getFundsQuery.getFunds
      .filter((el) => +el.assetType === 1 && el.asset.symbol === 'USDT')
      .map((el) => ({ quantity: el.quantity, value: el.quantity }))

    const processedFunds =
      marketType === 0 ? funds : [funds[0], USDTFuturesFund]

    return (
      <>
        {editTrade === 'entryOrder' &&
          selectedTrade &&
          selectedTrade.conditions && (
            <EditEntryOrderPopup
              theme={theme}
              price={this.getEntryPrice()}
              funds={processedFunds}
              quantityPrecision={quantityPrecision}
              pricePrecision={pricePrecision}
              open={editTrade === 'entryOrder'}
              pair={selectedTrade.conditions.pair.split('_')}
              side={selectedTrade.conditions.entryOrder.side}
              leverage={selectedTrade.conditions.leverage}
              marketType={selectedTrade.conditions.marketType}
              handleClose={() => this.setState({ editTrade: null })}
              updateState={async (entryOrderProperties) => {
                this.setState({ editTrade: null })

                const entryOrder = getEntryOrderArgsForUpdate(
                  entryOrderProperties
                )

                // TODO: move to separate function
                let result
                try {
                  result = await updateEntryPointStrategyMutation({
                    variables: {
                      input: {
                        keyId: this.props.selectedKey.keyId,
                        strategyId: selectedTrade._id,
                        params: entryOrder,
                      },
                    },
                  })
                } catch (e) {
                  result = {
                    status: 'error',
                    message: `${e}`,
                  }
                }

                // TODO: move to utils
                const statusResult =
                  result && result.data && result.data.updateEntryPoint
                    ? {
                        status: 'success',
                        message: 'Smart order edit successful',
                      }
                    : {
                        status: 'error',
                        message: 'Smart order edit failed',
                      }

                showCancelResult(statusResult)
              }}
              derivedState={getEntryOrderFromStrategy(selectedTrade)}
              validate={(obj, isValid) =>
                validateEntryOrder(obj, isValid, this.props.enqueueSnackbar)
              }
              transformProperties={transformEntryOrderProperties}
              validateField={(v) => !!v}
            />
          )}
        {editTrade === 'takeProfit' &&
          selectedTrade &&
          selectedTrade.conditions && (
            <EditTakeProfitPopup
              theme={theme}
              open={editTrade === 'takeProfit'}
              price={this.getEntryPrice()}
              pricePrecision={pricePrecision}
              pair={selectedTrade.conditions.pair.split('_')}
              side={selectedTrade.conditions.entryOrder.side}
              leverage={selectedTrade.conditions.leverage}
              handleClose={() => this.setState({ editTrade: null })}
              updateState={async (takeProfitProperties) => {
                this.setState({ editTrade: null })

                const takeProfit = getTakeProfitArgsForUpdate(
                  takeProfitProperties
                )

                // TODO: move to separate function
                let result
                try {
                  result = await updateTakeProfitStrategyMutation({
                    variables: {
                      input: {
                        keyId: this.props.selectedKey.keyId,
                        strategyId: selectedTrade._id,
                        params: takeProfit,
                      },
                    },
                  })
                } catch (e) {
                  result = {
                    status: 'error',
                    message: `${e}`,
                  }
                }

                // TODO: move to utils
                const statusResult =
                  result && result.data && result.data.updateTakeProfitStrategy
                    ? {
                        status: 'success',
                        message: 'Smart order edit successful',
                      }
                    : {
                        status: 'error',
                        message: 'Smart order edit failed',
                      }

                showCancelResult(statusResult)
              }}
              derivedState={getTakeProfitFromStrategy(selectedTrade)}
              validate={(obj, isValid) =>
                validateTakeProfit(obj, isValid, this.props.enqueueSnackbar)
              }
              transformProperties={transformTakeProfitProperties}
              validateField={(v) => !!v}
            />
          )}

        {editTrade === 'stopLoss' && selectedTrade && selectedTrade.conditions && (
          <EditStopLossPopup
            theme={theme}
            open={editTrade === 'stopLoss'}
            price={this.getEntryPrice()}
            pricePrecision={pricePrecision}
            pair={selectedTrade.conditions.pair.split('_')}
            side={selectedTrade.conditions.entryOrder.side}
            leverage={selectedTrade.conditions.leverage}
            handleClose={() => this.setState({ editTrade: null })}
            updateState={async (stopLossProperties) => {
              this.setState({ editTrade: null })

              const stopLoss = getStopLossArgsForUpdate(stopLossProperties)

              let result
              try {
                result = await updateStopLossStrategyMutation({
                  variables: {
                    input: {
                      keyId: this.props.selectedKey.keyId,
                      strategyId: selectedTrade._id,
                      params: stopLoss,
                    },
                  },
                })
              } catch (e) {
                result = {
                  status: 'error',
                  message: `${e}`,
                }
              }

              // TODO: move to utils
              const statusResult =
                result && result.data && result.data.updateStopLossStrategy
                  ? {
                      status: 'success',
                      message: 'Smart order edit successful',
                    }
                  : {
                      status: 'error',
                      message: 'Smart order edit failed',
                    }

              showCancelResult(statusResult)
            }}
            transformProperties={transformStopLossProperties}
            validate={(obj, isValid) =>
              validateStopLoss(obj, isValid, this.props.enqueueSnackbar)
            }
            derivedState={getStopLossFromStrategy(selectedTrade)}
            validateField={(v) => !!v}
          />
        )}
        <TableWithSort
          hideCommonCheckbox
          expandableRows={true}
          expandedRows={expandedRows}
          onChange={this.setExpandedRows}
          rowsWithHover={false}
          style={{
            borderRadius: 0,
            height: 'calc(100% - 5.5rem)',
            overflowX: 'scroll',
            backgroundColor: theme.palette.white.background,
          }}
          stylesForTable={{ backgroundColor: theme.palette.white.background }}
          defaultSort={{
            sortColumn: 'date',
            sortDirection: 'desc',
          }}
          withCheckboxes={false}
          pagination={{
            fakePagination: false,
            enabled: true,
            totalCount: getActiveStrategiesQuery.getActiveStrategies.count,
            page: page,
            rowsPerPage: perPage,
            rowsPerPageOptions: [10, 20, 30, 50, 100],
            handleChangePage,
            handleChangeRowsPerPage,
            additionalBlock: (
              <PaginationBlock
                {...{
                  theme,
                  allKeys,
                  specificPair,
                  handleToggleAllKeys: !!cachedOrder
                    ? () => {}
                    : handleToggleAllKeys,
                  handleToggleSpecificPair: !!cachedOrder
                    ? () => {}
                    : handleToggleSpecificPair,
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
              paddingTop: '.5rem',
              paddingBottom: '.5rem',
            },
            tab: {
              padding: 0,
              boxShadow: 'none',
            },
          }}
          emptyTableText={getEmptyTextPlaceholder(tab)}
          data={{ body: activeStrategiesProcessedData }}
          columnNames={getTableHead(tab, marketType)}
        />
      </>
    )
  }
}

const ActiveTradesTableWrapper = compose(
  withSnackbar,
  graphql(disableStrategy, { name: 'disableStrategyMutation' }),
  graphql(changeTemplateStatus, { name: 'changeTemplateStatusMutation' }),
  graphql(updateStopLossStrategy, { name: 'updateStopLossStrategyMutation' }),
  graphql(updateEntryPointStrategy, {
    name: 'updateEntryPointStrategyMutation',
  }),
  graphql(updateTakeProfitStrategy, {
    name: 'updateTakeProfitStrategyMutation',
  }),
  queryRendererHoc({
    query: getActiveStrategies,
    name: `getActiveStrategiesQuery`,
    fetchPolicy: 'cache-and-network',
    variables: (props: any) => ({
      activeStrategiesInput: {
        marketType: props.marketType,
        activeExchangeKey: props.selectedKey.keyId,
        page: props.page,
        perPage: props.perPage,
        allKeys: props.allKeys,
        ...(!props.specificPair ? {} : { specificPair: props.currencyPair }),
      },
    }),
    withOutSpinner: true,
    withTableLoader: true,
    includeVariables: true,
    includeQueryBody: true,
    showLoadingWhenQueryParamsChange: false,
    subscriptionArgs: {
      subscription: ACTIVE_STRATEGIES,
      variables: (props: any) => ({
        activeStrategiesInput: {
          marketType: props.marketType,
          activeExchangeKey: props.selectedKey.keyId,
          allKeys: props.allKeys,
          ...(!props.specificPair ? {} : { specificPair: props.currencyPair }),
        },
      }),
      updateQueryFunction: updateActiveStrategiesQuerryFunction,
    },
  }),
  queryRendererHoc({
    query: getFunds,
    name: `getFundsQuery`,
    fetchPolicy: 'cache-and-network',
    variables: (props: any) => ({
      fundsInput: { activeExchangeKey: props.selectedKey.keyId },
    }),
    withOutSpinner: true,
    withTableLoader: true,
    subscriptionArgs: {
      subscription: FUNDS,
      variables: (props: any) => ({
        listenFundsInput: { activeExchangeKey: props.selectedKey.keyId },
      }),
      updateQueryFunction: updateFundsQuerryFunction,
    },
  }),
)(ActiveTradesTable)

export default React.memo(
  ActiveTradesTableWrapper,
  (prevProps: any, nextProps: any) => {
    // TODO: Refactor isShowEqual --- not so clean
    const isShowEqual = !nextProps.show && !prevProps.show
    const showAllAccountsEqual =
      prevProps.showOpenOrdersFromAllAccounts ===
      nextProps.showOpenOrdersFromAllAccounts
    const showAllPairsEqual =
      prevProps.showAllOpenOrderPairs === nextProps.showAllOpenOrderPairs
    // TODO: here must be smart condition if specificPair is not changed
    const pairIsEqual = prevProps.currencyPair === nextProps.currencyPair
    // TODO: here must be smart condition if showAllAccountsEqual is true & is not changed
    const selectedKeyIsEqual =
      prevProps.selectedKey.keyId === nextProps.selectedKey.keyId
    const isMarketIsEqual = prevProps.marketType === nextProps.marketType
    const pageIsEqual = prevProps.page === nextProps.page
    const perPageIsEqual = prevProps.perPage === nextProps.perPage

    if (
      isShowEqual &&
      showAllAccountsEqual &&
      showAllPairsEqual &&
      pairIsEqual &&
      selectedKeyIsEqual &&
      isMarketIsEqual &&
      pageIsEqual &&
      perPageIsEqual
    ) {
      return true
    }

    return false
  }
)

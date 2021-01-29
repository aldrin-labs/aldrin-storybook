import React, { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import copy from 'clipboard-copy'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { client } from '@core/graphql/apolloClient'
import QueryRenderer, { queryRendererHoc } from '@core/components/QueryRenderer'
import { withSnackbar } from 'notistack'

import { withTheme } from '@material-ui/styles'
import { getPrecisionItem } from '@core/utils/getPrecisionItem'
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

import { combineActiveTradesTable } from './ActiveTrades.utils'

import {
  updateActiveStrategiesQuerryFunction,
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
import { SmartTradeButton } from '@sb/components/TradingTable/TradingTabs/TradingTabs.styles'
import { showCancelResult } from '@sb/compositions/Chart/Chart.utils'
import {
  EditEntryPopupWithFuturesPrice,
  EditEntryPopupWithSpotPrice,
} from '../PriceBlocks/EditEntryPopupWithPrice'

@withTheme()
class ActiveTradesTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    editTrade: null,
    selectedTrade: {},
    cachedOrder: null,
    expandedRows: [],
    activeStrategiesProcessedData: [],
    prices: [],
  }

  unsubscribeFunctionGetActiveStrategies: null | Function = null

  componentDidMount() {
    const {
      keys,
      getActiveStrategiesQuery,
      theme,
      marketType,
      currencyPair,
      addOrderToCanceled,
      canceledOrders,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
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
      marketType,
      currencyPair,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    })

    this.setState({
      activeStrategiesProcessedData,
    })

    this.unsubscribeFunctionGetActiveStrategies = getActiveStrategiesQuery.subscribeToMoreFunction()
  }

  componentDidUpdate(prevProps: IProps) {
    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys ||
      prevProps.marketType !== this.props.marketType
    ) {
      this.unsubscribeFunctionGetActiveStrategies &&
        this.unsubscribeFunctionGetActiveStrategies()

      this.unsubscribeFunctionGetActiveStrategies = this.props.getActiveStrategiesQuery.subscribeToMoreFunction()
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunctionGetActiveStrategies !== null) {
      this.unsubscribeFunctionGetActiveStrategies()
    }
  }

  componentWillReceiveProps(nextProps: IProps) {
    const {
      keys,
      theme,
      marketType,
      currencyPair,
      getActiveStrategiesQuery,
      addOrderToCanceled,
      canceledOrders,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    } = nextProps

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
      marketType,
      currencyPair,
      handlePairChange,
      pricePrecision,
      quantityPrecision,
    })

    this.setState({
      activeStrategiesProcessedData,
    })

    return null
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

    // const currentPrice = (
    //   this.state.prices.find(
    //     (priceObj) => priceObj.pair === `${currencyPair}:${marketType}:binance`
    //   ) || { price: 0 }
    // ).price

    let price =
      selectedTrade.conditions.entryOrder.orderType === 'market' &&
      !!selectedTrade.conditions.entryOrder.activatePrice &&
      selectedTrade.conditions.entryOrder.activatePrice !== 0
        ? 0
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
      updateEntryPointStrategyMutation,
      updateStopLossStrategyMutation,
      updateTakeProfitStrategyMutation,
      getFundsQuery = {
        getFunds: [],
      },
      getActiveStrategiesQuery,
      handleChangePage,
      handleChangeRowsPerPage,
      updateTerminalViewMode,
      isDefaultOnlyTables,
      maxLeverage,
      allKeys,
      specificPair,
      handleToggleAllKeys,
      handleToggleSpecificPair,
    } = this.props

    if (!show) {
      return null
    }

    let pricePrecision = 8,
      quantityPrecision = 8

    if (selectedTrade && selectedTrade.conditions) {
      const precisionObject = getPrecisionItem({
        marketType,
        symbol: selectedTrade.conditions.pair,
      })

      pricePrecision = precisionObject.pricePrecision
      quantityPrecision = precisionObject.quantityPrecision
    }

    const pair =
      editTrade === 'entryOrder' && selectedTrade && selectedTrade.conditions
        ? selectedTrade.conditions.pair.split('_')
        : currencyPair.split('_')

    const funds = pair.map((coin, index) => {
      const asset = getFundsQuery.getFunds.find(
        (el) => el.asset.symbol === pair[index] && el.assetType === marketType
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

    const EditEntryPopup =
      marketType === 0
        ? EditEntryPopupWithSpotPrice
        : EditEntryPopupWithFuturesPrice

    return (
      <>
        {editTrade === 'entryOrder' &&
          selectedTrade &&
          selectedTrade.conditions && (
            <EditEntryPopup
              theme={theme}
              maxLeverage={maxLeverage}
              price={this.getEntryPrice()}
              funds={processedFunds}
              quantityPrecision={quantityPrecision}
              pricePrecision={pricePrecision}
              open={editTrade === 'entryOrder'}
              exchange={{ symbol: 'binance' }}
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
          needAdditionalComponent={isDefaultOnlyTables ? true : false}
          AdditionalComponent={() => (
            <SmartTradeButton
              style={{
                backgroundColor: theme.palette.green.main,
                marginTop: '1.5rem',
                borderRadius: '0.8rem',
                boxShadow: '0px 0px 0.5rem #74787E',
                width: '25rem',
              }}
              onClick={() => {
                updateTerminalViewMode('smartOrderMode')
              }}
            >
              Create a Smart Trade
            </SmartTradeButton>
          )}
          expandableRows={true}
          expandedRows={expandedRows}
          onChange={this.setExpandedRows}
          rowsWithHover={false}
          onTrClick={(row) => {
            this.setExpandedRows(row.id)
            copy(row.id.split('_')[0])
          }}
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
                  loading: getActiveStrategiesQuery.queryParamsWereChanged,
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
              fontSize: '1.4rem',
              fontWeight: 'bold',
              backgroundColor: theme.palette.white.background,
              color: theme.palette.grey.light,
              boxShadow: 'none',
              textTransform: 'capitalize',
            },
            cell: {
              color: theme.palette.grey.onboard,
              fontSize: '1.3rem', // 1.2 if bold
              fontFamily: 'Avenir Next Demi',
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
          columnNames={getTableHead({ tab, marketType })}
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
    withOutSpinner: false,
    withTableLoader: false,
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
    fetchPolicy: 'cache-first',
    variables: (props: any) => ({
      fundsInput: { activeExchangeKey: props.selectedKey.keyId },
    }),
  })
)(ActiveTradesTable)

export default React.memo(
  ActiveTradesTableWrapper,
  (prevProps: any, nextProps: any) => {
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

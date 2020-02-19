import React, { useEffect } from 'react'
import { graphql } from 'react-apollo'
import { compose } from 'recompose'
import { client } from '@core/graphql/apolloClient'
import QueryRenderer from '@core/components/QueryRenderer'

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

import {
  updateActiveStrategiesQuerryFunction,
  combineActiveTradesTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'
import { updateEntryPointStrategy } from '@core/graphql/mutations/chart/updateEntryPointStrategy'
import { updateStopLossStrategy } from '@core/graphql/mutations/chart/updateStopLossStrategy'
import { updateTakeProfitStrategy } from '@core/graphql/mutations/chart/updateTakeProfitStrategy'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'
import { disableStrategy } from '@core/graphql/mutations/strategies/disableStrategy'

import { FUNDS } from '@core/graphql/subscriptions/FUNDS'

import { onCheckBoxClick } from '@core/utils/PortfolioTableUtils'

import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'
import { LISTEN_TABLE_PRICE } from '@core/graphql/subscriptions/LISTEN_TABLE_PRICE'

let interval

@withTheme
class ActiveTradesTable extends React.Component<{}, {}> {
  state = {
    editTrade: null,
    selectedTrade: {},
    cachedOrder: null,
    expandedRows: [],
    activeStrategiesProcessedData: [],
    prices: [],
    needUpdate: false,
  }

  unsubscribeFunction: null | Function = null

  subscription: null | { unsubscribe: () => void } = null

  onCancelOrder = async (keyId: string, strategyId: string) => {
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
      return { errors: err }
    }
  }

  editTrade = (block: string, selectedTrade: any) => {
    this.setState({ editTrade: block, selectedTrade })
  }

  cancelOrderWithStatus = async (strategyId: string) => {
    const {
      showCancelResult,
      selectedKey: { keyId },
    } = this.props

    const result = await this.onCancelOrder(keyId, strategyId)

    // TODO: move to utils
    const statusResult =
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
  }

  subscribe() {
    const that = this
    const pairs = this.props.getActiveStrategiesQuery.getActiveStrategies.map(
      (strategy) => {
        if (strategy.enabled) {
          return `${strategy.conditions.pair}:${this.props.marketType}`
        }

        return
      }
    )

    this.subscription = client
      .subscribe({
        query: LISTEN_TABLE_PRICE,
        variables: {
          input: {
            exchange: this.props.exchange,
            pairs,
          },
        },
        fetchPolicy: 'cache-only',
      })
      .subscribe({
        next: (data) => {
          const orders = that.props.getActiveStrategiesQuery.getActiveStrategies.filter(
            (strategy) => strategy.enabled
          )

          if (
            !data ||
            data.loading ||
            !that.props.show ||
            orders.length === 0
          ) {
            return
          }

          const {
            getActiveStrategiesQuery,
            theme,
            marketType,
            currencyPair,
            quantityPrecision,
          } = that.props

          const activeStrategiesProcessedData = combineActiveTradesTable({
            data: getActiveStrategiesQuery.getActiveStrategies,
            cancelOrderFunc: this.cancelOrderWithStatus,
            editTrade: this.editTrade,
            theme,
            prices: data.data.listenTablePrice,
            marketType,
            currencyPair,
            quantityPrecision,
          })

          that.setState({
            activeStrategiesProcessedData,
            prices: data.data.listenTablePrice,
          })
        },
      })
  }

  componentDidMount() {
    const {
      getActiveStrategiesQuery,
      subscribeToMore,
      theme,
      marketType,
      currencyPair,
      quantityPrecision,
    } = this.props

    interval = setInterval(() => {
      const data = client.readQuery({
        query: getActiveStrategies,
        variables: {
          activeStrategiesInput: {
            activeExchangeKey: this.props.selectedKey.keyId,
          },
        },
      })

      if (
        !this.props.show ||
        data.getActiveStrategies.find((order) => order._id === '-1')
      ) {
        return
      }

      this.props.getActiveStrategiesQueryRefetch()
    }, 60000)

    this.subscribe()

    const activeStrategiesProcessedData = combineActiveTradesTable({
      data: getActiveStrategiesQuery.getActiveStrategies,
      cancelOrderFunc: this.cancelOrderWithStatus,
      editTrade: this.editTrade,
      theme,
      prices: this.state.prices,
      marketType,
      currencyPair,
      quantityPrecision,
    })

    this.setState({
      activeStrategiesProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps) {
    // if (!this.state.needUpdate) {
    //   setTimeout(() => this.setState({ needUpdate: true }), 10000)
    // }

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType
    ) {
      this.subscription && this.subscription.unsubscribe()
      this.subscribe()
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }

    this.subscription && this.subscription.unsubscribe()
    clearInterval(interval)
  }

  componentWillReceiveProps(nextProps) {
    const {
      getActiveStrategiesQuery,
      theme,
      marketType,
      currencyPair,
      quantityPrecision,
      selectedKey,
    } = nextProps

    const data = client.readQuery({
      query: getActiveStrategies,
      variables: {
        activeStrategiesInput: {
          activeExchangeKey: selectedKey.keyId,
        },
      },
    })

    const orderReturned = getActiveStrategiesQuery.getActiveStrategies.some(
      (a) => a._id === '0'
    )

    if (
      !this.state.cachedOrder &&
      data.getActiveStrategies.some((a) => a._id === '-1')
    ) {
      this.setState({
        cachedOrder: data.getActiveStrategies.filter((a) => a._id === '-1'),
      })
    }

    if (orderReturned) {
      this.setState({ cachedOrder: null })
    }

    const activeStrategiesProcessedData = combineActiveTradesTable({
      data:
        !orderReturned && this.state.cachedOrder
          ? getActiveStrategiesQuery.getActiveStrategies.concat(
              this.state.cachedOrder
            )
          : getActiveStrategiesQuery.getActiveStrategies,
      cancelOrderFunc: this.cancelOrderWithStatus,
      editTrade: this.editTrade,
      theme,
      prices: this.state.prices,
      marketType,
      currencyPair,
      quantityPrecision,
    })

    this.setState({
      activeStrategiesProcessedData,
    })

    client.writeQuery({
      query: getActiveStrategies,
      variables: {
        activeStrategiesInput: {
          activeExchangeKey: selectedKey.keyId,
        },
      },
      data: {
        getActiveStrategies: getActiveStrategiesQuery.getActiveStrategies.filter(
          (a) => a._id !== '0'
        ),
      },
    })

    return null
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
    const {
      activeStrategiesProcessedData,
      editTrade,
      selectedTrade,
      expandedRows,
    } = this.state

    const {
      tab,
      currencyPair,
      handleTabChange,
      show,
      marketType,
      quantityPrecision,
      updateEntryPointStrategyMutation,
      updateStopLossStrategyMutation,
      updateTakeProfitStrategyMutation,
      showCancelResult,
      getFundsQuery,
      selectedKey,
      canceledOrders,
      arrayOfMarketIds,
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
              price={this.state.prices.find(
                (priceObj) =>
                  priceObj.pair ===
                  `${selectedTrade.conditions.pair}:${
                    selectedTrade.conditions.marketType
                  }:${this.props.exchange}`
              )}
              funds={processedFunds}
              quantityPrecision={quantityPrecision}
              open={editTrade === 'entryOrder'}
              pair={selectedTrade.conditions.pair}
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
                  result &&
                  result.data &&
                  result.data.updateEntryPoint &&
                  result.data.updateEntryPoint.enabled === true
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
              validate={validateEntryOrder}
              transformProperties={transformEntryOrderProperties}
              validateField={(v) => !!v}
            />
          )}
        {editTrade === 'takeProfit' &&
          selectedTrade &&
          selectedTrade.conditions && (
            <EditTakeProfitPopup
              open={editTrade === 'takeProfit'}
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
                  result &&
                  result.data &&
                  result.data.updateTakeProfitStrategy &&
                  result.data.updateTakeProfitStrategy.enabled === true
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
              validate={validateTakeProfit}
              transformProperties={transformTakeProfitProperties}
              validateField={(v) => !!v}
            />
          )}

        {editTrade === 'stopLoss' && selectedTrade && selectedTrade.conditions && (
          <EditStopLossPopup
            open={editTrade === 'stopLoss'}
            pair={selectedTrade.conditions.pair}
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
                result &&
                result.data &&
                result.data.updateStopLossStrategy &&
                result.data.updateStopLossStrategy.enabled === true
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
            validate={validateStopLoss}
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
          style={{ borderRadius: 0, height: '100%', overflowX: 'hidden' }}
          stylesForTable={{ backgroundColor: '#fff' }}
          defaultSort={{
            sortColumn: 'date',
            sortDirection: 'desc',
          }}
          withCheckboxes={false}
          tableStyles={{
            headRow: {
              borderBottom: '1px solid #e0e5ec',
              boxShadow: 'none',
            },
            heading: {
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: '#fff',
              color: '#16253D',
              boxShadow: 'none',
            },
            cell: {
              color: '#16253D',
              fontSize: '1rem', // 1.2 if bold
              fontWeight: 'bold',
              letterSpacing: '1px',
              borderBottom: '1px solid #e0e5ec',
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
          title={
            <div>
              <TradingTabs
                tab={tab}
                handleTabChange={handleTabChange}
                marketType={marketType}
                canceledOrders={canceledOrders}
                selectedKey={selectedKey}
                currencyPair={currencyPair}
                arrayOfMarketIds={arrayOfMarketIds}
              />
            </div>
          }
          rowsWithHover={false}
          data={{ body: activeStrategiesProcessedData }}
          columnNames={getTableHead(tab, marketType)}
        />
      </>
    )
  }
}

const LastTradeWrapper = ({ ...props }) => {
  let unsubscribe: undefined | Function = undefined

  useEffect(() => {
    unsubscribe && unsubscribe()
    unsubscribe = props.subscribeToMore()

    return () => {
      unsubscribe && unsubscribe()
    }
  }, [props.marketType, props.exchange, props.currencyPair])

  return (
    <QueryRenderer
      {...props}
      component={ActiveTradesTable}
      variables={{
        activeStrategiesInput: {
          activeExchangeKey: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getActiveStrategies}
      name={`getActiveStrategiesQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: ACTIVE_STRATEGIES,
        variables: {
          activeStrategiesInput: {
            activeExchangeKey: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateActiveStrategiesQuerryFunction,
      }}
    />
  )
}

const TableDataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={LastTradeWrapper}
      withOutSpinner={true}
      withTableLoader={true}
      query={getFunds}
      variables={{ fundsInput: { activeExchangeKey: props.selectedKey.keyId } }}
      name={`getFundsQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: FUNDS,
        variables: {
          listenFundsInput: { activeExchangeKey: props.selectedKey.keyId },
        },
        updateQueryFunction: updateFundsQuerryFunction,
      }}
      {...props}
    />
  )
}

const MemoizedWrapper = React.memo(TableDataWrapper, (prevProps, nextProps) => {
  if (!nextProps.show && !prevProps.show) {
    return true
  }

  return false
})

export default compose(
  graphql(disableStrategy, { name: 'disableStrategyMutation' }),
  graphql(updateStopLossStrategy, { name: 'updateStopLossStrategyMutation' }),
  graphql(updateEntryPointStrategy, {
    name: 'updateEntryPointStrategyMutation',
  }),
  graphql(updateTakeProfitStrategy, {
    name: 'updateTakeProfitStrategyMutation',
  })
)(MemoizedWrapper)

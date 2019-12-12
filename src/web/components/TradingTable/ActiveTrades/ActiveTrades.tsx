import React, { useEffect } from 'react'
import { graphql } from 'react-apollo'

import { withTheme } from '@material-ui/styles'

import {
  getTakeProfitFromStrategy,
  getStopLossFromStrategy,
  transformTakeProfitProperties,
  transformStopLossProperties,
  validateStopLoss,
  validateTakeProfit,
  getTakeProfitArgsForUpdate,
  getStopLossArgsForUpdate,
} from '@core/utils/chartPageUtils'

import QueryRenderer from '@core/components/QueryRenderer'
import {
  EditTakeProfitPopup,
  EditStopLossPopup,
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
import { updateStopLossStrategy } from '@core/graphql/mutations/chart/updateStopLossStrategy'
import { updateTakeProfitStrategy } from '@core/graphql/mutations/chart/updateTakeProfitStrategy'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'
import { disableStrategy } from '@core/graphql/mutations/strategies/disableStrategy'

import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'
import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

import { cancelOrderStatus } from '@core/utils/tradingUtils'
import { compose } from 'recompose'

@withTheme
class ActiveTradesTable extends React.PureComponent {
  state = {
    editTrade: null,
    selectedTrade: {},
    activeStrategiesProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

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

  editTrade = (block, selectedTrade) => {
    console.log('selectedTrade', selectedTrade)
    this.setState({ editTrade: block, selectedTrade })
  }

  cancelOrderWithStatus = async (strategyId: string) => {
    const { showCancelResult, selectedKey: { keyId } } = this.props

    const result = await this.onCancelOrder(keyId, strategyId)

    // TODO: move to utils
    const statusResult = (result && result.data && result.data.disableStrategy && result.data.disableStrategy.enabled === false) ? {
      status: 'success',
      message: 'Smart order disabled'
    } : {
      status: 'error',
      message: 'Smart order disabling failed'
    }

    showCancelResult(statusResult)
  }

  // TODO: here should be a mutation order to cancel a specific order
  // TODO: Also it should receive an argument to edentify the order that we should cancel

  onCancelAll = async () => {
    // TODO: here should be a mutation func to cancel all orders
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  componentDidMount() {
    const { getActiveStrategiesQuery, subscribeToMore, theme  } = this.props

    let price

    try {
      if (
        this.props.marketTickers &&
        this.props.marketTickers.marketTickers &&
        this.props.marketTickers.marketTickers.length > 0
      ) {
        const data = JSON.parse(this.props.marketTickers.marketTickers[0])
        price = data[4]
      }
    } catch (e) {}
    const activeStrategiesProcessedData = combineActiveTradesTable(
      getActiveStrategiesQuery.getActiveStrategies,
      this.cancelOrderWithStatus,
      this.editTrade,
      theme,
      price
    )

    this.setState({
      activeStrategiesProcessedData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }
  }

  componentWillReceiveProps(nextProps) {
    let price

    try {
      if (
        this.props.marketTickers &&
        this.props.marketTickers.marketTickers &&
        this.props.marketTickers.marketTickers.length > 0
      ) {
        const data = JSON.parse(this.props.marketTickers.marketTickers[0])
        price = data[4]
      }
    } catch (e) {}

    const activeStrategiesProcessedData = combineActiveTradesTable(
      nextProps.getActiveStrategiesQuery.getActiveStrategies,
      this.cancelOrderWithStatus,
      this.editTrade,
      nextProps.theme,
      price
    )

    this.setState({
      activeStrategiesProcessedData,
    })
  }

  render() {
    const {
      activeStrategiesProcessedData,
      editTrade,
      selectedTrade,
    } = this.state
    const { tab, handleTabChange, show, marketType } = this.props

    if (!show) {
      return null
    }

    return (
      <>
        {editTrade === 'takeProfit' &&
          selectedTrade &&
          selectedTrade.conditions && (
            <EditTakeProfitPopup
              open={editTrade === 'takeProfit'}
              handleClose={() => this.setState({ editTrade: null })}
              updateState={(takeProfitProperties) => {
                const takeProfit = getTakeProfitArgsForUpdate(
                  takeProfitProperties
                )
                console.log(
                  'takeProfit',
                  takeProfit,
                  selectedTrade._id,
                  this.props.selectedKey.keyId
                )
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
            updateState={(stopLossProperties) => {
              const stopLoss = getStopLossArgsForUpdate(stopLossProperties)

              console.log(
                'stopLoss',
                stopLoss,
                selectedTrade._id,
                this.props.selectedKey.keyId
              )
            }}
            transformProperties={transformStopLossProperties}
            validate={validateStopLoss}
            derivedState={getStopLossFromStrategy(selectedTrade)}
            validateField={(v) => !!v}
          />
        )}
        <TableWithSort
          style={{ borderRadius: 0, height: '100%' }}
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
            row: {
              height: '4.5rem',
              cursor: 'initial',
            },
          }}
          emptyTableText={getEmptyTextPlaceholder(tab)}
          title={
            <div>
              <TradingTabs
                tab={tab}
                handleTabChange={handleTabChange}
                marketType={marketType}
              />
            </div>
          }
          rowsWithHover={false}
          data={{ body: activeStrategiesProcessedData }}
          columnNames={getTableHead(tab)}
        />
      </>
    )
  }
}

const LastTradeWrapper = ({ ...props }) => {
  useEffect(() => {
    const unsubscribeFunction = props.subscribeToMore()
    return () => {
      unsubscribeFunction()
    }
  }, [])

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
      fetchPolicy="network-only"
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
      variables={{ symbol: props.currencyPair, exchange: props.exchange }}
      withOutSpinner={true}
      withTableLoader={true}
      query={MARKET_QUERY}
      name={`marketTickers`}
      fetchPolicy="cache-only"
      subscriptionArgs={{
        subscription: MARKET_TICKERS,
        variables: {
          symbol: props.currencyPair,
          exchange: props.exchange,
          marketType: String(props.marketType),
        },
        updateQueryFunction: updateTradeHistoryQuerryFunction,
      }}
      {...props}
    />
  )
}

<<<<<<< HEAD
export default compose(
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' })
  // graphql(updateStopLossStrategy, { name: 'updateStopLossStrategy' }),
  // graphql(updateTakeProfitStrategy, { name: 'updateStopLossStrategy' })
)(TableDataWrapper)
=======
export default graphql(disableStrategy, { name: 'disableStrategyMutation' })(
  TableDataWrapper
)
>>>>>>> develop

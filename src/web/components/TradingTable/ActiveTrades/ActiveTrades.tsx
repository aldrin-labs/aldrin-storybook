import React, { useEffect } from 'react'
import { graphql } from 'react-apollo'
import { client } from '@core/graphql/apolloClient'

import { withTheme } from '@material-ui/styles'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import {
  updateActiveStrategiesQuerryFunction,
  combineActiveTradesTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import { CSS_CONFIG } from '@sb/config/cssConfig'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getActiveStrategies } from '@core/graphql/queries/chart/getActiveStrategies'
import { ACTIVE_STRATEGIES } from '@core/graphql/subscriptions/ACTIVE_STRATEGIES'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { MARKET_QUERY } from '@core/graphql/queries/chart/MARKET_QUERY'
import { updateTradeHistoryQuerryFunction } from '@core/utils/chartPageUtils'

import { cancelOrderStatus } from '@core/utils/tradingUtils'

@withTheme
class ActiveTradesTable extends React.PureComponent {
  state = {
    activeStrategiesProcessedData: [],
  }

  unsubscribeFunction: null | Function = null

  onCancelOrder = async (keyId: string, orderId: string, pair: string) => {
    const { cancelOrderMutation } = this.props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
          },
        },
      })

      return responseResult
    } catch (err) {
      return { errors: err }
    }
  }

  cancelOrderWithStatus = async (
    keyId: string,
    orderId: string,
    pair: string
  ) => {
    const { showCancelResult } = this.props

    const result = await this.onCancelOrder(keyId, orderId, pair)
    showCancelResult(cancelOrderStatus(result))
  }

  // TODO: here should be a mutation order to cancel a specific order
  // TODO: Also it should receive an argument to edentify the order that we should cancel

  onCancelAll = async () => {
    // TODO: here should be a mutation func to cancel all orders
    // TODO: Also it would be good to show the dialog message here after mutation completed
  }

  componentDidMount() {
    const { getActiveStrategiesQuery, subscribeToMore, theme } = this.props

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
      nextProps.theme,
      price
    )

    this.setState({
      activeStrategiesProcessedData,
    })
  }

  render() {
    const { activeStrategiesProcessedData } = this.state
    const { tab, handleTabChange, show, marketType } = this.props

    if (!show) {
      return null
    }

    return (
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
            top: '0',
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

export default graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' })(
  TableDataWrapper
)

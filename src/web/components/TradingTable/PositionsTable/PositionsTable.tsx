import React from 'react'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'
import { client } from '@core/graphql/apolloClient'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import {
  updateActivePositionsQuerryFunction,
  combinePositionsTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { FUTURES_POSITIONS } from '@core/graphql/subscriptions/FUTURES_POSITIONS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'

import { cancelOrderStatus } from '@core/utils/tradingUtils'

@withTheme
class PositionsTable extends React.PureComponent {
  state = {
    positionsData: [],
    marketPrice: 0,
    needUpdate: true
  }

  unsubscribeFunction: null | Function = null

  onCancelOrder = async (keyId: string, orderId: string, pair: string) => {
    const { cancelOrderMutation, marketType } = this.props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
            marketType
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
    const { getActivePositionsQuery, subscribeToMore, theme } = this.props

    const that = this

    this.subscription = client
      .subscribe({
        query: MARKET_TICKERS,
        variables: {
          symbol: that.props.currencyPair,
          exchange: that.props.exchange,
          marketType: String(that.props.marketType),
        },
      })
      .subscribe({
        next: (data) => {
          if (data && data.data && data.data.listenMarketTickers && that.state.needUpdate) {
            const marketPrice = JSON.parse(data.data.listenMarketTickers)[4]

            const positionsData = combinePositionsTable(
              that.props.getActivePositionsQuery.getActivePositions,
              that.cancelOrderWithStatus,
              theme,
              marketPrice
            )

            that.setState({
              positionsData,
              marketPrice,
            })
          }
        },
      })


    const positionsData = combinePositionsTable(
      getActivePositionsQuery.getActivePositions,
      this.cancelOrderWithStatus,
      theme,
      this.state.marketPrice
    )
    this.setState({
      positionsData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate() {
    if (this.state.needUpdate) {
      this.setState({ needUpdate: false }, () => setTimeout(() => this.setState({ needUpdate: true }), 10000))
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }

    this.subscription && this.subscription.unsubscribe()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const positionsData = combinePositionsTable(
      nextProps.getActivePositionsQuery.getActivePositions,
      this.cancelOrderWithStatus,
      nextProps.theme,
      this.state.marketPrice
    )

    this.setState({
      positionsData,
    })
  }

  render() {
    const { positionsData } = this.state
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
        data={{ body: positionsData }}
        columnNames={getTableHead(tab)}
      />
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  return (
    <QueryRenderer
      component={PositionsTable}
      variables={{
        input: {
          keyId: props.selectedKey.keyId,
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      query={getActivePositions}
      name={`getActivePositionsQuery`}
      fetchPolicy="cache-and-network"
      subscriptionArgs={{
        subscription: FUTURES_POSITIONS,
        variables: {
          input: {
            keyId: props.selectedKey.keyId,
          },
        },
        updateQueryFunction: updateActivePositionsQuerryFunction,
      }}
      {...props}
    />
  )
}

export default graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' })(
  TableDataWrapper
)

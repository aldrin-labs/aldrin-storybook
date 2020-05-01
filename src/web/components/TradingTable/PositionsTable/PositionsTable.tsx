import React, { useState } from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'
import { withSnackbar } from 'notistack'
import { client } from '@core/graphql/apolloClient'
import { queryRendererHoc } from '@core/components/QueryRenderer'

import QueryRenderer from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import {
  updateActivePositionsQuerryFunction,
  combinePositionsTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { IProps, IState } from './PositionsTable.types'
import { PaginationBlock } from '../TradingTablePagination'

import TradingTabs from '@sb/components/TradingTable/TradingTabs/TradingTabs'
import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { modifyIsolatedMargin } from '@core/graphql/mutations/chart/modifyIsolatedMargin'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { FUTURES_POSITIONS } from '@core/graphql/subscriptions/FUTURES_POSITIONS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'

import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'

import { createOrder } from '@core/graphql/mutations/chart/createOrder'
import { updatePosition } from '@core/graphql/mutations/chart/updatePosition'

import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { cancelOrderStatus } from '@core/utils/tradingUtils'
import { LISTEN_PRICE } from '@core/graphql/subscriptions/LISTEN_PRICE'
import { LISTEN_TERMINAL_PRICE } from '@core/graphql/subscriptions/LISTEN_TERMINAL_PRICE'
import { LISTEN_TABLE_PRICE } from '@core/graphql/subscriptions/LISTEN_TABLE_PRICE'

import { EditMarginPopup } from './EditMarginPopup'

@withTheme()
class PositionsTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    positionsData: [],
    prices: [],
    positionsRefetchInProcess: false,
    editMarginPosition: {},
    editMarginPopup: false,
  }

  unsubscribeFunction: null | Function = null

  unsubscribeFundsFunction: null | Function = null

  subscription: null | { unsubscribe: () => void } = null

  createOrder = async (variables) => {
    const { createOrderMutation, selectedKey } = this.props
    const hedgeMode = selectedKey.hedgeMode

    const { reduceOnly, ...paramsForHedge } = variables.keyParams

    try {
      const result = await createOrderMutation({
        variables: {
          ...variables,
          keyParams: {
            ...(hedgeMode
              ? {
                  ...paramsForHedge,
                  positionSide:
                    paramsForHedge.side === 'buy' ? 'SHORT' : 'LONG',
                }
              : variables.keyParams),
          },
        },
      })

      if (result.errors) {
        return {
          status: 'error',
          message: 'Something went wrong',
        }
      }
      if (result.data.createOrder.status === 'ERR') {
        return {
          status: 'error',
          message: result.data.createOrder.binanceMessage,
        }
      }
      if (result.data.createOrder.orderId) {
        return {
          status: 'success',
          message: 'Order placed',
          orderId: result.data.createOrder.orderId,
        }
      }
      return {
        status: 'error',
        message: 'Something went wrong',
      }
    } catch (err) {
      return {
        status: 'error',
        message: 'Something went wrong',
      }
    }
  }

  toogleEditMarginPopup = (editMarginPosition) => {
    this.setState((prev) => ({
      editMarginPopup: !prev.editMarginPopup,
      editMarginPosition,
    }))
  }

  createOrderWithStatus = async (variables: any) => {
    const {
      getActivePositionsQuery,
      currencyPair,
      selectedKey,
      canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      theme,
      keys,
      cancelOrder,
      marketType,
      showOrderResult,
    } = this.props

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      prices: this.state.prices,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
    })

    this.setState({
      positionsData,
    })

    const result = await this.createOrder(variables)
    await showOrderResult(result, cancelOrder, marketType)
  }

  onCancelOrder = async (keyId: string, orderId: string, pair: string) => {
    const { cancelOrderMutation, marketType } = this.props

    try {
      const responseResult = await cancelOrderMutation({
        variables: {
          cancelOrderInput: {
            keyId,
            orderId,
            pair,
            marketType,
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
    const status = await cancelOrderStatus(result)

    if (status.result === 'error') {
      await this.props.clearCanceledOrders()
    }

    showCancelResult(status)
  }

  modifyIsolatedMargin = async ({
    keyId,
    positionSide,
    symbol,
    amount,
    type,
  }: {
    keyId: string
    positionSide: string
    symbol: string
    amount: number
    type: number
  }) => {
    try {
      const result = await this.props.modifyIsolatedMarginMutation({
        variables: {
          keyId,
          positionSide,
          symbol,
          amount,
          type,
        },
      })

      return result
    } catch (e) {
      return { errors: e }
    }
  }

  modifyIsolatedMarginWithStatus = async ({
    keyId,
    positionSide,
    symbol,
    amount,
    type,
  }: {
    keyId: string
    positionSide: string
    symbol: string
    amount: number
    type: number
  }) => {
    const { enqueueSnackbar } = this.props

    const result = await this.modifyIsolatedMargin({
      keyId,
      positionSide,
      symbol,
      amount,
      type,
    })

    if (result.errors) {
      enqueueSnackbar(`Something went wrong`, { variant: 'error' })
      return
    }

    if (result.data.modifyIsolatedMargin.status === 'OK') {
      enqueueSnackbar(`Your isolated margin successfuly updated`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(
        `Error: ${result.data.modifyIsolatedMargin.binanceMessage}`,
        { variant: 'error' }
      )
    }
  }

  subscribe() {
    const that = this
    const pairs = this.props.getActivePositionsQuery.getActivePositions
      .map((position) => {
        if (position.positionAmt !== 0) {
          return `${position.symbol}:${this.props.marketType}`
        }

        return
      })
      .filter((a) => !!a)

    console.log('pairs', pairs)

    this.subscription = client
      .subscribe({
        query: LISTEN_TABLE_PRICE,
        variables: {
          input: {
            exchange: this.props.exchange,
            pairs,
          },
        },
        fetchPolicy: 'cache-and-network',
      })
      .subscribe({
        next: (data) => {
          const positions = that.props.getActivePositionsQuery.getActivePositions.filter(
            (position) => position.positionAmt !== 0
          )

          if (
            !data ||
            data.loading ||
            !that.props.show ||
            positions.length === 0
          ) {
            return
          }

          const {
            getActivePositionsQuery,
            currencyPair,
            selectedKey,
            canceledOrders,
            priceFromOrderbook,
            pricePrecision,
            quantityPrecision,
            theme,
            keys,
          } = that.props

          const positionsData = combinePositionsTable({
            data: getActivePositionsQuery.getActivePositions,
            createOrderWithStatus: that.createOrderWithStatus,
            toogleEditMarginPopup: that.toogleEditMarginPopup,
            theme,
            keys,
            prices: data.data.listenTablePrice,
            pair: currencyPair,
            keyId: selectedKey.keyId,
            canceledPositions: canceledOrders,
            priceFromOrderbook,
            pricePrecision,
            quantityPrecision,
          })

          that.setState({
            positionsData,
            prices: data.data.listenTablePrice,
          })
        },
      })
  }

  subscribeFunds = () => {
    const { getFundsQuery, selectedKey } = this.props

    this.unsubscribeFundsFunction = getFundsQuery.subscribeToMore({
      document: FUNDS,
      variables: {
        listenFundsInput: { activeExchangeKey: selectedKey.keyId },
      },
      updateQuery: updateFundsQuerryFunction,
    })
  }

  componentDidMount() {
    const {
      getActivePositionsQuery,
      currencyPair,
      selectedKey,
      canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      subscribeToMore,
      theme,
      keys,
    } = this.props

    this.subscribe()
    this.subscribeFunds()

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      prices: this.state.prices,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
    })

    this.setState({
      positionsData,
    })

    this.unsubscribeFunction = subscribeToMore()
  }

  componentDidUpdate(prevProps: IProps) {
    const newPositions = this.props.getActivePositionsQuery.getActivePositions.filter(
      (position) => position.positionAmt !== 0
    )

    const prevPositions = prevProps.getActivePositionsQuery.getActivePositions.filter(
      (position) => position.positionAmt !== 0
    )

    if (
      prevProps.exchange !== this.props.exchange ||
      prevProps.currencyPair !== this.props.currencyPair ||
      prevProps.marketType !== this.props.marketType ||
      prevPositions.length < newPositions.length
    ) {
      this.subscription && this.subscription.unsubscribe()
      this.subscribe()
    }

    if (
      this.props.getActivePositionsQuery.getActivePositions.some(
        (position) =>
          this.props.canceledOrders.includes(position._id) &&
          +position.positionAmt === 0
      )
    ) {
      this.props.clearCanceledOrders()
    }

    if (prevProps.selectedKey.keyId !== this.props.selectedKey.keyId) {
      this.unsubscribeFundsFunction && this.unsubscribeFundsFunction()
      this.subscribeFunds()
    }

    if (
      prevProps.selectedKey.keyId !== this.props.selectedKey.keyId ||
      prevProps.specificPair !== this.props.specificPair ||
      prevProps.allKeys !== this.props.allKeys
    ) {
      const {
        marketType,
        selectedKey,
        allKeys,
        currencyPair,
        specificPair,
      } = this.props

      this.unsubscribeFunction && this.unsubscribeFunction()
      this.unsubscribeFunction = this.props.getActivePositionsQuery.subscribeToMore(
        {
          document: FUTURES_POSITIONS,
          variables: {
            orderHistoryInput: {
              marketType,
              activeExchangeKey: selectedKey.keyId,
              allKeys,
              ...(!specificPair ? {} : { specificPair: currencyPair }),
            },
          },
          updateQuery: updateActivePositionsQuerryFunction,
        }
      )
    }
  }

  componentWillUnmount = () => {
    // unsubscribe subscription
    if (this.unsubscribeFunction !== null) {
      this.unsubscribeFunction()
    }

    this.unsubscribeFundsFunction && this.unsubscribeFundsFunction()
    this.subscription && this.subscription.unsubscribe()
  }

  componentWillReceiveProps(nextProps: IProps) {
    const {
      getActivePositionsQuery,
      theme,
      keys,
      currencyPair,
      selectedKey,
      canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
    } = nextProps

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      prices: this.state.prices,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
    })

    this.setState({
      positionsData,
    })
  }

  updatePositionsHandler = () => {
    const { updatePositionMutation, selectedKey } = this.props

    this.setState({
      positionsRefetchInProcess: true,
    })

    updatePositionMutation({
      variables: {
        input: {
          keyId: selectedKey.keyId,
        },
      },
    })
      .then((res) => {
        this.showPositionsStatus({
          status: res.data.updatePosition.status,
          errorMessage: res.data.updatePosition.errorMessage,
        })
      })
      .catch((e) => {
        this.showPositionsStatus({ status: 'ERR', errorMessage: e.message })
      })
  }

  showPositionsStatus = ({
    status = 'ERR',
    errorMessage = 'Something went wrong with the result of position update',
  }: {
    status: 'ERR' | 'OK'
    errorMessage: string
  }) => {
    const { enqueueSnackbar } = this.props

    this.setState({
      positionsRefetchInProcess: false,
    })

    if (status === 'OK') {
      enqueueSnackbar(`Your positions successfuly updated`, {
        variant: 'success',
      })
    } else {
      enqueueSnackbar(`Error: ${errorMessage}`, { variant: 'error' })
    }
  }

  render() {
    const { positionsData, positionsRefetchInProcess } = this.state
    const {
      tab,
      handleTabChange,
      show,
      marketType,
      selectedKey,
      canceledOrders,
      arrayOfMarketIds,
      allKeys,
      specificPair,
      getFundsQuery,
      showAllPositionPairs,
      showAllOpenOrderPairs,
      showAllSmartTradePairs,
      showPositionsFromAllAccounts,
      showOpenOrdersFromAllAccounts,
      showSmartTradesFromAllAccounts,
      handleToggleAllKeys,
      handleToggleSpecificPair,
      currencyPair,
    } = this.props

    if (!show) {
      return null
    }

    const [
      USDTFuturesFund = { quantity: 0, value: 0 },
    ] = getFundsQuery.getFunds
      .filter((el) => +el.assetType === 1 && el.asset.symbol === 'USDT')
      .map((el) => ({ quantity: el.free, value: el.free }))

    return (
      <>
        <TableWithSort
          style={{ borderRadius: 0, height: '100%', overflowX: 'scroll' }}
          stylesForTable={{ backgroundColor: '#fff' }}
          defaultSort={{
            sortColumn: 'date',
            sortDirection: 'desc',
          }}
          withCheckboxes={false}
          pagination={{
            fakePagination: false,
            enabled: true,
            showPagination: false,
            additionalBlock: (
              <PaginationBlock
                {...{
                  allKeys,
                  specificPair,
                  handleToggleAllKeys,
                  handleToggleSpecificPair,
                }}
              />
            ),
            paginationStyles: { width: 'calc(100% - 0.4rem)' },
          }}
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
                {...{
                  tab,
                  marketType,
                  selectedKey,
                  currencyPair,
                  canceledOrders,
                  handleTabChange,
                  arrayOfMarketIds,
                  showAllPositionPairs,
                  showAllOpenOrderPairs,
                  showAllSmartTradePairs,
                  showPositionsFromAllAccounts,
                  showOpenOrdersFromAllAccounts,
                  showSmartTradesFromAllAccounts,
                }}
              />
            </div>
          }
          rowsWithHover={false}
          data={{ body: positionsData }}
          columnNames={getTableHead(
            tab,
            marketType,
            this.props.getActivePositionsQueryRefetch,
            this.updatePositionsHandler,
            positionsRefetchInProcess
          )}
        />
        {this.state.editMarginPopup && (
          <EditMarginPopup
            open={true}
            editMarginPosition={this.state.editMarginPosition}
            handleClose={this.toogleEditMarginPopup}
            modifyIsolatedMarginWithStatus={this.modifyIsolatedMarginWithStatus}
            USDTFuturesFund={USDTFuturesFund}
          />
        )}
      </>
    )
  }
}

const TableDataWrapper = ({ ...props }) => {
  const {
    showPositionsFromAllAccounts: allKeys,
    showAllPositionPairs: specificPair,
  } = props

  return (
    <QueryRenderer
      component={PositionsTable}
      variables={{
        input: {
          keyId: props.selectedKey.keyId,
          allKeys: allKeys,
          ...(!specificPair ? {} : { specificPair: props.currencyPair }),
        },
      }}
      withOutSpinner={true}
      withTableLoader={true}
      showLoadingWhenQueryParamsChange={false}
      query={getActivePositions}
      name={`getActivePositionsQuery`}
      fetchPolicy="cache-and-network"
      pollInterval={props.show ? 25000 : 0}
      subscriptionArgs={{
        subscription: FUTURES_POSITIONS,
        variables: {
          input: {
            keyId: props.selectedKey.keyId,
            allKeys: allKeys,
            ...(!specificPair ? {} : { specificPair: props.currencyPair }),
          },
        },
        updateQueryFunction: updateActivePositionsQuerryFunction,
      }}
      {...{
        allKeys,
        specificPair,
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
  withSnackbar,
  queryRendererHoc({
    query: getFunds,
    name: 'getFundsQuery',
    fetchPolicy: 'cache-and-network',
    variables: (props) => ({
      fundsInput: { activeExchangeKey: props.selectedKey.keyId },
    }),
  }),
  graphql(updatePosition, { name: 'updatePositionMutation' }),
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' }),
  graphql(createOrder, { name: 'createOrderMutation' }),
  graphql(modifyIsolatedMargin, { name: 'modifyIsolatedMarginMutation' })
)(MemoizedWrapper)

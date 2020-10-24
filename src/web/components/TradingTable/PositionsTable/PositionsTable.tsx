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
import { setPositionWasClosed } from '@core/graphql/mutations/strategies/setPositionWasClosed'
import { FUNDS } from '@core/graphql/subscriptions/FUNDS'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { getAdlQuantile } from '@core/graphql/queries/chart/getAdlQuantile'
import { FUTURES_POSITIONS } from '@core/graphql/subscriptions/FUTURES_POSITIONS'
import { MARKET_TICKERS } from '@core/graphql/subscriptions/MARKET_TICKERS'

import { getKeysQuery } from '@core/graphql/queries/user/getKeysQuery'
import { getPrice } from '@core/graphql/queries/chart/getPrice'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'

import { createOrder } from '@core/graphql/mutations/chart/createOrder'
import { updatePosition } from '@core/graphql/mutations/chart/updatePosition'

import { updateFundsQuerryFunction } from '@core/utils/TradingTable.utils'
import { LISTEN_MARK_PRICES } from '@core/graphql/subscriptions/LISTEN_MARK_PRICES'

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

  refetchPositionsIntervalId: null | Timeout = null

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

  createOrderWithStatus = async (variables: any, positionId) => {
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
      setPositionWasClosedMutation,
      handlePairChange,
      addOrderToCanceled,
      clearCanceledOrders,
      updatePositionMutation,
      enqueueSnackbar,
    } = this.props

    let data = getActivePositionsQuery.getActivePositions

    // if (variables.keyParams.type === 'market') {
    //   const position = getActivePositionsQuery.getActivePositions.find(
    //     (p) => p._id === positionId
    //   )

    //   addOrderToCanceled(positionId)
    //   data = getActivePositionsQuery.getActivePositions.filter(
    //     (p) => p._id !== positionId
    //   )
    //   setTimeout(() => clearCanceledOrders(), 5000)
    // }

    // ux improve to show result before
    showOrderResult(
      { status: 'success', message: 'Order placed', orderId: '0' },
      cancelOrder,
      marketType
    )

    const positionsData = combinePositionsTable({
      data,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      adlData: this.getAdlData(),
      prices: this.state.prices,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      handlePairChange,
      enqueueSnackbar,
    })

    this.setState({
      positionsData,
    })

    const result = await this.createOrder(variables)
    if (result.status === 'error') {
      const isReduceOrderIsRejected = /-2022/.test(result.message)
      if (isReduceOrderIsRejected) {
        updatePositionMutation({
          variables: {
            input: {
              keyId: selectedKey.keyId,
            },
          },
        })
      }

      showOrderResult(result, cancelOrder, marketType)
      await this.props.clearCanceledOrders()
    }
    // here we disable SM if you closed position manually
    setPositionWasClosedMutation({
      variables: {
        keyId: selectedKey.keyId,
        pair: variables.keyParams.symbol,
        side: variables.keyParams.side === 'buy' ? 'sell' : 'buy',
      },
    })
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

  getPairsWithPositions = () => {
    return this.props.getActivePositionsQuery.getActivePositions
      .map((position) => {
        if (position.positionAmt !== 0) {
          return `${position.symbol}`
        }

        return
      })
      .filter((a) => !!a)
      .filter((v, i, arr) => arr.indexOf(v) === i)
  }

  getAdlData = () => {
    const pairs = this.props.getActivePositionsQuery.getActivePositions
      .map((position) => {
        if (position.positionAmt !== 0) {
          return `${position.symbol.replace('_', '')}`
        }

        return
      })
      .filter((a) => !!a)

    if (
      this.props.getAdlQuantileQuery &&
      this.props.getAdlQuantileQuery.getAdlQuantile &&
      this.props.getAdlQuantileQuery.getAdlQuantile.data &&
      this.props.getAdlQuantileQuery.getAdlQuantile.data.length
    ) {
      const adlData = this.props.getAdlQuantileQuery.getAdlQuantile.data.filter(
        (adl) => pairs.includes(adl.symbol)
      )

      return adlData
    }

    return []
  }

  subscribe() {
    const that = this

    // console.log('subscribe', this.getPairsWithPositions())
    this.subscription = client
      .subscribe({
        query: LISTEN_MARK_PRICES,
        variables: {
          input: {
            exchange: this.props.exchange,
            pairs: this.getPairsWithPositions(),
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
            getAdlQuantileQuery,
            handlePairChange,
            enqueueSnackbar,
          } = that.props

          const positionsData = combinePositionsTable({
            data: getActivePositionsQuery.getActivePositions,
            createOrderWithStatus: that.createOrderWithStatus,
            toogleEditMarginPopup: that.toogleEditMarginPopup,
            theme,
            keys,
            prices: data.data.listenMarkPrices,
            adlData: this.getAdlData(),
            pair: currencyPair,
            keyId: selectedKey.keyId,
            canceledPositions: canceledOrders,
            priceFromOrderbook,
            pricePrecision,
            quantityPrecision,
            handlePairChange,
            enqueueSnackbar,
          })

          that.setState({
            positionsData,
            prices: data.data.listenMarkPrices,
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
      getAdlQuantileQuery,
      handlePairChange,
      enqueueSnackbar,
    } = this.props

    this.subscribe()
    this.subscribeFunds()

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      adlData: this.getAdlData(),
      prices: this.state.prices,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      handlePairChange,
      enqueueSnackbar,
    })

    this.setState({
      positionsData,
    })

    this.unsubscribeFunction = subscribeToMore()

    const crossPositionsNew = this.props.getActivePositionsQuery.getActivePositions.filter(
      (position) =>
        position.positionAmt !== 0 && position.marginType === 'cross'
    )
    // if positions more than 2 they may affect each other bcz of shared balance between them
    if (crossPositionsNew.length >= 2) {
      if (!this.refetchPositionsIntervalId) {
        this.updatePositionsHandler(true)
        this.refetchPositionsIntervalId = setInterval(() => {
          this.updatePositionsHandler(true)
        }, 30000)
      }
    }
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

    if (prevProps.selectedKey.keyId !== this.props.selectedKey.keyId) {
      this.unsubscribeFundsFunction && this.unsubscribeFundsFunction()
      this.subscribeFunds()
    }

    if (prevPositions.length !== newPositions.length) {
      const crossPositionsNew = newPositions.filter(
        (position) => position.marginType === 'cross'
      )
      const crossPositionsPrev = prevPositions.filter(
        (position) => position.marginType === 'cross'
      )

      // if positions more than 2 they may affect each other bcz of shared balance between them
      if (crossPositionsNew.length >= 2 || crossPositionsPrev.length >= 2) {
        if (!this.refetchPositionsIntervalId) {
          this.refetchPositionsIntervalId = setInterval(() => {
            this.updatePositionsHandler(true)
          }, 30000)
        }
      }

      // if no positions currently
      if (crossPositionsNew.length === 0) {
        if (this.refetchPositionsIntervalId) {
          clearInterval(this.refetchPositionsIntervalId)
        }
      }
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
            input: {
              keyId: selectedKey.keyId,
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

    if (this.refetchPositionsIntervalId) {
      clearInterval(this.refetchPositionsIntervalId)
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
      getAdlQuantileQuery,
      handlePairChange,
      enqueueSnackbar,
    } = nextProps

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      adlData: this.getAdlData(),
      prices: this.state.prices,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      pricePrecision,
      quantityPrecision,
      handlePairChange,
      enqueueSnackbar,
    })

    this.setState({
      positionsData,
    })
  }

  updatePositionsHandler = (silent: boolean = false) => {
    // console.log(`this.updatePositionsHandler fired`)
    const { updatePositionMutation, selectedKey } = this.props

    if (!silent) {
      this.setState({
        positionsRefetchInProcess: true,
      })
    }

    updatePositionMutation({
      variables: {
        input: {
          keyId: selectedKey.keyId,
        },
      },
    })
      .then((res) => {
        if (silent) {
          return
        }

        this.showPositionsStatus({
          status: res.data.updatePosition.status,
          errorMessage: res.data.updatePosition.errorMessage,
        })
      })
      .catch((e) => {
        if (silent) {
          return
        }
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
      theme,
      show,
      marketType,
      allKeys,
      specificPair,
      getFundsQuery,
      handleToggleAllKeys,
      handleToggleSpecificPair,
      getAdlQuantileQuery,
    } = this.props

    if (!show) {
      return null
    }

    let USDTFuturesFund = { quantity: 0, value: 0 }

    if (getFundsQuery && getFundsQuery.getFunds) {
      USDTFuturesFund = getFundsQuery.getFunds
        .filter((el) => +el.assetType === 1 && el.asset.symbol === 'USDT')
        .map((el) => ({ quantity: el.free, value: el.free }))
    }

    return (
      <>
        <TableWithSort
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
            showPagination: false,
            additionalBlock: (
              <PaginationBlock
                {...{
                  theme,
                  allKeys,
                  specificPair,
                  handleToggleAllKeys,
                  handleToggleSpecificPair,
                }}
              />
            ),
            paginationStyles: {
              width: 'calc(100%)',
              backgroundColor: theme.palette.white.background,
              border: theme.palette.border.main,
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
              top: '0',
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
            row: {
              height: '4.5rem',
              cursor: 'initial',
            },
          }}
          emptyTableText={getEmptyTextPlaceholder(tab)}
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
            theme={theme}
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

// const TableDataWrapper = ({ ...props }) => {
//   const {
//     showPositionsFromAllAccounts: allKeys,
//     showAllPositionPairs: specificPair,
//   } = props

//   return (
//     <QueryRenderer
//       component={PositionsTable}
//       variables={{
//         input: {
//           keyId: props.selectedKey.keyId,
//           allKeys: allKeys,
//           ...(!specificPair ? {} : { specificPair: props.currencyPair }),
//         },
//       }}
//       withOutSpinner={false}
//       withTableLoader={false}
//       showLoadingWhenQueryParamsChange={false}
//       query={getActivePositions}
//       name={`getActivePositionsQuery`}
//       fetchPolicy="cache-and-network"
//       // pollInterval={props.show ? 25000 : 0}
//       subscriptionArgs={{
//         subscription: FUTURES_POSITIONS,
//         variables: {
//           input: {
//             keyId: props.selectedKey.keyId,
//             allKeys: allKeys,
//             ...(!specificPair ? {} : { specificPair: props.currencyPair }),
//           },
//         },
//         updateQueryFunction: updateActivePositionsQuerryFunction,
//       }}
//       {...{
//         allKeys,
//         specificPair,
//       }}
//       {...props}
//     />
//   )
// }


// const {
//   showPositionsFromAllAccounts: allKeys,
//   showAllPositionPairs: specificPair,
// } = props

const PositionsTableWrapper = compose(
  withSnackbar,
  queryRendererHoc({
    query: getActivePositions,
    name: `getActivePositionsQuery`,
    fetchPolicy: "cache-and-network",
    withOutSpinner: false,
    withTableLoader: false,
    showLoadingWhenQueryParamsChange: false,
    variables: (props: any) => ({
      input: {
        keyId: props.selectedKey.keyId,
        allKeys: props.showPositionsFromAllAccounts,
        ...(!props.showAllPositionPairs ? {} : { specificPair: props.currencyPair }),
      },
    }),
    subscriptionArgs: {
      subscription: FUTURES_POSITIONS,
      variables: (props: any) => ({
        input: {
          keyId: props.selectedKey.keyId,
          allKeys: props.showPositionsFromAllAccounts,
          ...(!props.showAllPositionPairs ? {} : { specificPair: props.currencyPair }),
        },
      }),
      updateQueryFunction: updateActivePositionsQuerryFunction,
    },
  }),
  queryRendererHoc({
    query: getFunds,
    name: 'getFundsQuery',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    variables: (props) => ({
      fundsInput: { activeExchangeKey: props.selectedKey.keyId },
    }),
  }),
  graphql(updatePosition, { name: 'updatePositionMutation' }),
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' }),
  graphql(createOrder, { name: 'createOrderMutation' }),
  graphql(modifyIsolatedMargin, { name: 'modifyIsolatedMarginMutation' }),
  graphql(setPositionWasClosed, { name: 'setPositionWasClosedMutation' }),
  queryRendererHoc({
    query: getAdlQuantile,
    name: 'getAdlQuantileQuery',
    fetchPolicy: 'cache-and-network',
    pollInterval: 1000 * 60,
    withoutLoading: true,
    variables: (props) => ({
      keyId: props.selectedKey.keyId,
    }),
  }),
)(PositionsTable)

export default React.memo(PositionsTableWrapper, (prevProps: any, nextProps: any) => {
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
    // isMarketIsEqual &&
    pageIsEqual &&
    perPageIsEqual
  ) {
    return true
  }

  return false
})


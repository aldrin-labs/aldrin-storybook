import React from 'react'
import { compose } from 'recompose'
import { graphql } from 'react-apollo'
import { withTheme } from '@material-ui/styles'
import { withSnackbar } from 'notistack'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { TableWithSort } from '@sb/components'

import {
  updateActivePositionsQuerryFunction,
  combinePositionsTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { IProps, IState } from './PositionsTable.types'
import { PaginationBlock } from '../TradingTablePagination'

import { getFunds } from '@core/graphql/queries/chart/getFunds'
import { modifyIsolatedMargin } from '@core/graphql/mutations/chart/modifyIsolatedMargin'
import { setPositionWasClosed } from '@core/graphql/mutations/strategies/setPositionWasClosed'
import { getActivePositions } from '@core/graphql/queries/chart/getActivePositions'
import { FUTURES_POSITIONS } from '@core/graphql/subscriptions/FUTURES_POSITIONS'
import { CANCEL_ORDER_MUTATION } from '@core/graphql/mutations/chart/cancelOrderMutation'

import { createOrder } from '@core/graphql/mutations/chart/createOrder'
import { updatePosition } from '@core/graphql/mutations/chart/updatePosition'

import EditMarginPopup from './EditMarginPopup'
import { showOrderResult } from '@sb/compositions/Chart/Chart.utils'

@withTheme()
class PositionsTable extends React.PureComponent<IProps, IState> {
  state: IState = {
    positionsData: [],
    positionsRefetchInProcess: false,
    editMarginPosition: {},
    editMarginPopup: false,
  }

  unsubscribeFunction: null | Function = null

  subscription: null | { unsubscribe: () => void } = null

  refetchPositionsIntervalId: null | Timeout = null

  createOrder = async (variables, positionKey) => {
    const { createOrderMutation } = this.props

    // we take hedgeMode from key that have position we should close
    const hedgeMode = positionKey.hedgeMode

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
      theme,
      keys,
      cancelOrder,
      marketType,
      setPositionWasClosedMutation,
      handlePairChange,
      addOrderToCanceled,
      clearCanceledOrders,
      updatePositionMutation,
      enqueueSnackbar,
      minFuturesStep,
      keysObjects,
    } = this.props

    const positionKey = keysObjects.find((key) => key.keyId === variables.keyId)
    let data = getActivePositionsQuery.getActivePositions

    if (variables.keyParams.amount === 0) {
      enqueueSnackbar(
        `Order amount should be at least ${minFuturesStep} ${currencyPair}`,
        {
          variant: 'error',
        }
      )
      console.log('variables', variables.keyParams)
      return
    }

    // console.log('var', variables.keyParams)
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

    const result = await this.createOrder(variables, positionKey)
    if (result.status === 'error') {
      const isReduceOrderIsRejected = /-2022/.test(result.message)
      if (isReduceOrderIsRejected) {
        updatePositionMutation({
          variables: {
            input: {
              keyId: positionKey.keyId,
            },
          },
        })
      }

      const isPositionSideError = /Position side cannot be changed if there exists position/.test(
        result.message
      )
      if (isPositionSideError) {
        this.props.refetchKeys()
      }

      showOrderResult(result, cancelOrder, marketType)
      await this.props.clearCanceledOrders()
    }
    // here we disable SM if you closed position manually
    setPositionWasClosedMutation({
      variables: {
        keyId: positionKey.keyId,
        pair: variables.keyParams.symbol,
        side: variables.keyParams.side === 'buy' ? 'sell' : 'buy',
      },
    })
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

  componentDidMount() {
    const {
      getActivePositionsQuery,
      currencyPair,
      selectedKey,
      canceledOrders,
      priceFromOrderbook,
      subscribeToMore,
      theme,
      keys,
      handlePairChange,
      enqueueSnackbar,
    } = this.props

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
      handlePairChange,
      enqueueSnackbar,
    })

    this.setState({
      positionsData,
    })

    this.unsubscribeFunction = this.props.getActivePositionsQuery.subscribeToMoreFunction()

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

      this.unsubscribeFunction && this.unsubscribeFunction()
      this.unsubscribeFunction = this.props.getActivePositionsQuery.subscribeToMoreFunction()
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
      handlePairChange,
      enqueueSnackbar,
    } = nextProps

    const positionsData = combinePositionsTable({
      data: getActivePositionsQuery.getActivePositions,
      createOrderWithStatus: this.createOrderWithStatus,
      toogleEditMarginPopup: this.toogleEditMarginPopup,
      theme,
      keys,
      pair: currencyPair,
      keyId: selectedKey.keyId,
      canceledPositions: canceledOrders,
      priceFromOrderbook,
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
      getActivePositionsQuery,
    } = this.props

    if (!show) {
      return null
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
                  loading: getActivePositionsQuery.queryParamsWereChanged,
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
            selectedKey={this.props.selectedKey}
            theme={theme}
            open={true}
            editMarginPosition={this.state.editMarginPosition}
            handleClose={this.toogleEditMarginPopup}
            modifyIsolatedMarginWithStatus={this.modifyIsolatedMarginWithStatus}
          />
        )}
      </>
    )
  }
}

const PositionsTableWrapper = compose(
  withSnackbar,
  graphql(updatePosition, { name: 'updatePositionMutation' }),
  graphql(CANCEL_ORDER_MUTATION, { name: 'cancelOrderMutation' }),
  graphql(createOrder, { name: 'createOrderMutation' }),
  graphql(modifyIsolatedMargin, { name: 'modifyIsolatedMarginMutation' }),
  graphql(setPositionWasClosed, { name: 'setPositionWasClosedMutation' }),
  queryRendererHoc({
    query: getActivePositions,
    name: `getActivePositionsQuery`,
    fetchPolicy: 'cache-and-network',
    withOutSpinner: false,
    withTableLoader: false,
    showLoadingWhenQueryParamsChange: false,
    variables: (props: any) => ({
      input: {
        keyId: props.selectedKey.keyId,
        allKeys: props.showPositionsFromAllAccounts,
        ...(!props.showAllPositionPairs
          ? {}
          : { specificPair: props.currencyPair }),
      },
    }),
    subscriptionArgs: {
      subscription: FUTURES_POSITIONS,
      variables: (props: any) => ({
        input: {
          keyId: props.selectedKey.keyId,
          allKeys: props.showPositionsFromAllAccounts,
          ...(!props.showAllPositionPairs
            ? {}
            : { specificPair: props.currencyPair }),
        },
      }),
      updateQueryFunction: updateActivePositionsQuerryFunction,
    },
  }),
)(PositionsTable)

export default React.memo(
  PositionsTableWrapper,
  (prevProps: any, nextProps: any) => {


    // TODO: Refactor isShowEqual --- not so clean
    const isShowEqual = !nextProps.show && !prevProps.show
    const showAllAccountsEqual =
      prevProps.showPositionsFromAllAccounts ===
      nextProps.showPositionsFromAllAccounts
    const showAllPairsEqual =
      prevProps.showAllPositionPairs === nextProps.showAllPositionPairs
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
  }
)

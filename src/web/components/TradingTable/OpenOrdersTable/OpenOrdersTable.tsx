import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import {
  combineOpenOrdersTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { useOpenOrders } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { cancelOrder } from '@sb/dexUtils/send'

const OpenOrdersTable = (props) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const onCancelOrder = async (order) => {
    try {
      await cancelOrder({
        order,
        market: order.market,
        connection,
        wallet,
        signers: [],
      })
    } catch (e) {
      notify({
        message: 'Error cancelling order',
        description: e.message,
        type: 'error',
      })

      return
    }
  }

  const cancelOrderWithStatus = async (order) => {
    const { showCancelResult } = props

    // await props.addOrderToCanceled(orderId)
    const result = await onCancelOrder(order)
    // const status = await cancelOrderStatus(result)

    // if (status.result === 'error') {
    //   await props.clearCanceledOrders()
    // }

    // showCancelResult(status)
  }

  const {
    tab,
    theme,
    show,
    marketType,
    arrayOfMarketIds,
    canceledOrders,
    handlePairChange,
    keys,
  } = props

  const openOrders = useOpenOrders()

  if (!show) {
    return null
  }

  const openOrdersProcessedData = combineOpenOrdersTable(
    openOrders,
    cancelOrderWithStatus,
    theme,
    arrayOfMarketIds,
    marketType,
    canceledOrders,
    keys,
    handlePairChange
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
        overflowX: 'hidden',
        backgroundColor: 'inherit',
      }}
      stylesForTable={{ backgroundColor: 'inherit' }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        cell: {
          color: theme.palette.dark.main,
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          backgroundColor: 'inherit',
          boxShadow: 'none',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      data={{ body: openOrdersProcessedData }}
      columnNames={getTableHead(tab, marketType)}
    />
  )
  // }
}

const MemoizedWrapper = React.memo(OpenOrdersTable, (prevProps, nextProps) => {
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
})

export default MemoizedWrapper

import React from 'react'
import { TableWithSort } from '@sb/components'

import {
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { useOpenOrders } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { cancelOrder } from '@sb/dexUtils/send'
import { combineOpenOrdersTable } from './OpenOrdersTable.utils'

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
    await onCancelOrder(order)
  }

  const {
    tab,
    theme,
    show,
    marketType,
    canceledOrders,
    handlePairChange,
    openOrders,
    styles = {},
    stylesForTable = {},
    tableBodyStyles = {}
  } = props


  if (!show) {
    return null
  }

  const openOrdersProcessedData = combineOpenOrdersTable(
    openOrders,
    cancelOrderWithStatus,
    theme,
    marketType,
    canceledOrders,
    handlePairChange
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
        overflowX: 'hidden',
        backgroundColor: 'inherit',
        ...styles
      }}
      stylesForTable={{ backgroundColor: 'inherit', ...stylesForTable }}
      tableBodyStyles={{ ...tableBodyStyles }}
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
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType

  if (isShowEqual && isMarketIsEqual) {
    return true
  }

  return false
})

export default MemoizedWrapper

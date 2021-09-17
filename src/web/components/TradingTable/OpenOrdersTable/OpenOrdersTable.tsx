import React from 'react'
import { TableWithSort } from '@sb/components'

import { getEmptyTextPlaceholder } from '@sb/components/TradingTable/TradingTable.utils'

import { notify } from '@sb/dexUtils/notifications'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { cancelOrder } from '@sb/dexUtils/send'
import { combineOpenOrdersTable } from './OpenOrdersTable.utils'
import { openOrdersColumnNames } from '../TradingTable.mocks'

const OpenOrdersTable = (props) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const {
    tab,
    theme,
    show,
    handlePairChange,
    openOrders,
    onCancelAll,
    isCancellingAllOrders,
    cancelOrderCallback = () => {},
    styles = {},
    stylesForTable = {},
    tableBodyStyles = {},
  } = props

  const onCancelOrder = async (order) => {
    try {
      await cancelOrder({
        order,
        market: order.market,
        connection,
        wallet,
        signers: [],
      })
      cancelOrderCallback()
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

  if (!show) {
    return null
  }

  const showCancelAllButton = !!onCancelAll

  const openOrdersProcessedData = combineOpenOrdersTable(
    openOrders,
    cancelOrderWithStatus,
    theme,
    handlePairChange,
    isCancellingAllOrders,
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 'auto',
        height: 'calc(100% - 6rem)',
        overflowX: 'hidden',
        backgroundColor: 'inherit',
        ...styles,
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
        heading: {
          backgroundColor: '#222429',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      data={{ body: openOrdersProcessedData }}
      columnNames={openOrdersColumnNames(showCancelAllButton, onCancelAll)}
    />
  )
}

export default OpenOrdersTable

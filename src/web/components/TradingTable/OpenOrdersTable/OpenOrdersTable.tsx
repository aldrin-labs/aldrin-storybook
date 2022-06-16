import React from 'react'
import { useTheme } from 'styled-components'

import { TableWithSort } from '@sb/components'
import { getEmptyTextPlaceholder } from '@sb/components/TradingTable/TradingTable.utils'
import { useConnection } from '@sb/dexUtils/connection'
import { notify } from '@sb/dexUtils/notifications'
import { cancelOrder } from '@sb/dexUtils/send'
import { useWallet } from '@sb/dexUtils/wallet'

import { openOrdersColumnNames } from '../TradingTable.mocks'
import { combineOpenOrdersTable } from './OpenOrdersTable.utils'

const OpenOrdersTable = (props) => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const theme = useTheme()

  const {
    tab,
    show,
    handlePairChange,
    openOrders,
    onCancelAll,
    isCancellingAllOrders,
    cancelOrderCallback = () => {},
    styles = {},
    stylesForTable = {},
    tableBodyStyles = {},
    dexTokensPrices,
    needShowValue = false,
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
    needShowValue
  )

  return (
    <TableWithSort
      style={{
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
          color: theme.colors.gray1,
          fontSize: '1.2rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.colors.gray5,
          backgroundColor: 'inherit',
          boxShadow: 'none',
          fontFamily: 'Avenir Next Light',
        },
        heading: {
          backgroundColor: theme.colors.gray6,
          fontSize: '1.3rem',
          borderRadius: 'none',
          color: theme.colors.gray1,
          borderBottom: `0.1rem solid ${theme.colors.gray5}`,
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

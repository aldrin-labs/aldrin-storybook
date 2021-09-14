import React from 'react'
import { TableWithSort } from '@sb/components'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import {
  combineUnsettledBalances,
  UnsettledBalance,
  UnsettledBalancesColumnNames,
} from './UnsettledBalancesTable.utils'
import { Market, OpenOrders } from '@project-serum/serum'
import { settleFunds } from '@sb/dexUtils/send'
import { notify } from '@sb/dexUtils/notifications'
import { Theme } from '@material-ui/core'

const UnsettledBalancesTable = ({ theme, userTokenAccounts }: {theme: Theme}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  async function onSettleFunds({
    market,
    marketName,
    openOrders,
    baseUnsettled,
    quoteUnsettled
  }: UnsettledBalance) {
    const [baseCurrency, quoteCurrency] = marketName.split('/')
    try {
      await settleFunds({
        market,
        openOrders,
        connection,
        wallet,
        baseCurrency,
        quoteCurrency,
        baseTokenAccount,
        quoteTokenAccount,
        baseUnsettled,
        quoteUnsettled,
      })

      await notify({
        message: 'Successfully settled funds',
        type: 'success',
      })
    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      })
      return
    }
  }

  const unsettledBalancesProcessedData = combineUnsettledBalances({
    onSettleFunds,
    theme,
    unsettledBalances: [],
  })

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
      emptyTableText={'All your balances are settled.'}
      data={{ body: unsettledBalancesProcessedData }}
      columnNames={UnsettledBalancesColumnNames}
    />
  )
  // }
}

export default UnsettledBalancesTable

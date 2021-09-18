import React from 'react'
import { TableWithSort } from '@sb/components'

import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import {
  combineUnsettledBalances,
  getUnsettledBalancesColumnNames,
  UnsettledBalance,
} from './UnsettledBalancesTable.utils'

import { settleFunds } from '@sb/dexUtils/send'
import { notify } from '@sb/dexUtils/notifications'
import { Theme } from '@material-ui/core'
import { TokenAccount } from '@sb/dexUtils/markets'

const UnsettledBalancesTable = ({
  theme,
  userTokenAccountsMap,
  unsettledBalances,
  isSettlingAllBalances,
  onSettleAll,
  refreshUnsettledBalances,
}: {
  theme: Theme
  userTokenAccountsMap: Map<string, TokenAccount>
  unsettledBalances: UnsettledBalance[]
  isSettlingAllBalances: boolean
  onSettleAll: () => void
  refreshUnsettledBalances: () => void
}) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  async function onSettleFunds({
    market,
    marketName,
    openOrders,
    baseUnsettled,
    quoteUnsettled,
  }: UnsettledBalance) {
    const [baseCurrency, quoteCurrency] = marketName.split('_')

    const baseTokenAccount = userTokenAccountsMap.get(
      market.baseMintAddress.toString()
    )
    const quoteTokenAccount = userTokenAccountsMap.get(
      market.quoteMintAddress.toString()
    )

    try {
      const result = await settleFunds({
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

      await refreshUnsettledBalances()

      return result
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
    unsettledBalances,
    isSettlingAllBalances,
  })

  return (
    <TableWithSort
      style={{
        overflowX: 'hidden',
      }}
      stylesForTable={{
        backgroundColor: '#222429',
        height: '100%',
      }}
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
          paddingTop: '1rem',
          paddingBottom: '1rem',
          fontFamily: 'Avenir Next Medium',
        },
        heading: {
          backgroundColor: '#222429',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={'All your balances are settled.'}
      data={{ body: unsettledBalancesProcessedData }}
      columnNames={getUnsettledBalancesColumnNames({ theme, onSettleAll })}
    />
  )
  // }
}

export default UnsettledBalancesTable

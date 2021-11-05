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
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'

export const UnsettledBalancesTable = ({
  theme,
  userTokenAccountsMap,
  unsettledBalances,
  isSettlingAllBalances,
  dexTokensPrices,
  onSettleAll,
  refreshUnsettledBalances,
}: {
  theme: Theme
  userTokenAccountsMap: Map<string, TokenAccount>
  unsettledBalances: UnsettledBalance[]
  isSettlingAllBalances: boolean
  dexTokensPrices: Map<string, DexTokensPrices>
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
        message: 'Insufficient SOL balance for settling.',
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
    dexTokensPrices,
  })

  return (
    <TableWithSort
      style={{
        overflowX: 'hidden',
        height: '100%',
        background: 'inherit',
      }}
      stylesForTable={{
        backgroundColor: '#222429',
      }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        cell: {
          color: theme.palette.dark.main,
          fontSize: '1.2rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          backgroundColor: 'inherit',
          boxShadow: 'none',
          paddingTop: '1rem',
          paddingBottom: '1rem',
          fontFamily: 'Avenir Next Light',
        },
        heading: {
          backgroundColor: '#222429',
          fontSize: '1.3rem', // 1.2 if bold
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

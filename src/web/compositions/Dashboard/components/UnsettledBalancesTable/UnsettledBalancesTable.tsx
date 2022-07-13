import React from 'react'
import { DefaultTheme } from 'styled-components'

import { TableWithSort } from '@sb/components'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'
import { TokenAccount } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { settleFunds } from '@sb/dexUtils/send'
import { useWallet } from '@sb/dexUtils/wallet'

import {
  combineUnsettledBalances,
  getUnsettledBalancesColumnNames,
  UnsettledBalance,
} from './UnsettledBalancesTable.utils'

export const UnsettledBalancesTable = ({
  theme,
  userTokenAccountsMap,
  unsettledBalances,
  isSettlingAllBalances,
  dexTokensPrices,
  onSettleAll,
  refreshUnsettledBalances,
}: {
  theme: DefaultTheme
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
        background: theme.colors.white5,
      }}
      stylesForTable={{ backgroundColor: theme.colors.white4 }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        cell: {
          color: theme.colors.white1,
          fontSize: '1.2rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.colors.white4,
          backgroundColor: 'inherit',
          boxShadow: 'none',
          fontFamily: 'Avenir Next Light',
        },
        heading: {
          backgroundColor: theme.colors.white5,
          fontSize: '1.3rem',
          borderRadius: 'none',
          color: theme.colors.white1,
          borderBottom: `0.1rem solid ${theme.colors.white4}`,
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText="All your balances are settled."
      data={{ body: unsettledBalancesProcessedData }}
      columnNames={getUnsettledBalancesColumnNames({ theme, onSettleAll })}
    />
  )
  // }
}

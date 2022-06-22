import React from 'react'
import { useTheme } from 'styled-components'

import { TableWithSort } from '@sb/components'
import {
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'
import { useConnection } from '@sb/dexUtils/connection'
import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { settleFunds } from '@sb/dexUtils/send'
import { RINProviderURL } from '@sb/dexUtils/utils'
import { useWallet } from '@sb/dexUtils/wallet'

import { combineBalancesTable } from './Balances.utils'

const BalancesTable = (props) => {
  const { tab, show, marketType } = props
  const theme = useTheme()
  const balances = useBalances()
  const connection = useConnection()

  const { wallet, providerUrl } = useWallet()
  const { market, baseCurrency, quoteCurrency } = useMarket()

  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()

  const isCCAIWallet = providerUrl === RINProviderURL
  const showSettle = !isCCAIWallet || !wallet.connected || !wallet.autoApprove

  async function onSettleFunds(market, openOrders) {
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
        baseUnsettled: balances[0].unsettled,
        quoteUnsettled: balances[1].unsettled,
      })

      await notify({
        message: 'Successfully settled funds',
        type: 'success',
      })
    } catch (e) {
      notify({
        message: 'Insufficient SOL balance for settling.',
        description: e.message,
        type: 'error',
      })
    }
  }

  if (!show) {
    return null
  }

  const balancesProcessedData = combineBalancesTable(
    balances,
    onSettleFunds,
    theme,
    showSettle
  )
  return (
    <TableWithSort
      rowsWithHover={false}
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
          color: theme.colors.gray1,
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: `0.1rem solid ${theme.colors.gray5}`,
          backgroundColor: 'inherit',
          boxShadow: 'none',
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
      data={{ body: balancesProcessedData }}
      columnNames={getTableHead(tab, marketType, showSettle)}
    />
  )
  // }
}

const MemoizedWrapper = React.memo(BalancesTable, (prevProps, nextProps) => {
  // TODO: Refactor isShowEqual --- not so clean
  const isShowEqual = !nextProps.show && !prevProps.show
  const isMarketIsEqual = prevProps.marketType === nextProps.marketType

  if (isShowEqual && isMarketIsEqual) {
    return true
  }

  return false
})

export default MemoizedWrapper

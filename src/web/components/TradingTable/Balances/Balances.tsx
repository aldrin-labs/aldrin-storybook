import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'

import {
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import {
  useBalances,
  useMarket,
  useSelectedBaseCurrencyAccount,
  useSelectedQuoteCurrencyAccount,
} from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { settleFunds } from '@sb/dexUtils/send'
import { CCAIProviderURL } from '@sb/dexUtils/utils'
import { combineBalancesTable } from './Balances.utils'

const BalancesTable = (props) => {
  const { tab, theme, show, page, perPage, marketType } = props

  const balances = useBalances()
  const connection = useConnection()

  const { wallet, providerUrl } = useWallet()
  const { market, baseCurrency, quoteCurrency } = useMarket()

  const baseTokenAccount = useSelectedBaseCurrencyAccount()
  const quoteTokenAccount = useSelectedQuoteCurrencyAccount()

  const isCCAIWallet = providerUrl === CCAIProviderURL
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
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      })
      return
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
      data={{ body: balancesProcessedData }}
      columnNames={getTableHead(tab, marketType, showSettle)}
    />
  )
  // }
}

const MemoizedWrapper = React.memo(BalancesTable, (prevProps, nextProps) => {
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

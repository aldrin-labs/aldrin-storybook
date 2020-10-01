import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'
import { useSnackbar } from 'notistack'

import {
  updateOpenOrderHistoryQuerryFunction,
  combineBalancesTable,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { useTokenAccounts, getSelectedTokenAccountForMint, useBalances } from '@sb/dexUtils/markets'
import { notify } from '@sb/dexUtils/notifications'
import { useSendConnection } from '@sb/dexUtils/connection'
import { useWallet } from '@sb/dexUtils/wallet'
import { settleFunds } from '@sb/dexUtils/send'

const OpenOrdersTable = (props) => {
  const {
    tab,
    theme,
    show,
    page,
    perPage,
    marketType,
    allKeys,
    specificPair,
    handleChangePage,
    handleChangeRowsPerPage,
    getOpenOrderHistoryQuery,
    handleToggleAllKeys,
    handleToggleSpecificPair,
    arrayOfMarketIds,
    canceledOrders,
    handlePairChange,
    keys
  } = props

  const balances = useBalances();
  const [accounts] = useTokenAccounts();
  const connection = useSendConnection();
  const { wallet } = useWallet();

  async function onSettleFunds(market, openOrders) {
    try {
      await settleFunds({
        market,
        openOrders,
        connection,
        wallet,
        baseCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.baseMintAddress,
        ),
        quoteCurrencyAccount: getSelectedTokenAccountForMint(
          accounts,
          market?.quoteMintAddress,
        ),
      });

      notify({
        message: 'Settling funds sucess',
        description: 'No description',
        type: 'success',
      });

    } catch (e) {
      notify({
        message: 'Error settling funds',
        description: e.message,
        type: 'error',
      });
      return;
    }
  }

  if (!show) {
    return null
  }

  const balancesProcessedData = combineBalancesTable(
    balances,
    onSettleFunds,
    theme
  )

  return (
    <TableWithSort
      style={{
        borderRadius: 0,
        height: 'calc(100% - 6rem)',
        overflowX: 'hidden',
        backgroundColor: theme.palette.white.background,
      }}
      stylesForTable={{ backgroundColor: theme.palette.white.background }}
      defaultSort={{
        sortColumn: 'date',
        sortDirection: 'desc',
      }}
      withCheckboxes={false}
      tableStyles={{
        headRow: {
          borderBottom: theme.palette.border.main,
          boxShadow: 'none',
        },
        heading: {
          fontSize: '1rem',
          fontWeight: 'bold',
          backgroundColor: theme.palette.grey.cream,
          color: theme.palette.dark.main,
          boxShadow: 'none',
        },
        cell: {
          color: theme.palette.dark.main,
          fontSize: '1rem', // 1.2 if bold
          fontWeight: 'bold',
          letterSpacing: '.1rem',
          borderBottom: theme.palette.border.main,
          backgroundColor: theme.palette.white.background,
          boxShadow: 'none',
        },
        tab: {
          padding: 0,
          boxShadow: 'none',
        },
      }}
      emptyTableText={getEmptyTextPlaceholder(tab)}
      data={{ body: balancesProcessedData }}
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

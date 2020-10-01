import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'
import { useSnackbar } from 'notistack'

import {
  updateOpenOrderHistoryQuerryFunction,
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'


export const combineFeeTiers = (
    dataSource
  ) => {
    const processedFundsData = dataSource
      .map((el) => {
        const {
            feeTier,
            taker,
          maker,
          token,
          balance,
        } = el
  
        return {
          id: `${feeTier}${balance}`,
          feeTier: `${feeTier}`,
          taker: `${taker} %`,
          maker: `${maker} %`,
          condition: {
            render: balance > 0 ? `>= ${balance} ${token}` : 'None',
            style: { textAlign: 'left' },
            contentToSort: +balance,
          },
        }
      })
  
    return processedFundsData.filter((el) => !!el)
  }

const FeeTiers = (props) => {
  const {
    tab,
    theme,
    show,
    page,
    perPage,
    marketType,
  } = props

  const dataSource = [
    { feeTier: 0, taker: 0.0022, maker: -0.0003, token: '', balance: '' },
    { feeTier: 1, taker: 0.002, maker: -0.0003, token: 'SRM', balance: 100 },
    { feeTier: 2, taker: 0.0018, maker: -0.0003, token: 'SRM', balance: 1000 },
    { feeTier: 3, taker: 0.0016, maker: -0.0003, token: 'SRM', balance: 10000 },
    {
      feeTier: 4,
      taker: 0.0014,
      maker: -0.0003,
      token: 'SRM',
      balance: 100000,
    },
    {
      feeTier: 5,
      taker: 0.0012,
      maker: -0.0003,
      token: 'SRM',
      balance: 1000000,
    },
    { feeTier: 6, taker: 0.001, maker: -0.0005, token: 'MSRM', balance: 1 },
  ];

  if (!show) {
    return null
  }

  const balancesProcessedData = combineFeeTiers(
    dataSource
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

const MemoizedWrapper = React.memo(FeeTiers, (prevProps, nextProps) => {
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

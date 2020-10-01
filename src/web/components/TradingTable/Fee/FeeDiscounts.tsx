import React, { useState } from 'react'
import { TableWithSort } from '@sb/components'
import { useSnackbar } from 'notistack'

import {
  getEmptyTextPlaceholder,
  getTableHead,
} from '@sb/components/TradingTable/TradingTable.utils'

import { useTokenAccounts, useFeeDiscountKeys, useBalances } from '@sb/dexUtils/markets'
import { TokenInstructions, getFeeRates } from '@project-serum/serum';
import { percentFormat } from '@sb/dexUtils/utils'

export const combineFeeDiscounts = (
    data,
    theme,
  ) => {

    if (!data && !Array.isArray(data)) {
        return []
      }

    const processedFundsData = data
      .map((el, i) => {
        const {
          feeTier,
          taker,
          maker,
          pubkey,
          balance,
          mint,
        } = el
  
        return {
          id: `${taker}${feeTier}${pubkey}`,
          tier: {
            render: <div style={{ display: 'flex' }}>
            <span>{feeTier}</span>
            {i === 0 ? (
              <div style={{ marginLeft: 10 }}>
                <span style={{ fontWeight: 700, color: theme.palette.green.main }}>
                  Selected
                </span>
              </div>
            ) : null}
          </div>,
          },
          taker: {
              render: percentFormat.format(getFeeRates(el.feeTier).taker),
          },
          maker: {
              render: percentFormat.format(getFeeRates(el.feeTier).maker),
          },
          pubkey: {
              render: pubkey.toBase58(),
          },
          balance: `${balance}`,
          mint: {
              render: mint.equals(TokenInstructions.SRM_MINT)
              ? 'SRM'
              : mint.equals(TokenInstructions.MSRM_MINT)
              ? 'MSRM'
              : 'UNKNOWN',
          }
        }
      })
  
    return processedFundsData.filter((el) => !!el)
  }

const FeeDiscounts = (props) => {
  const {
    tab,
    theme,
    show,
    page,
    perPage,
    marketType,
  } = props

  const [feeAccounts] = useFeeDiscountKeys();

  if (!show) {
    return null
  }

  const feeDiscountProcessedData = combineFeeDiscounts(
    feeAccounts,
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
      data={{ body: feeDiscountProcessedData }}
      columnNames={getTableHead(tab, marketType)}
    />
  )
  // }
}

const MemoizedWrapper = React.memo(FeeDiscounts, (prevProps, nextProps) => {
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

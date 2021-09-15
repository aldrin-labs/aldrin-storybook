import React from 'react'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { Theme } from '@material-ui/core'
import { Market, OpenOrders } from '@project-serum/serum'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

export const UnsettledBalancesColumnNames = [
  { label: 'Market', id: 'marketName' },
  { label: 'Base unsettled', id: 'baseUnsettled' },
  { label: 'Quote unsettled', id: 'quoteUnsettled' },
  { label: 'Settle', id: 'settle', isNumber: true },
]

export type UnsettledBalance = {
  market: Market
  marketName: string
  openOrders: OpenOrders
  baseUnsettled: number
  quoteUnsettled: number
}

export const combineUnsettledBalances = ({
  unsettledBalances,
  onSettleFunds,
  theme,
}: {
  unsettledBalances: UnsettledBalance[]
  onSettleFunds: (unsettledBalances: UnsettledBalance) => void
  theme: Theme
}) => {
  if (!unsettledBalances && !Array.isArray(unsettledBalances)) {
    return []
  }

  const processedUnsettledBalances = unsettledBalances.map(
    (el: UnsettledBalance) => {
      const { market, marketName, baseUnsettled, quoteUnsettled } = el

      const [base, quote] = marketName.split('_')

      return {
        id: `${marketName}${baseUnsettled}${quoteUnsettled}`,
        marketName: {
          render: marketName.replace('_', '/') || 'unknown',
          showOnMobile: false,
        },
        baseUnsettled: {
          render: `${roundAndFormatNumber(baseUnsettled, 8, true)} ${base}` || '0',
          style: { textAlign: 'left' },
          contentToSort: +baseUnsettled,
          showOnMobile: false,
        },
        quoteUnsettled: {
          render: `${roundAndFormatNumber(quoteUnsettled, 8, true)} ${quote}` || '0',
          style: { textAlign: 'left' },
          contentToSort: +quoteUnsettled,
          showOnMobile: false,
        },
        settle: {
          render: (
            <BtnCustom
              disabled={!market}
              onClick={() => onSettleFunds(el)}
              btnColor={theme.palette.green.main}
              btnWidth={'8rem'}
              height={'100%'}
              textTransform={'capitalize'}
            >
              Settle
            </BtnCustom>
          ),
          showOnMobile: false,
          style: { textAlign: 'right' },
        },
      }
    }
  )

  return processedUnsettledBalances.filter((el) => !!el)
}

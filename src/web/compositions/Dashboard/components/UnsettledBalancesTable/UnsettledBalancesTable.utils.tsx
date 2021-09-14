import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { Theme } from '@material-ui/core'
import { Market, OpenOrders } from '@project-serum/serum'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'

export const UnsettledBalancesColumnNames = [
  { label: 'Market', id: 'marketName' },
  { label: 'Base unsettled', id: 'baseUnsettled' },
  { label: 'Quote unsettled', id: 'quoteUnsettled' },
  { label: 'Settle', id: 'settle' },
]

export type UnsettledBalance = {
  market?: Market
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
  onSettleFunds: (market: Market, openOrders: OpenOrders) => void
  theme: Theme
}) => {
  if (!unsettledBalances && !Array.isArray(unsettledBalances)) {
    return []
  }

  const processedUnsettledBalances = unsettledBalances.map(
    (el: UnsettledBalance) => {
      const {
        market,
        marketName,
        baseUnsettled,
        quoteUnsettled,
        openOrders,
      } = el

      return {
        id: `${marketName}${baseUnsettled}${quoteUnsettled}`,
        marketName: { render: marketName || 'unknown', showOnMobile: false },
        baseUnsettled: {
          render: roundAndFormatNumber(baseUnsettled, 8, true) || '0',
          style: { textAlign: 'left' },
          contentToSort: +baseUnsettled,
          showOnMobile: false,
        },
        quoteUnsettled: {
          render: roundAndFormatNumber(quoteUnsettled, 8, true) || '0',
          style: { textAlign: 'left' },
          contentToSort: +quoteUnsettled,
          showOnMobile: false,
        },
        settle: {
          render: (
            <BtnCustom
              type="text"
              size="large"
              disabled={!market}
              onClick={() => onSettleFunds(market, openOrders)}
              btnColor={theme.palette.blue.serum}
              btnWidth={'14rem'}
              height={'100%'}
            >
              Settle
            </BtnCustom>
          ),
          showOnMobile: false,
        },
      }
    }
  )

  return processedUnsettledBalances.filter((el) => !!el)
}

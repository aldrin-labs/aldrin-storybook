import React, { useState } from 'react'
import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { Theme } from '@material-ui/core'
import { Market, OpenOrders } from '@project-serum/serum'
import { BtnCustom } from '@sb/components/BtnCustom/BtnCustom.styles'
import { Loading } from '@sb/components'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { StyledTitle } from '@sb/components/TradingTable/TradingTable.styles'
import { DexTokensPrices } from '@sb/compositions/Pools/index.types'

const SettleButton = ({
  theme,
  el,
  onSettleFunds,
  showLoader,
}: {
  theme: Theme
  el: UnsettledBalance
  onSettleFunds: (
    unsettledBalances: UnsettledBalance
  ) => Promise<string | null | undefined>
  showLoader: boolean
}) => {
  const [isBalancesSettling, setIsBalancesSettling] = useState(false)
  return (
    <BtnCustom
      key={`${el.marketName}${el.baseUnsettled}${el.quoteUnsettled}`}
      onClick={async () => {
        setIsBalancesSettling(true)

        try {
          const result = await onSettleFunds(el)
          if (!result) {
            // remove loader if error inside and no result
            setIsBalancesSettling(false)
          }
        } catch (e) {
          setIsBalancesSettling(false)
        }
      }}
      btnColor={theme.palette.green.main}
      btnWidth={'10rem'}
      height={'3.5rem'}
      borderRadius={'1.8rem'}
      textTransform={'capitalize'}
      fontSize={'1.2rem'}
    >
      {isBalancesSettling || showLoader ? (
        <div>
          <Loading size={16} style={{ height: '16px' }} />
        </div>
      ) : (
        'Settle'
      )}
    </BtnCustom>
  )
}

export const getUnsettledBalancesColumnNames = ({
  theme,
  onSettleAll,
}: {
  theme: Theme
  onSettleAll: () => void
}) => [
  { label: 'Market', id: 'marketName' },
  { label: 'Base unsettled', id: 'baseUnsettled' },
  { label: 'Base value', id: 'baseValue' },
  { label: 'Quote unsettled', id: 'quoteUnsettled' },
  { label: 'Quote value', id: 'quoteValue' },
  {
    label: (
      <BtnCustom
        onClick={() => onSettleAll()}
        btnColor={theme.palette.green.main}
        btnWidth={'12rem'}
        height={'3.5rem'}
        borderRadius={'1.8rem'}
        textTransform={'capitalize'}
        fontSize={'1.2rem'}
        margin={'1rem 0'}
      >
        Settle All
      </BtnCustom>
    ),
    id: 'settle',
    isNumber: true,
  },
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
  isSettlingAllBalances,
  onSettleFunds,
  dexTokensPrices,
  theme,
}: {
  unsettledBalances: UnsettledBalance[]
  isSettlingAllBalances: boolean
  onSettleFunds: (
    unsettledBalances: UnsettledBalance
  ) => Promise<string | null | undefined>
  dexTokensPrices: Map<string, DexTokensPrices>
  theme: Theme
}) => {
  if (!unsettledBalances && !Array.isArray(unsettledBalances)) {
    return []
  }

  const processedUnsettledBalances = unsettledBalances.map(
    (el: UnsettledBalance) => {
      const { market, marketName, baseUnsettled, quoteUnsettled } = el

      const [base, quote] = marketName.split('_')

      const baseValue = baseUnsettled * dexTokensPrices?.get(base)?.price

      const quoteValue = quoteUnsettled * dexTokensPrices?.get(quote)?.price

      return {
        id: `${marketName}${baseUnsettled}${quoteUnsettled}`,
        marketName: {
          render: marketName.replace('_', '/') || 'unknown',
          showOnMobile: false,
        },
        columnForMobile: {
          render: (
            <RowContainer height={'20rem'} padding={'0 2rem'}>
              <RowContainer style={{ width: '40%' }} direction={'column'}>
                <RowContainer justify={'flex-start'}>
                  <StyledTitle color={'#fbf2f2'}>
                    {marketName.replace('_', '/')}
                  </StyledTitle>
                </RowContainer>
                <RowContainer justify={'space-between'}>
                  <StyledTitle>Base unsettled:</StyledTitle>
                  <StyledTitle color={'#fbf2f2'}>
                    {`${roundAndFormatNumber(baseUnsettled, 8, true)} ${base}`}
                  </StyledTitle>
                </RowContainer>
                <RowContainer justify={'space-between'}>
                  <StyledTitle>Quote unsettled:</StyledTitle>
                  <StyledTitle color={'#fbf2f2'}>
                    {`${roundAndFormatNumber(
                      quoteUnsettled,
                      8,
                      true
                    )} ${quote}`}
                  </StyledTitle>
                </RowContainer>
              </RowContainer>

              <RowContainer style={{ width: '60%' }} justify={'flex-end'}>
                <SettleButton
                  theme={theme}
                  el={el}
                  onSettleFunds={onSettleFunds}
                  showLoader={isSettlingAllBalances}
                />
              </RowContainer>
            </RowContainer>
          ),
          showOnMobile: true,
        },
        baseUnsettled: {
          render: `${roundAndFormatNumber(baseUnsettled, 8, true)} ${base}`,
          style: { textAlign: 'left' },
          contentToSort: +baseUnsettled,
          showOnMobile: false,
        },
        baseValue: {
          render: dexTokensPrices?.get(base)?.price
            ? `$${roundAndFormatNumber(baseValue, 8, true)}`
            : '-',
          style: { textAlign: 'left' },
          contentToSort: +quoteUnsettled,
          showOnMobile: false,
        },
        quoteUnsettled: {
          render: `${roundAndFormatNumber(quoteUnsettled, 8, true)} ${quote}`,
          style: { textAlign: 'left' },
          contentToSort: +quoteUnsettled,
          showOnMobile: false,
        },
        quoteValue: {
          render: dexTokensPrices?.get(quote)?.price
            ? `$${roundAndFormatNumber(quoteValue, 8, true)}`
            : '-',
          style: { textAlign: 'left' },
          contentToSort: +quoteUnsettled,
          showOnMobile: false,
        },
        settle: {
          render: (
            <SettleButton
              theme={theme}
              el={el}
              onSettleFunds={onSettleFunds}
              showLoader={isSettlingAllBalances}
            />
          ),
          showOnMobile: false,
          style: { textAlign: 'right' },
        },
      }
    }
  )

  return processedUnsettledBalances.filter((el) => !!el)
}

import React, { useMemo } from 'react'
import { compose } from 'recompose'

import { FlexBlock } from '@sb/components/Layout'
import { TokenIconWithName } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { useUserTokenAccounts } from '@sb/dexUtils/token/hooks'
import { toMap } from '@sb/utils'

import { queryRendererHoc } from '@core/components/QueryRenderer'
import { getDexTokensPrices } from '@core/graphql/queries/pools/getDexTokensPrices'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import { TokenBLock } from './styles'
import { PortfolioPropsInner, PortfolioPropsOuter } from './types'

export const resolveDiffColor = (diff: number) => {
  if (diff > 0) {
    return 'success'
  }
  if (diff < 0) {
    return 'error'
  }

  return 'primaryWhite'
}

const Portfolio: React.FC<PortfolioPropsInner & PortfolioPropsOuter> = (
  props
) => {
  const {
    dexTokenPrices: { getDexTokensPrices: prices },
    tokensList,
  } = props

  const tokensMap = useMemo(
    () => toMap(tokensList, (token) => token.mint),
    [tokensList]
  )

  const pricesMap = useMemo(
    () => toMap(prices, (p) => p.symbol.toLowerCase()),
    [getDexTokensPrices]
  )
  const [userTokens] = useUserTokenAccounts()

  const resolvedTokens = userTokens
    .map((token) => {
      const price = pricesMap.get(token.symbol.toLowerCase())?.price || 0
      const usdValue = price * token.amount
      const priceDiffPct = tokensMap.get(token.mint)?.priceDiffPct || 0
      return { ...token, price, usdValue, priceDiffPct }
    })
    .sort((a, b) => b.usdValue - a.usdValue)

  return (
    <>
      {resolvedTokens.map((token) => (
        <TokenBLock key={`hot_token_${token.address}`}>
          <FlexBlock alignItems="center" direction="row">
            <TokenIconWithName mint={token.mint} />
          </FlexBlock>
          <FlexBlock direction="column" alignItems="flex-end">
            <InlineText size="sm" color={resolveDiffColor(token.priceDiffPct)}>
              ${stripByAmountAndFormat(token.usdValue)}
            </InlineText>
            <InlineText size="sm" weight={600}>
              {stripByAmountAndFormat(token.amount)}
            </InlineText>
          </FlexBlock>
        </TokenBLock>
      ))}
    </>
  )
}

export const TokensPortolio = compose<PortfolioPropsInner, PortfolioPropsOuter>(
  queryRendererHoc({
    query: getDexTokensPrices,
    name: 'dexTokenPrices',
    fetchPolicy: 'cache-and-network',
    withoutLoading: true,
    pollInterval: 60_000,
  })
)(Portfolio)

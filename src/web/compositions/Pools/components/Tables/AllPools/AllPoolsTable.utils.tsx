import { roundAndFormatNumber } from '@core/utils/PortfolioTableUtils'
import { StyledTitle } from '@sb/components/TradingTable/TradingTable.styles'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { Theme } from '@sb/types/materialUI'
import React from 'react'
import { TokenIconsContainer } from '../components'
import { mock } from './AllPoolsTable'

export const allPoolsTableColumnsNames = [
  { label: 'Pool', id: 'pool' },
  { label: 'Total Value Locked', id: 'tvl' },
  { label: 'Volume 24h', id: 'vol24h' },
  { label: 'Volume 7d', id: 'vol7d' },
  { label: 'Fees 24h', id: 'fees' },
  { label: 'APY 24h', id: 'apy' },
  { label: 'Farming', id: 'farming' },
]

export type Pools = {}

export const combineAllPoolsData = ({
  theme,
  dexTokensPrices,
  feesPerPoolMap,
}: {
  theme: Theme
  dexTokensPrices: any
  feesPerPoolMap: any
}) => {
  const processedAllPoolsData = mock
    .sort((poolA: PoolInfo, poolB: PoolInfo) => {
      const [poolABaseTokenPrice, poolBBaseTokenPrice] = [
        dexTokensPrices.find(
          (tokenInfo) =>
            tokenInfo.symbol === getTokenNameByMintAddress(poolA.tokenA)
        )?.price || 10,
        dexTokensPrices.find(
          (tokenInfo) =>
            tokenInfo.symbol === getTokenNameByMintAddress(poolB.tokenA)
        )?.price || 10,
      ]

      const [poolAQuoteTokenPrice, poolBQuoteTokenPrice] = [
        dexTokensPrices.find(
          (tokenInfo) =>
            tokenInfo.symbol === getTokenNameByMintAddress(poolA.tokenB)
        )?.price || 10,
        dexTokensPrices.find(
          (tokenInfo) =>
            tokenInfo.symbol === getTokenNameByMintAddress(poolB.tokenB)
        )?.price || 10,
      ]

      const poolATvlUSD =
        poolABaseTokenPrice * poolA.tvl.tokenA +
        poolAQuoteTokenPrice * poolA.tvl.tokenB

      const poolBTvlUSD =
        poolBBaseTokenPrice * poolB.tvl.tokenA +
        poolBQuoteTokenPrice * poolB.tvl.tokenB

      return poolBTvlUSD - poolATvlUSD
    })
    .map((el) => {
      const baseSymbol = getTokenNameByMintAddress(el.tokenA)
      const quoteSymbol = getTokenNameByMintAddress(el.tokenB)

      const baseTokenPrice =
        dexTokensPrices.find((tokenInfo) => tokenInfo.symbol === baseSymbol)
          ?.price || 10

      const quoteTokenPrice =
        dexTokensPrices.find((tokenInfo) => tokenInfo.symbol === quoteSymbol)
          ?.price || 10

      const tvlUSD =
        baseTokenPrice * el.tvl.tokenA + quoteTokenPrice * el.tvl.tokenB

      const fees = feesPerPoolMap.get(el.swapToken) || 0
      const apy = el.apy24h || 0
      return {
        pool: {
          render: (
            <div style={{ width: '15rem' }}>
              <TokenIconsContainer tokenA={el.tokenA} tokenB={el.tokenB} />
            </div>
          ),
        },
        tvl: {
          render: tvlUSD,
          showOnMobile: false,
        },
        vol24h: {
          render: '3',
          style: { textAlign: 'left' },
          contentToSort: '',
          showOnMobile: false,
        },
        fees: { render: fees },
        vol7d: {
          render: '43',
          style: { textAlign: 'left' },
          contentToSort: '',
          showOnMobile: false,
        },
        apy: { render: apy },
        farming: { render: '0' },
      }
    })

  return processedAllPoolsData.filter((el) => !!el)
}

import React from 'react'
import { Link } from 'react-router-dom'

import { SvgIcon } from '@sb/components'
import { FlexBlock } from '@sb/components/Layout'
import { ShareButton } from '@sb/components/ShareButton'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { InlineText } from '@sb/components/Typography'
import { getTokenName, getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'

import { filterOpenFarmingStates } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'

import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats,
} from '../../index.types'
import { FarmingRewards } from '../FarminRewards'
import { getFarmingStateDailyFarmingValue } from '../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import SwapIcon from './icons/swapIcon.svg'
import {
  ButtonsContainer,
  FarmingData,
  PoolInfoBlock,
  PoolName,
  PoolRow,
  PoolStatsData,
  PoolStatsRow,
  PoolStatsText,
  PoolStatsTitle,
  PoolStatsWrap,
  SwapButton,
  SwapButtonIcon,
  TokenIcons,
  TokenNames,
  TokenSymbols,
} from './styles'
import { PoolStatsProps } from './types'

export const PoolStats: React.FC<PoolStatsProps> = (props) => {
  const { title, value, additionalInfo } = props
  const roundedValue = Math.round(value * 100) / 100
  return (
    <PoolStatsWrap>
      <PoolStatsTitle>{title}</PoolStatsTitle>
      <PoolStatsData>
        <PoolStatsText>
          <DarkTooltip
            title={`$${formatNumberToUSFormat(roundedValue.toFixed(2))}`}
          >
            <span>
              {value > 0 ? `$${stripByAmountAndFormat(roundedValue, 2)}` : '-'}
            </span>
          </DarkTooltip>
        </PoolStatsText>
        {additionalInfo ? (
          <InlineText weight={300} color="gray2" size="sm">
            {additionalInfo}
          </InlineText>
        ) : null}
      </PoolStatsData>
    </PoolStatsWrap>
  )
}

interface PoolStatsBlockProps {
  pool: PoolInfo
  tradingVolumes: Map<string, TradingVolumeStats>
  baseUsdPrice: number
  quoteUsdPrice: number
  fees: FeesEarned[]
  prices: Map<string, DexTokensPrices>
}

export const trimTo = (str: string, maxLength = 13) => {
  const trimmedSuffix = '...'
  const trLength = trimmedSuffix.length

  if (str.length > maxLength + trLength) {
    return `${str.substr(0, maxLength)}${trimmedSuffix}`
  }

  return str
}

export const PoolStatsBlock: React.FC<PoolStatsBlockProps> = (props) => {
  const { tradingVolumes, pool, fees, baseUsdPrice, quoteUsdPrice, prices } =
    props

  const tokenMap = useTokenInfos()

  const tradingVolume = tradingVolumes.get(pool.swapToken) || {
    dailyTradingVolume: 0,
    weeklyTradingVolume: 0,
  }

  const feesForPool = fees.find((f) => f.pool === pool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const base = getTokenName({ address: pool.tokenA, tokensInfoMap: tokenMap })
  const quote = getTokenName({ address: pool.tokenB, tokensInfoMap: tokenMap })

  const feesUsd =
    feesForPool.totalBaseTokenFee * baseUsdPrice +
    feesForPool.totalQuoteTokenFee * quoteUsdPrice

  const tvlUsd =
    pool.tvl.tokenA * baseUsdPrice + pool.tvl.tokenB * quoteUsdPrice

  const baseTokenInfo = tokenMap.get(pool.tokenA)
  const quoteTokenInfo = tokenMap.get(pool.tokenB)

  const baseTokenName = trimTo(baseTokenInfo?.name || '')
  const quoteTokenName = trimTo(quoteTokenInfo?.name || '')

  const lpTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap: prices,
  })

  const farmingUsdValue = Math.max(
    lpTokenPrice * pool.lpTokenFreezeVaultBalance,
    1000
  ) // When no liquidity staked - estimate APR for $1000

  const farmings = filterOpenFarmingStates(pool.farming || [])

  const dailyUsdReward = farmings.reduce((acc, farmingState) => {
    const dailyRewardPerThousand = getFarmingStateDailyFarmingValue({
      farmingState,
      totalStakedLpTokensUSD: farmingUsdValue,
    })

    const farmingTokenSymbol = getTokenNameByMintAddress(
      farmingState.farmingTokenMint
    )

    const farmingTokenPrice = prices.get(farmingTokenSymbol)?.price || 0

    const dailyUsdRewardPerThousand = dailyRewardPerThousand * farmingTokenPrice

    return acc + dailyUsdRewardPerThousand
  }, 0)

  const farmingAPR = ((dailyUsdReward * 365) / farmingUsdValue) * 100 || 0
  const feesAPR = pool.apy24h || 0

  const totalApr = farmingAPR + feesAPR

  const aprFormatted =
    totalApr >= 1
      ? formatNumberToUSFormat(stripDigitPlaces(totalApr, 2))
      : '< 1'

  const shareText = `I farm on ${base}/${quote} liquidity pool with ${aprFormatted}% APR on @aldrin_exchange
Don't miss your chance.`

  return (
    <PoolRow>
      {/* Pool name */}
      <PoolInfoBlock>
        <PoolName>
          <TokenIcons>
            <TokenIcon
              mint={pool.tokenA}
              size={48}
              margin="0 0.5em 0 0"
            />{' '}
            /
            <TokenIcon
              mint={pool.tokenB}
              size={48}
              margin="0 0 0 0.5em"
            />
          </TokenIcons>
          <div>
            <TokenSymbols>
              {base}/{quote}
            </TokenSymbols>
            {!!baseTokenName && !!quoteTokenName && (
              <TokenNames>
                {baseTokenName}/{quoteTokenName}
              </TokenNames>
            )}
          </div>
        </PoolName>
        <ButtonsContainer>
          <SwapButton
            $borderRadius="md"
            as={Link}
            to={`/swap?base=${base}&quote=${quote}`}
          >
            <SwapButtonIcon>
              <SvgIcon src={SwapIcon} />
            </SwapButtonIcon>
            Swap
          </SwapButton>
          <ShareButton iconFirst variant="primary" text={shareText} />
        </ButtonsContainer>
      </PoolInfoBlock>
      {/* Pool stats */}
      <PoolStatsRow>
        <PoolStats
          title="Total Value Locked"
          value={tvlUsd}
          additionalInfo={
            <FlexBlock alignItems="flex-start" direction="column">
              <span>
                {stripByAmountAndFormat(pool.tvl.tokenA)} {base}
              </span>
              <span>
                {stripByAmountAndFormat(pool.tvl.tokenB)} {quote}
              </span>
            </FlexBlock>
          }
        />
        <PoolStats
          title={
            <>
              Volume <span>24h</span>
            </>
          }
          value={tradingVolume.dailyTradingVolume}
        />
        <PoolStats
          title={
            <>
              Fees <span>24h</span>
            </>
          }
          value={feesUsd}
        />
        <PoolStatsWrap>
          <PoolStatsTitle>APR</PoolStatsTitle>
          <PoolStatsData>
            <PoolStatsText color="green7">{aprFormatted}%</PoolStatsText>
          </PoolStatsData>
        </PoolStatsWrap>
        <PoolStatsWrap>
          <PoolStatsTitle>Farming</PoolStatsTitle>
          <PoolStatsData>
            <FarmingData>
              <FarmingRewards pool={pool} farmingUsdValue={farmingUsdValue} />
            </FarmingData>
          </PoolStatsData>
        </PoolStatsWrap>
      </PoolStatsRow>
    </PoolRow>
  )
}

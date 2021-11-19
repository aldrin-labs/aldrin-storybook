import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { formatNumberToUSFormat, stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { useTokenInfos } from '@sb/dexUtils/tokenRegistry'
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { FeesEarned, PoolInfo, TradingVolumeStats, DexTokensPrices } from '../../../index.types'
import {
  PoolStatsData,
  PoolStatsText,
  PoolStatsTitle,
  PoolStatsWrap,
  PoolInfoBlock,
  TokenIcons,
  TokenSymbols,
  TokenNames,
  ButtonsContainer,
  SwapButton,
  SwapButtonIcon,
  PoolStatsRow,
  FarmingData,
  FarmingDataIcons,
  FarmingIconWrap,
  PoolRow,
  PoolName,
} from './styles'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { getFarmingStateDailyFarmingValue } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { Row } from '@sb/components/Layout'
import { TokenIcon } from '@sb/components/TokenIcon'
import { SvgIcon } from '@sb/components'

import SwapIcon from './icons/swapicon.svg'
import { ShareButton } from '@sb/components/ShareButton'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from '../../Tables/UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'

interface PoolStatsProps {
  title: React.ReactNode
  value: number
}
export const PoolStats: React.FC<PoolStatsProps> = (props) => {
  const { title, value } = props
  return (
    <PoolStatsWrap>
      <PoolStatsTitle>{title}</PoolStatsTitle>
      <PoolStatsData>
        <PoolStatsText>
          <DarkTooltip title={`$${formatNumberToUSFormat(Math.round(value))}`}>
            <span>
              ${stripByAmountAndFormat(value)}
            </span>
          </DarkTooltip>
        </PoolStatsText>
      </PoolStatsData>
    </PoolStatsWrap>
  )
}

interface PoolStatsBlockProps {
  pool: PoolInfo
  tradingVolumes: TradingVolumeStats[]
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

  const { tradingVolumes, pool, fees, baseUsdPrice, quoteUsdPrice, prices } = props

  const tokenMap = useTokenInfos()
  const { symbol } = useParams()

  const tradingVolume = tradingVolumes.find((tv) => tv.pool === pool.swapToken) || {
    dailyTradingVolume: 0,
    weeklyTradingVolume: 0,
  }


  const feesForPool = fees.find((f) => f.pool === pool.swapToken) || {
    totalBaseTokenFee: 0,
    totalQuoteTokenFee: 0,
  }

  const [base, quote] = (symbol as string).split('_')


  const feesUsd = feesForPool.totalBaseTokenFee * baseUsdPrice + feesForPool.totalQuoteTokenFee * quoteUsdPrice

  const tvlUsd = pool.tvl.tokenA * baseUsdPrice + pool.tvl.tokenB * quoteUsdPrice


  const baseTokenInfo = tokenMap.get(pool.tokenA)
  const quoteTokenInfo = tokenMap.get(pool.tokenB)

  const baseTokenName = trimTo(baseTokenInfo?.name || '')
  const quoteTokenName = trimTo(quoteTokenInfo?.name || '')

  const lpTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap: prices
  })

  const lpUsdValue = lpTokenPrice * pool.lpTokenFreezeVaultBalance

  const farmings = filterOpenFarmingStates(pool.farming || [])

  const dailyUsdReward = farmings.reduce(
    (acc, farmingState) => {
      const dailyRewardPerThousand = getFarmingStateDailyFarmingValue({ farmingState, totalStakedLpTokensUSD: lpUsdValue })

      const farmingTokenSymbol = getTokenNameByMintAddress(farmingState.farmingTokenMint)

      const farmingTokenPrice = prices.get(farmingTokenSymbol)?.price || 0

      const dailyUsdRewardPerThousand = dailyRewardPerThousand * farmingTokenPrice

      return acc + dailyUsdRewardPerThousand
    },
    0
  )

  const farmingAPR = ((dailyUsdReward * 365) / lpUsdValue) * 100

  const totalApr = farmingAPR + pool.apy24h

  const aprFormatted = formatNumberToUSFormat(stripDigitPlaces(totalApr, 2))



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
              width={'3em'}
              emojiIfNoLogo={false}
              margin="0 0.5em 0 0"
            /> /
              <TokenIcon
              mint={pool.tokenB}
              width={'3em'}
              emojiIfNoLogo={false}
              margin="0 0 0 0.5em"
            />
          </TokenIcons>
          <div>
            <TokenSymbols>{base}/{quote}</TokenSymbols>
            {!!baseTokenName && !!quoteTokenName &&
              <TokenNames>{baseTokenName}/{quoteTokenName}</TokenNames>
            }
          </div>
        </PoolName>
        <ButtonsContainer>
          <SwapButton borderRadius="xl" as={Link} to={`/swap?base=${base}&quote=${quote}`}>
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
        <PoolStats title={<>Volume <span>24h</span></>} value={tradingVolume.dailyTradingVolume} />
        <PoolStats title="Total Value Locked" value={tvlUsd} />
        <PoolStats title={<>Fees <span>24h</span></>} value={feesUsd} />
        <PoolStatsWrap>
          <PoolStatsTitle>APR</PoolStatsTitle>
          <PoolStatsData>
            <PoolStatsText color="success">
              {aprFormatted}%
      </PoolStatsText>
          </PoolStatsData>
        </PoolStatsWrap>
        <PoolStatsWrap>
          <PoolStatsTitle>Farming</PoolStatsTitle>
          <PoolStatsData>
            <FarmingData>
              <FarmingDataIcons>
                {farmings.map((farmingState) => {
                  return (
                    <FarmingIconWrap
                      key={`farming_icon_${farmingState.farmingTokenMint}`}
                    >
                      <TokenIcon
                        mint={farmingState.farmingTokenMint}
                        width={'1.3em'}
                        emojiIfNoLogo={false}
                      />
                    </FarmingIconWrap>
                  )
                })}
              </FarmingDataIcons>
              <div>
                <PoolStatsText>
                  {farmings.map((farmingState, i, arr) => {
                    const tokensPerThousand = getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity({
                      farmingState, totalStakedLpTokensUSD: lpUsdValue
                    })
                    return (
                      <PoolStatsText key={`fs_reward_${farmingState.farmingTokenMint}`}>
                        {i > 0 ? ' + ' : ''}
                        <PoolStatsText color="success">
                          {stripByAmountAndFormat(tokensPerThousand)}&nbsp;
                  </PoolStatsText>
                        {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
                      </PoolStatsText>
                    )
                  })} / Day
                </PoolStatsText>
                <div>
                  <PoolStatsText>
                    Per each  <PoolStatsText color="success">$1000</PoolStatsText>
                  </PoolStatsText>
                </div>
              </div>
            </FarmingData>
          </PoolStatsData>
        </PoolStatsWrap>
      </PoolStatsRow>
    </PoolRow>

  )
}
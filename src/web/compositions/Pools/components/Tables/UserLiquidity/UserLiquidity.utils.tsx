import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces,
} from '@core/utils/PortfolioTableUtils'
import Info from '@icons/TooltipImg.svg'
import ScalesIcon from '@icons/scales.svg'

import { SvgIcon } from '@sb/components'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
} from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getStakedTokensForPool } from '@sb/dexUtils/common/getStakedTokensForPool'
import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { Theme } from '@sb/types/materialUI'
import React from 'react'
import { Link } from 'react-router-dom'
import { TokenIconsContainer } from '../components'
import {
  DetailsLink,
  RowDataTdText,
  RowDataTdTopText,
  TextColumnContainer,
} from '../index.styles'
import { getFarmingStateDailyFarmingValue } from './utils/getFarmingStateDailyFarmingValue'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from './utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'

export const AUTHORIZED_POOLS = [
  '4KeZGuXPq9fyZdt5sfzHMM36mxTf3oSkDaa4Y4gHm9Hz', // mSOL_ETH
  'Gathk79qZfJ4G36M7hiL3Ef1P5SDt7Xhm2C1vPhtWkrw', // RIN_USDC
  'EotLYRsnRVqR3euN24P9PMXCqJv1WLsV8kJxR9o1y4U7', // mSOL_MNGO
  'H37kHxy82uLoF8t86wK414KzpVJy7uVJ9Kvt5wYsTGPh', // mSOL_USDC
  '3sbMDzGtyHAzJqzxE7DPdLMhrsxQASYoKLkHMYJPuWkp', // SOL_USDC
  '77qHkg6TEe4FuZAr35bthTEadmT4ueWe1xomFFZkwiGQ', // mSOL_USDT
  '9hkYqNM8QSx2vTwspaNg5VvW1LBxKWWgud8pCVdxKYZU', // mSOL_BTC
  'HFNv9CeUtKFKm7gPoX1QG1NnrPnDhA5W6xqHGxmV6kxX', // RIN_SOL
  'BE7eTJ8DB7xTu6sKsch4gWDCXbD48PLGesRLx7E1Qce4', // mSol_wUst
]

export const userLiquidityTableColumnsNames = [
  { label: 'Pool', id: 'pool' },
  { label: 'Total Value Locked', id: 'tvl' },
  { label: 'Your Liquidity (Including Fees)', id: 'userLiquidity' },
  {
    label: 'Fees Earned',
    id: 'fees',
  },
  {
    label: (
      <>
        <span>APR</span>{' '}
        <DarkTooltip
          title={
            'Estimation for growth of your deposit over a year, projected based on trading activity in the past 24h as well as farming rewards.'
          }
        >
          <div>
            <SvgIcon
              src={Info}
              width={'1.5rem'}
              height={'auto'}
              style={{ marginLeft: '1rem' }}
            />
          </div>
        </DarkTooltip>
      </>
    ),
    id: 'apy',
  },
  {
    label: (
      <>
        Farming
        <DarkTooltip
          title={
            'You can stake your pool tokens (derivatives received as a guarantee that you are a liquidity provider after a deposit into the pool), receiving a reward in tokens allocated by the creator of the pool. The amount of reward specified in the pool info is the amount you will receive daily for each $1,000 deposited into the pool.'
          }
        >
          <div>
            <SvgIcon
              src={Info}
              width={'1.5rem'}
              height={'auto'}
              style={{ marginLeft: '1rem' }}
            />
          </div>
        </DarkTooltip>
      </>
    ),
    id: 'farming',
  },
  { label: '', id: 'details' },
]

interface CombineUserLiquidityParams {
  theme: Theme
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  usersPools: PoolInfo[]
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  includePermissionless: boolean
}

export const combineUserLiquidityData = (
  params: CombineUserLiquidityParams
) => {
  const {
    theme,
    searchValue,
    usersPools,
    allTokensData,
    dexTokensPricesMap,
    farmingTicketsMap,
    earnedFeesInPoolForUserMap,
    includePermissionless,
  } = params

  const processedUserLiquidityData = usersPools
    .filter((pool) =>
      filterDataBySymbolForDifferentDeviders({
        searchValue,
        symbol: `${getTokenNameByMintAddress(
          pool.tokenA
        )}_${getTokenNameByMintAddress(pool.tokenB)}`,
      })
    )
    .filter((pool) =>
      includePermissionless
        ? true
        : AUTHORIZED_POOLS.includes(pool.poolTokenMint)
    )
    .map((pool: PoolInfo) => {
      const poolName = `${getTokenNameByMintAddress(
        pool.tokenA
      )}_${getTokenNameByMintAddress(pool.tokenB)}`
      const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
      const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

      const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
      const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

      const tvlUSD =
        baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

      const {
        amount: poolTokenRawAmount,
        decimals: poolTokenDecimals,
      } = getTokenDataByMint(allTokensData, pool.poolTokenMint)

      const farmingTickets = farmingTicketsMap.get(pool.swapToken) || []

      const stakedTokens = getStakedTokensForPool(farmingTickets)

      const poolTokenAmount = poolTokenRawAmount * 10 ** poolTokenDecimals

      const [userAmountTokenA, userAmountTokenB] = calculateWithdrawAmount({
        selectedPool: pool,
        poolTokenAmount: poolTokenAmount + stakedTokens,
      })

      const poolTokenPrice = calculatePoolTokenPrice({
        pool,
        dexTokensPricesMap,
      })

      const totalStakedLpTokensUSD =
        pool.lpTokenFreezeVaultBalance * poolTokenPrice

      const isPoolWithFarming = pool.farming && pool.farming.length > 0
      const openFarmings = isPoolWithFarming
        ? filterOpenFarmingStates(pool.farming)
        : []

      const userLiquidityUSD =
        baseTokenPrice * userAmountTokenA + quoteTokenPrice * userAmountTokenB

      const feesEarnedByUserForPool = earnedFeesInPoolForUserMap.get(
        pool.swapToken
      ) || { totalBaseTokenFee: 0, totalQuoteTokenFee: 0 }

      const feesUsd =
        feesEarnedByUserForPool.totalBaseTokenFee * baseTokenPrice +
        feesEarnedByUserForPool.totalQuoteTokenFee * quoteTokenPrice

      const totalFarmingDailyRewardsUSD = openFarmings.reduce(
        (acc, farmingState) => {
          const farmingStateDailyFarmingValuePerThousandDollarsLiquidity = getFarmingStateDailyFarmingValue(
            { farmingState, totalStakedLpTokensUSD }
          )

          const farmingTokenSymbol = getTokenNameByMintAddress(
            farmingState.farmingTokenMint
          )

          const farmingTokenPrice =
            dexTokensPricesMap.get(farmingTokenSymbol)?.price || 0

          const farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD =
            farmingStateDailyFarmingValuePerThousandDollarsLiquidity *
            farmingTokenPrice

          return (
            acc + farmingStateDailyFarmingValuePerThousandDollarsLiquidityUSD
          )
        },
        0
      )

      const openFarmingsMap = openFarmings.reduce((acc, of) => {
        const fs: FarmingState[] = acc.get(of.farmingTokenMint) || []

        acc.set(of.farmingTokenMint, [...fs, of])
        return acc
      }, new Map<string, FarmingState[]>())

      const openFarmingsKeys = Array.from(openFarmingsMap.keys())

      const farmingAPR =
        ((totalFarmingDailyRewardsUSD * 365) / totalStakedLpTokensUSD) * 100

      return {
        id: `${pool.name}${pool.tvl}${pool.poolTokenMint}`,
        pool: {
          render: (
            <Row
              justify="flex-start"
              style={{ width: '18rem', flexWrap: 'nowrap' }}
            >
              <Link
                onClick={(e) => {
                  e.stopPropagation()
                }}
                to={`/swap?base=${baseSymbol}&quote=${quoteSymbol}`}
                style={{ textDecoration: 'none' }}
              >
                <TokenIconsContainer
                  needHover={true}
                  tokenA={pool.tokenA}
                  tokenB={pool.tokenB}
                />
              </Link>
              {pool.curveType === 1 ? (
                <DarkTooltip
                  title={
                    'This pool uses the stable curve, which provides better rates for swapping stablecoins.'
                  }
                >
                  <div>
                    <SvgIcon style={{ marginLeft: '1rem' }} src={ScalesIcon} />
                  </div>
                </DarkTooltip>
              ) : null}
            </Row>
          ),
          contentToSort: `${baseSymbol}_${quoteSymbol}`,
        },
        tvl: {
          render: (
            <TextColumnContainer>
              <RowDataTdTopText theme={theme}>
                ${stripByAmountAndFormat(tvlUSD)}
              </RowDataTdTopText>
              <RowDataTdText theme={theme} color={theme.palette.grey.new}>
                {stripByAmountAndFormat(pool.tvl.tokenA)}{' '}
                {getTokenNameByMintAddress(pool.tokenA)} /{' '}
                {stripByAmountAndFormat(pool.tvl.tokenB)}{' '}
                {getTokenNameByMintAddress(pool.tokenB)}
              </RowDataTdText>
            </TextColumnContainer>
          ),
          showOnMobile: false,
          contentToSort: tvlUSD,
        },
        userLiquidity: {
          render: (
            <TextColumnContainer>
              <RowDataTdTopText theme={theme}>
                ${stripByAmountAndFormat(userLiquidityUSD + feesUsd)}
              </RowDataTdTopText>
              <RowDataTdText theme={theme} color={theme.palette.grey.new}>
                {stripByAmountAndFormat(
                  userAmountTokenA + feesEarnedByUserForPool.totalBaseTokenFee
                )}{' '}
                {getTokenNameByMintAddress(pool.tokenA)} /{' '}
                {stripByAmountAndFormat(
                  userAmountTokenB + feesEarnedByUserForPool.totalQuoteTokenFee
                )}{' '}
                {getTokenNameByMintAddress(pool.tokenB)}
              </RowDataTdText>
            </TextColumnContainer>
          ),
          contentToSort: userLiquidityUSD + feesUsd,
        },
        fees: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripByAmountAndFormat(feesUsd || 0)}
            </RowDataTdText>
          ),
          contentToSort: feesUsd,
        },
        apy: {
          render: (
            <RowDataTdText
              color={'#53DF11'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              {formatNumberToUSFormat(
                stripDigitPlaces(pool.apy24h + farmingAPR, 2)
              )}
              %
            </RowDataTdText>
          ),
          contentToSort: pool.apy24h + farmingAPR,
        },
        farming: {
          render: isPoolWithFarming ? (
            <RowContainer justify="flex-start" theme={theme}>
              <Row margin="0 1rem 0 0" justify="flex-start">
                {/* every farming token mint logo, TODO: place them nicely, not one by one */}
                {openFarmingsKeys.map((farmingTokenMint) => {
                  return (
                    <TokenIcon
                      mint={farmingTokenMint}
                      width={'3rem'}
                      emojiIfNoLogo={false}
                    />
                  )
                })}
              </Row>
              <Row align="flex-start" direction="column">
                <RowDataTdText
                  fontFamily="Avenir Next Medium"
                  style={{ marginBottom: '1rem' }}
                  theme={theme}
                >
                  {openFarmingsKeys.map((farmingTokenMint, i, arr) => {
                    return `${getTokenNameByMintAddress(farmingTokenMint)} ${i !== arr.length - 1 ? 'X ' : ''
                      }`
                  })}
                </RowDataTdText>
                {openFarmings.length === 0 ? (
                  <RowDataTdText>
                    <span style={{ color: '#53DF11' }}>Ended</span>
                  </RowDataTdText>
                ) : (
                  openFarmingsKeys.map((farmingTokenMint, i, arr) => {
                    const farmingStates =
                      openFarmingsMap.get(farmingTokenMint) || []

                    const farmingStateDailyFarmingValuePerThousandDollarsLiquidity = farmingStates.reduce(
                      (acc, farmingState) => {
                        return (
                          acc +
                          getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity(
                            { farmingState, totalStakedLpTokensUSD }
                          )
                        )
                      },
                      0
                    )

                    return (
                      <RowDataTdText>
                        <span style={{ color: '#53DF11' }}>
                          {stripByAmountAndFormat(
                            farmingStateDailyFarmingValuePerThousandDollarsLiquidity
                          )}
                        </span>{' '}
                        {getTokenNameByMintAddress(farmingTokenMint)}
                        {/* + between every farming state token to be farmed, except last. for last - per day */}
                        {i !== arr.length - 1 ? <span> + </span> : null}
                        {i === arr.length - 1 ? <span> / Day</span> : null}
                      </RowDataTdText>
                    )
                  })
                )}

                {openFarmings.length > 0 && (
                  <RowDataTdText>
                    {' '}
                    for each <span style={{ color: '#53DF11' }}>$1000</span>
                  </RowDataTdText>
                )}
              </Row>
            </RowContainer>
          ) : (
            '-'
          ),
          contentToSort: farmingAPR,
        },
        details: {
          render: <DetailsLink to={`/pools/${poolName}`}>Details</DetailsLink>,
        },
      }
    })

  return processedUserLiquidityData.filter((pool) => !!pool)
}

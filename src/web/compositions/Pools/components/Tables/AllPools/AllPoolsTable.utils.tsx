import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import {
  formatNumberToUSFormat,
  stripDigitPlaces
} from '@core/utils/PortfolioTableUtils'
import Info from '@icons/TooltipImg.svg'
import { SvgIcon } from '@sb/components'
import { TokenIcon } from '@sb/components/TokenIcon'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { Theme } from '@sb/types/materialUI'
import React from 'react'
import { Link } from 'react-router-dom'
import { TokenIconsContainer } from '../components'
import {
  DetailsLink, RowDataTdText,
  RowDataTdTopText,
  TextColumnContainer
} from '../index.styles'
import { PERMISIONLESS_POOLS_MINTS } from '../UserLiquidity/UserLiquidity.utils'
import { getFarmingStateDailyFarmingValue } from '../UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from '../UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'


export const allPoolsTableColumnsNames = [
  { label: 'Pool', id: 'pool' },
  { label: 'Total Value Locked', id: 'tvl' },
  {
    label: (
      <>
        <span>Volume</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 24h</span>
      </>
    ),
    id: 'vol24h',
  },
  {
    label: (
      <>
        <span>Volume</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 7d</span>
      </>
    ),
    id: 'vol7d',
  },
  {
    label: (
      <>
        <span>Fees</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 24h</span>
      </>
    ),
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

export type Pools = {}

interface CombineAllPoolsDataParams {
  theme: Theme
  poolsInfo: PoolInfo[]
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  feesPerPoolMap: Map<string, FeesEarned>
  weeklyAndDailyTradingVolumes: TradingVolumeStats[]
  includePermissionless: boolean
}

export const combineAllPoolsData = (params: CombineAllPoolsDataParams) => {

  const {
    theme,
    poolsInfo,
    searchValue,
    dexTokensPricesMap,
    feesPerPoolMap,
    weeklyAndDailyTradingVolumes,
    includePermissionless,
  } = params

  const processedAllPoolsData = poolsInfo
    .filter((pool) =>
      filterDataBySymbolForDifferentDeviders({
        searchValue,
        symbol: `${getTokenNameByMintAddress(
          pool.tokenA
        )}_${getTokenNameByMintAddress(pool.tokenB)}`,
      })
    )
    .filter((pool) => includePermissionless ? true : !PERMISIONLESS_POOLS_MINTS.includes(pool.poolTokenMint))
    .map((pool) => {
      const poolName = `${getTokenNameByMintAddress(
        pool.tokenA
      )}_${getTokenNameByMintAddress(pool.tokenB)}`
      const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
      const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

      const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
      const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

      const feesEarnedByPool = feesPerPoolMap.get(pool.swapToken) || {
        totalBaseTokenFee: 0,
        totalQuoteTokenFee: 0,
      }

      const feesUSDByPool =
        feesEarnedByPool?.totalBaseTokenFee * baseTokenPrice +
        feesEarnedByPool?.totalQuoteTokenFee * quoteTokenPrice

      const tradingVolumes = weeklyAndDailyTradingVolumes?.find(
        (el) => el.pool === pool.swapToken
      ) || {
        dailyTradingVolume: 0,
        weeklyTradingVolume: 0,
      }

      const apy = pool.apy24h || 0

      const tvlUSD =
        baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

      const poolTokenPrice = calculatePoolTokenPrice({
        pool,
        dexTokensPricesMap,
      })

      const totalStakedLpTokensUSD =
        pool.lpTokenFreezeVaultBalance * poolTokenPrice

      const isPoolWithFarming = pool.farming && pool.farming.length > 0
      const openFarmings = isPoolWithFarming
        ? filterOpenFarmingStates(pool.farming || [])
        : []

      const totalFarmingDailyRewardsUSD = openFarmings.reduce(
        (acc, farmingState) => {
          const farmingStateDailyFarmingValuePerThousandDollarsLiquidity = getFarmingStateDailyFarmingValue(
            { farmingState, totalStakedLpTokensUSD }
          )

          const farmingTokenSymbol = getTokenNameByMintAddress(farmingState.farmingTokenMint)

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
                to={`/swap?base=${baseSymbol}&quote=${quoteSymbol}`}
                style={{ textDecoration: 'none' }}
              >
                <TokenIconsContainer
                  needHover={true}
                  tokenA={pool.tokenA}
                  tokenB={pool.tokenB}
                />
              </Link>
              {/* TODO: show locked liquidity depending on backend data, not for all pools */}
              {/* {true ? (
                <DarkTooltip title={'Founders liquidity locked.'}>
                  <div>
                    <SvgIcon
                      style={{ marginLeft: '1rem' }}
                      width="2rem"
                      height="auto"
                      src={CrownIcon}
                    />
                  </div>
                </DarkTooltip>
              ) : pool.executed ? (
                <DarkTooltip
                  title={
                    'RIN token founders complained about this pool, it will be excluded from the catalog and AMM. You can withdraw liquidity and deposit it in the official pool at "All Pools" tab.'
                  }
                >
                  <div>
                    <SvgIcon
                      style={{ marginLeft: '1rem' }}
                      width="2rem"
                      height="auto"
                      src={ForbiddenIcon}
                    />
                  </div>
                </DarkTooltip>
              ) : null} */}
            </Row>
          ),
          contentToSort: `${baseSymbol}${quoteSymbol}`,
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
        vol24h: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripByAmountAndFormat(tradingVolumes.dailyTradingVolume)}
            </RowDataTdText>
          ),
          style: { textAlign: 'left' },
          contentToSort: tradingVolumes.dailyTradingVolume,
          showOnMobile: false,
        },

        vol7d: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripByAmountAndFormat(tradingVolumes.weeklyTradingVolume)}
            </RowDataTdText>
          ),
          style: { textAlign: 'left' },
          contentToSort: tradingVolumes.weeklyTradingVolume,
          showOnMobile: false,
        },
        fees: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripByAmountAndFormat(feesUSDByPool)}
            </RowDataTdText>
          ),
          contentToSort: feesUSDByPool,
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
                {openFarmings.map((farmingState) => {
                  return (
                    <TokenIcon
                      mint={farmingState.farmingTokenMint}
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
                  {openFarmings.map((farmingState, i, arr) => {
                    return `${getTokenNameByMintAddress(
                      farmingState.farmingTokenMint
                    )} ${i !== arr.length - 1 ? 'X ' : ''}`
                  })}
                </RowDataTdText>
                {openFarmings.length === 0 ? (
                  <RowDataTdText>
                    <span style={{ color: '#53DF11' }}>Ended</span>
                  </RowDataTdText>
                ) : (
                    openFarmings.map((farmingState, i, arr) => {
                      const farmingStateDailyFarmingValuePerThousandDollarsLiquidity = getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity(
                        { farmingState, totalStakedLpTokensUSD }
                      )

                      return (
                        <RowDataTdText>
                          <span style={{ color: '#53DF11' }}>
                            {stripByAmountAndFormat(
                              farmingStateDailyFarmingValuePerThousandDollarsLiquidity
                            )}
                          </span>{' '}
                          {getTokenNameByMintAddress(
                            farmingState.farmingTokenMint
                          )}
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
          render: (
            <DetailsLink to={`/pools/${poolName}`}>Details</DetailsLink>
          ),
        },
        // expandableContent: [
        //   {
        //     row: {
        //       render: (
        //         <TablesDetails
        //           setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
        //           setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
        //           setIsStakePopupOpen={setIsStakePopupOpen}
        //           setIsUnstakePopupOpen={setIsUnstakePopupOpen}
        //           setIsClaimRewardsPopupOpen={setIsClaimRewardsPopupOpen}
        //           setPoolWaitingForUpdateAfterOperation={
        //             setPoolWaitingForUpdateAfterOperation
        //           }
        //           refreshTokensWithFarmingTickets={
        //             refreshTokensWithFarmingTickets
        //           }
        //           selectPool={selectPool}
        //           poolWaitingForUpdateAfterOperation={
        //             poolWaitingForUpdateAfterOperation
        //           }
        //           earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
        //           farmingTicketsMap={farmingTicketsMap}
        //           dexTokensPricesMap={dexTokensPricesMap}
        //           allTokensData={allTokensData}
        //           theme={theme}
        //           pool={pool}
        //         />
        //       ),
        //       colspan: 8,
        //     },
        //   },
        // ],
      }
    })

  return processedAllPoolsData.filter((pool) => !!pool)
}

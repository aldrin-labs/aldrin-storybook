import React from 'react'
import { Theme } from '@sb/types/materialUI'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'

import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { SvgIcon } from '@sb/components'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import { TokenIconsContainer } from '../components'
import {
  RowDataTdText,
  RowDataTdTopText,
  TextColumnContainer,
} from '../index.styles'

import ArrowToBottom from '@icons/greyArrow.svg'
import ArrowToTop from '@icons/arrowToTop.svg'
import Info from '@icons/TooltipImg.svg'
import CrownIcon from '@icons/crownIcon.svg'
import ForbiddenIcon from '@icons/fobiddenIcon.svg'

import { WalletAdapter } from '@sb/dexUtils/types'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { TokenIcon } from '@sb/components/TokenIcon'
import { TablesDetails } from '../components/TablesDetails'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { dayDuration } from '@sb/compositions/AnalyticsRoute/components/utils'
import { Link } from 'react-router-dom'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from '../UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'

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
        <span>APY</span>{' '}
        <DarkTooltip
          title={
            'Estimation for growth of your deposit over a year, projected based on trading activity in the past 24h not taking into account the reward for farming.'
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

export const combineAllPoolsData = ({
  theme,
  wallet,
  poolsInfo,
  searchValue,
  poolWaitingForUpdateAfterOperation,
  dexTokensPricesMap,
  feesPerPoolMap,
  expandedRows,
  allTokensDataMap,
  farmingTicketsMap,
  tradingVolumesMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
  setIsAddLiquidityPopupOpen,
  setIsWithdrawalPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  wallet: WalletAdapter
  poolsInfo: PoolInfo[]
  searchValue: string
  poolWaitingForUpdateAfterOperation: PoolWithOperation
  dexTokensPricesMap: Map<string, DexTokensPrices>
  feesPerPoolMap: Map<string, FeesEarned>
  expandedRows: string[]
  allTokensDataMap: Map<string, TokenInfo>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  tradingVolumesMap: Map<string, { weekly: number; daily: number }>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectPool: (pool: PoolInfo) => void
  refreshTokensWithFarmingTickets: () => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const processedAllPoolsData = poolsInfo
    .filter((pool) =>
      filterDataBySymbolForDifferentDeviders({
        searchValue,
        symbol: `${getTokenNameByMintAddress(
          pool.tokenA
        )}_${getTokenNameByMintAddress(pool.tokenB)}`,
      })
    )
    .map((pool) => {
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

      const tradingVolumes = tradingVolumesMap.get(pool.swapToken) || {
        weekly: 0,
        daily: 0,
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
        ? filterOpenFarmingStates(pool.farming)
        : []

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
              {true ? (
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
              ) : null}
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
              ${stripByAmountAndFormat(tradingVolumes.daily)}
            </RowDataTdText>
          ),
          style: { textAlign: 'left' },
          contentToSort: tradingVolumes.daily,
          showOnMobile: false,
        },

        vol7d: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripByAmountAndFormat(tradingVolumes.weekly)}
            </RowDataTdText>
          ),
          style: { textAlign: 'left' },
          contentToSort: tradingVolumes.weekly,
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
              {stripByAmountAndFormat(apy)}%
            </RowDataTdText>
          ),
          contentToSort: apy,
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
          contentToSort: openFarmings.reduce((acc, farmingState) => {
            return (
              acc +
              getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity({
                farmingState,
                totalStakedLpTokensUSD,
              })
            )
          }, 0),
        },
        details: {
          render: (
            <Row>
              <RowDataTdText
                theme={theme}
                color={theme.palette.grey.new}
                fontFamily="Avenir Next Medium"
                style={{ marginRight: '1rem' }}
              >
                Details
              </RowDataTdText>
              <SvgIcon
                width="1rem"
                height="auto"
                src={
                  expandedRows.includes(
                    `${pool.name}${pool.tvl}${pool.poolTokenMint}`
                  )
                    ? ArrowToTop
                    : ArrowToBottom
                }
              />
            </Row>
          ),
        },
        expandableContent: [
          {
            row: {
              render: (
                <TablesDetails
                  setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
                  setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
                  setIsStakePopupOpen={setIsStakePopupOpen}
                  setIsUnstakePopupOpen={setIsUnstakePopupOpen}
                  setPoolWaitingForUpdateAfterOperation={
                    setPoolWaitingForUpdateAfterOperation
                  }
                  refreshTokensWithFarmingTickets={
                    refreshTokensWithFarmingTickets
                  }
                  selectPool={selectPool}
                  poolWaitingForUpdateAfterOperation={
                    poolWaitingForUpdateAfterOperation
                  }
                  earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
                  farmingTicketsMap={farmingTicketsMap}
                  dexTokensPricesMap={dexTokensPricesMap}
                  allTokensDataMap={allTokensDataMap}
                  theme={theme}
                  pool={pool}
                />
              ),
              colspan: 8,
            },
          },
        ],
      }
    })

  return processedAllPoolsData.filter((pool) => !!pool)
}

import React from 'react'
import { Theme } from '@sb/types/materialUI'

import { SvgIcon } from '@sb/components'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
import {
  PoolInfo,
  DexTokensPrices,
  FeesEarned,
  PoolWithOperation,
} from '@sb/compositions/Pools/index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { TokenIconsContainer } from '../components'
import {
  RowDataTdText,
  RowDataTdTopText,
  TextColumnContainer,
} from '../index.styles'

import CrownIcon from '@icons/crownIcon.svg'
import ForbiddenIcon from '@icons/fobiddenIcon.svg'
import ArrowToBottom from '@icons/greyArrow.svg'
import ArrowToTop from '@icons/arrowToTop.svg'
import Info from '@icons/TooltipImg.svg'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { TokenIcon } from '@sb/components/TokenIcon'
import { TablesDetails } from '../components/TablesDetails'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { filterDataBySymbolForDifferentDeviders } from '@sb/compositions/Chart/Inputs/SelectWrapper/SelectWrapper.utils'
import { dayDuration } from '@sb/compositions/AnalyticsRoute/components/utils'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { FarmingTicket } from '@sb/dexUtils/pools/types'
import { getStakedTokensForPool } from '@sb/dexUtils/pools/getStakedTokensForPool'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'

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
        <span>APY</span>{' '}
        <span style={{ color: '#96999C', padding: '0 0 0 0.5rem' }}> 24h</span>
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

export const combineUserLiquidityData = ({
  theme,
  searchValue,
  usersPools,
  expandedRows,
  poolWaitingForUpdateAfterOperation,
  allTokensDataMap,
  dexTokensPricesMap,
  farmingTicketsMap,
  earnedFeesInPoolForUserMap,
  selectPool,
  refreshTokensWithFarmingTickets,
  setPoolWaitingForUpdateAfterOperation,
  setIsWithdrawalPopupOpen,
  setIsAddLiquidityPopupOpen,
  setIsStakePopupOpen,
  setIsUnstakePopupOpen,
}: {
  theme: Theme
  searchValue: string
  dexTokensPricesMap: Map<string, DexTokensPrices>
  usersPools: PoolInfo[]
  expandedRows: string[]
  poolWaitingForUpdateAfterOperation: PoolWithOperation
  allTokensDataMap: Map<string, TokenInfo>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  earnedFeesInPoolForUserMap: Map<string, FeesEarned>
  selectPool: (pool: PoolInfo) => void
  refreshTokensWithFarmingTickets: () => void
  setPoolWaitingForUpdateAfterOperation: (data: PoolWithOperation) => void
  setIsWithdrawalPopupOpen: (value: boolean) => void
  setIsAddLiquidityPopupOpen: (value: boolean) => void
  setIsStakePopupOpen: (value: boolean) => void
  setIsUnstakePopupOpen: (value: boolean) => void
}) => {
  const processedUserLiquidityData = usersPools
    .filter((pool) =>
      filterDataBySymbolForDifferentDeviders({
        searchValue,
        symbol: pool.parsedName,
      })
    )
    .map((pool: PoolInfo) => {
      const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
      const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

      const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
      const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

      const tvlUSD =
        baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

      const {
        amount: poolTokenRawAmount,
        decimals: poolTokenDecimals,
      } = allTokensDataMap.get(pool.poolTokenMint) || {
        amount: 0,
        decimals: 0,
      }

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

      const farmingState = pool.farming && pool.farming[0]

      const tokensPerPeriod = farmingState
        ? farmingState.tokensPerPeriod *
          (1 / 10 ** farmingState.farmingTokenMintDecimals)
        : 0

      const dailyFarmingValue = farmingState
        ? tokensPerPeriod * (dayDuration / farmingState.periodLength)
        : 0

      const dailyFarmingValuePerThousandDollarsLiquidity = totalStakedLpTokensUSD
        ? dailyFarmingValue * (1000 / totalStakedLpTokensUSD)
        : 0

      const userLiquidityUSD =
        baseTokenPrice * userAmountTokenA + quoteTokenPrice * userAmountTokenB

      const feesEarnedByUserForPool = earnedFeesInPoolForUserMap.get(
        pool.swapToken
      ) || { totalBaseTokenFee: 0, totalQuoteTokenFee: 0 }

      const feesUsd =
        feesEarnedByUserForPool.totalBaseTokenFee * baseTokenPrice +
        feesEarnedByUserForPool.totalQuoteTokenFee * quoteTokenPrice

      const isFarmingEnded =
        farmingState && farmingState.tokensTotal === farmingState.tokensUnlocked

      return {
        id: `${pool.name}${pool.tvl}${pool.poolTokenMint}`,
        pool: {
          render: (
            <Row
              justify="flex-start"
              style={{ width: '18rem', flexWrap: 'nowrap' }}
            >
              <TokenIconsContainer
                tokenA={pool.tokenA}
                tokenB={pool.tokenB}
                needHover={true}
              />
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
        },
        fees: {
          render: (
            <RowDataTdText theme={theme}>
              ${stripByAmountAndFormat(feesUsd || 0)}
            </RowDataTdText>
          ),
        },
        apy: {
          render: (
            <RowDataTdText
              color={'#53DF11'}
              fontFamily="Avenir Next Medium"
              theme={theme}
            >
              {stripByAmountAndFormat(pool.apy24h)}%
            </RowDataTdText>
          ),
        },
        farming: {
          render: farmingState ? (
            isFarmingEnded ? (
              'Ended'
            ) : (
              <RowContainer justify="flex-start" theme={theme}>
                <Row margin="0 1rem 0 0" justify="flex-start">
                  <TokenIcon
                    mint={farmingState.farmingTokenMint}
                    width={'3rem'}
                    emojiIfNoLogo={false}
                  />
                </Row>
                <Row align="flex-start" direction="column">
                  <RowDataTdText
                    fontFamily="Avenir Next Medium"
                    style={{ marginBottom: '1rem' }}
                    theme={theme}
                  >
                    {getTokenNameByMintAddress(farmingState.farmingTokenMint)}
                  </RowDataTdText>
                  <RowDataTdText>
                    <span style={{ color: '#53DF11' }}>
                      {stripByAmountAndFormat(
                        dailyFarmingValuePerThousandDollarsLiquidity
                      )}
                    </span>{' '}
                    {getTokenNameByMintAddress(farmingState.farmingTokenMint)} /
                    Day
                  </RowDataTdText>{' '}
                  <RowDataTdText>
                    {' '}
                    for each <span style={{ color: '#53DF11' }}>$1000</span>
                  </RowDataTdText>
                </Row>
              </RowContainer>
            )
          ) : (
            '-'
          ),
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
                  // separate to variable
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
                  setIsStakePopupOpen={setIsStakePopupOpen}
                  setIsUnstakePopupOpen={setIsUnstakePopupOpen}
                  setIsWithdrawalPopupOpen={setIsWithdrawalPopupOpen}
                  setIsAddLiquidityPopupOpen={setIsAddLiquidityPopupOpen}
                  refreshTokensWithFarmingTickets={
                    refreshTokensWithFarmingTickets
                  }
                  setPoolWaitingForUpdateAfterOperation={
                    setPoolWaitingForUpdateAfterOperation
                  }
                  selectPool={selectPool}
                  farmingTicketsMap={farmingTicketsMap}
                  earnedFeesInPoolForUserMap={earnedFeesInPoolForUserMap}
                  dexTokensPricesMap={dexTokensPricesMap}
                  allTokensDataMap={allTokensDataMap}
                  poolWaitingForUpdateAfterOperation={
                    poolWaitingForUpdateAfterOperation
                  }
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

  return processedUserLiquidityData.filter((pool) => !!pool)
}

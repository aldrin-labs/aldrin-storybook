import { ProgramAccount } from 'anchor024'
import { BN } from 'bn.js'
import dayjs from 'dayjs'
import React from 'react'
import { Link } from 'react-router-dom'

import { SvgIcon } from '@sb/components'
import {
  DataCellValues,
  DataCellValue,
  DataHeadColumn,
} from '@sb/components/DataTable'
import { FlexBlock } from '@sb/components/Layout'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { getNumberOfPrecisionDigitsForSymbol } from '@sb/components/TradingTable/TradingTable.utils'
import { Text } from '@sb/components/Typography'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { TokenInfo } from '@sb/dexUtils/types'

import { ADDITIONAL_POOL_OWNERS } from '@core/config/dex'
import { Farm, filterOpenFarmingStates, Vesting, Farmer } from '@core/solana'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'

import CrownIcon from '@icons/crownIcon.svg'
import ScalesIcon from '@icons/scales.svg'

import { DexTokensPrices, PoolInfo } from '../../../index.types'
import { FarmingRewards } from '../../FarminRewards'
import { STABLE_POOLS_TOOLTIP } from '../../Popups/CreatePool/PoolConfirmationData'
import { TokenIconsContainer } from '../components'
import { PoolsTableIcons } from '../index.styles'
import { getFarmingStateDailyFarmingValue } from '../UserLiquidity/utils/getFarmingStateDailyFarmingValue'

const EMPTY_VESTING = {
  endTs: 0,
  startBalance: new BN(0),
}

export const preparePoolTableCell = (params: {
  pool: PoolInfo
  tokenPrices: Map<string, DexTokensPrices>
  prepareMore: (pool: PoolInfo) => { [c: string]: DataCellValue }
  walletPk: string
  vestings: Map<string, Vesting>
  tokenMap: Map<string, TokenInfo>
  farms?: Map<string, Farm>
  farmers?: Map<string, ProgramAccount<Farmer>>
}): DataCellValues<PoolInfo> => {
  const {
    pool,
    tokenPrices,
    prepareMore,
    walletPk,
    vestings,
    tokenMap,
    farms,
    farmers,
  } = params

  const baseInfo = tokenMap.get(pool.tokenA)
  const quoteInfo = tokenMap.get(pool.tokenB)

  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseName = baseInfo?.symbol || baseSymbol
  const quoteName = quoteInfo?.symbol || quoteSymbol

  const baseTokenPrice = tokenPrices.get(baseSymbol)?.price || 0
  const quoteTokenPrice = tokenPrices.get(quoteSymbol)?.price || 0

  const farm = farms?.get(pool.poolTokenMint)
  const farmer = farm ? farmers?.get(farm.publicKey.toString()) : undefined

  const userInFarming = !!farmer && farmer.account.staked > 0

  const tvlUSD =
    baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

  const poolTokenPrice =
    calculatePoolTokenPrice({
      pool,
      dexTokensPricesMap: tokenPrices,
    }) || 0

  // TODO: pass correct tokens amount
  const totalStakedLpTokensUSD = Math.max(0, 1000) // When no liquidity staked - estimate APR for $1000

  const openFarmings = filterOpenFarmingStates(pool.farming || [])

  const totalDailyRewardUsd = openFarmings.reduce((acc, farmingState) => {
    const dailyReward = getFarmingStateDailyFarmingValue({
      farmingState,
      totalStakedLpTokensUSD,
    })

    const farmingTokenSymbol = getTokenNameByMintAddress(
      farmingState.farmingTokenMint || ''
    )

    const farmingTokenPrice = tokenPrices.get(farmingTokenSymbol)?.price || 0

    const dailyRewardUsd = dailyReward * farmingTokenPrice

    return acc + dailyRewardUsd
  }, 0)

  const vesting = vestings.get(pool.poolTokenMint) || EMPTY_VESTING

  const hasLockedFunds = vesting.endTs * 1000 > Date.now()

  const lockedFundsValue =
    parseFloat(vesting.startBalance.toString()) * poolTokenPrice

  const farmingAPR =
    ((totalDailyRewardUsd * 365) / totalStakedLpTokensUSD) * 100 || 0

  const totalApr = farmingAPR + pool.apy24h

  const additionalPoolOwners = ADDITIONAL_POOL_OWNERS[pool.poolTokenMint] || []

  const isPoolOwner =
    (walletPk && walletPk === pool.initializerAccount) ||
    additionalPoolOwners.includes(walletPk)

  return {
    extra: pool,
    fields: {
      pool: {
        rawValue: pool.parsedName,
        rendered: (
          <FlexBlock alignItems="center">
            <Link
              to={`/swap?base=${baseName}&quote=${quoteName}`}
              style={{ textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              <TokenIconsContainer
                tokenMap={tokenMap}
                tokenA={pool.tokenA}
                tokenB={pool.tokenB}
              >
                {isPoolOwner && (
                  <Text color="green3" size="sm">
                    Your pool
                  </Text>
                )}
              </TokenIconsContainer>
            </Link>
            <PoolsTableIcons>
              {pool.curveType === 1 && (
                <DarkTooltip title={STABLE_POOLS_TOOLTIP}>
                  <span>
                    <SvgIcon src={ScalesIcon} width="15px" height="15px" />
                  </span>
                </DarkTooltip>
              )}
              {hasLockedFunds && (
                <DarkTooltip
                  title={`Pool owner locked $${stripByAmountAndFormat(
                    lockedFundsValue,
                    2
                  )} liquidity until ${dayjs
                    .unix(vesting.endTs)
                    .format('MMM DD, YYYY')} `}
                >
                  <span>
                    <SvgIcon src={CrownIcon} width="15px" height="15px" />
                  </span>
                </DarkTooltip>
              )}
            </PoolsTableIcons>
          </FlexBlock>
        ),
      },
      tvl: {
        rawValue: tvlUSD,
        rendered: (
          <>
            <Text size="sm">
              {tvlUSD > 0 ? `$${stripByAmountAndFormat(tvlUSD, 4)}` : '-'}
            </Text>
            <Text size="sm" margin="10px 0" color="gray1">
              {stripByAmountAndFormat(
                pool.tvl.tokenA,
                getNumberOfPrecisionDigitsForSymbol(baseName)
              )}{' '}
              {baseName} /{' '}
              {stripByAmountAndFormat(
                pool.tvl.tokenB,
                getNumberOfPrecisionDigitsForSymbol(quoteName)
              )}{' '}
              {quoteName}
            </Text>
          </>
        ),
      },
      apr: {
        rawValue: totalApr,
        rendered: (
          <Text color="green3" size="sm" weight={700}>
            {totalApr >= 1 ? `${stripByAmountAndFormat(totalApr, 2)}%` : '< 1%'}
          </Text>
        ),
      },
      farming: {
        rendered: (
          <FlexBlock alignItems="center">
            {userInFarming && walletPk !== pool.initializerAccount ? (
              <>
                TODO
                {/* <FarmingRewardsIcons
                  poolMint={pool.swapToken}
                  mints={openFarmingsKeys}
                />
                <div>
                  <InlineText color="gray0" size="sm">
                    {openFarmingsKeys
                      .map((ft) => getTokenNameByMintAddress(ft))
                      .join(' x ')}
                  </InlineText>
                  <div>
                    <InlineText color="gray0" size="sm">
                      Available to claim:
                    </InlineText>
                  </div>
                  <div>
                    <Text color="green3" size="sm">
                      {availableToClaim
                        .map(
                          (atc) =>
                            `${stripByAmountAndFormat(atc.amount, 4)} ${
                              atc.name
                            }`
                        )
                        .join(' + ')}
                    </Text>
                  </div>
                </div> */}
              </>
            ) : (
              <FarmingRewards
                pool={pool}
                farm={farm}
                farmer={farmer?.account}
                farmingUsdValue={totalStakedLpTokensUSD}
              />
            )}
          </FlexBlock>
        ),
        rawValue: farmingAPR,
      },
      ...prepareMore(pool),
    },
  }
}

export const mergeColumns = (columns: DataHeadColumn[]) => [
  {
    key: 'pool',
    title: 'Pool',
    sortable: true,
    getWidth: (width: number) => Math.round(width * 1.5),
  },
  {
    key: 'tvl',
    title: 'Total Value Locked',
    sortable: true,
    getWidth: (width: number) => Math.round(width * 1.5),
  },
  ...columns,
  {
    key: 'apr',
    title: 'APR',
    sortable: true,
    hint: 'Estimation for growth of your deposit over a year, projected based on trading activity in the past 7d as well as farming rewards.',
  },
  {
    key: 'farming',
    title: 'Farming',
    sortable: true,
    hint: 'You can stake your pool tokens (derivatives received as a guarantee that you are a liquidity provider after a deposit into the pool), receiving a reward in tokens allocated by the creator of the pool. The amount of reward specified in the pool info is the amount you will receive daily for each $1,000 deposited into the pool.',
    getWidth: (w: number) => Math.round(w * 1.2),
  },
]

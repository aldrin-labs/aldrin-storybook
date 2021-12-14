import {
  stripByAmount,
  stripByAmountAndFormat,
} from '@core/utils/chartPageUtils'
import {
  DataCellValues,
  DataHeadColumn,
  DataTable,
  SORT_ORDER,
  DataCellValue,
  NoDataBlock,
} from '@sb/components/DataTable'
import CrownIcon from '@icons/crownIcon.svg'
import ScalesIcon from '@icons/scales.svg'
import { InlineText, Text } from '@sb/components/Typography'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import React, { useState, ReactNode } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FlexBlock } from '@sb/components/Layout'
import { useWallet } from '@sb/dexUtils/wallet'
import { useVesting } from '@sb/dexUtils/vesting'
import { DarkTooltip } from '@sb/components/TooltipCustom/Tooltip'
import { SvgIcon } from '@sb/components'
import { toMap, groupBy } from '@sb/utils'

import dayjs from 'dayjs'
import { BN } from 'bn.js'
import { Vesting } from '@sb/dexUtils/vesting/types'
import { DEFAULT_FARMING_TICKET_END_TIME } from '@sb/dexUtils/common/config'
import { DexTokensPrices, FarmingTicketsMap, PoolInfo } from '../../index.types'
import { FarmingRewards, FarmingRewardsIcons } from '../FarminRewards'
import { TokenIconsContainer } from './components'
import { getFarmingStateDailyFarmingValue } from './UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { symbolIncludesSearch } from './utils'
import { STABLE_POOLS_TOOLTIP } from '../Popups/CreatePool/PoolConfirmationData'
import { PoolsTableIcons } from './index.styles'
import { getUniqueAmountsToClaimMap } from './utils/getUniqueAmountsToClaimMap'

export interface PoolsTableProps {
  pools: PoolInfo[]
  tokenPrices: Map<string, DexTokensPrices>
  addColumns: DataHeadColumn[]
  searchValue?: string
  prepareCell: (pool: PoolInfo) => { [c: string]: DataCellValue }
  suffix: string
  noDataText?: ReactNode
  farmingTicketsMap: FarmingTicketsMap
}

const mergeColumns = (columns: DataHeadColumn[]) => [
  { key: 'pool', title: 'Pool', sortable: true },
  { key: 'tvl', title: 'Total Value Locked', sortable: true },
  ...columns,
  {
    key: 'apr',
    title: 'APR',
    sortable: true,
    hint: 'Estimation for growth of your deposit over a year, projected based on trading activity in the past 24h as well as farming rewards.',
  },
  {
    key: 'farming',
    title: 'Farming',
    sortable: true,
    hint: 'You can stake your pool tokens (derivatives received as a guarantee that you are a liquidity provider after a deposit into the pool), receiving a reward in tokens allocated by the creator of the pool. The amount of reward specified in the pool info is the amount you will receive daily for each $1,000 deposited into the pool.',
  },
]

const EMPTY_VESTING = {
  endTs: 0,
  startBalance: new BN(0),
}

const prepareCell = (params: {
  pool: PoolInfo
  tokenPrices: Map<string, DexTokensPrices>
  prepareMore: (pool: PoolInfo) => { [c: string]: DataCellValue }
  walletPk: string
  vestings: Map<string, Vesting>
  farmingTicketsMap: FarmingTicketsMap
}): DataCellValues<PoolInfo> => {
  const {
    pool,
    tokenPrices,
    prepareMore,
    walletPk,
    vestings,
    farmingTicketsMap,
  } = params
  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = tokenPrices.get(baseSymbol)?.price || 0
  const quoteTokenPrice = tokenPrices.get(quoteSymbol)?.price || 0

  const tvlUSD =
    baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

  const poolTokenPrice =
    calculatePoolTokenPrice({
      pool,
      dexTokensPricesMap: tokenPrices,
    }) || 0

  const totalStakedLpTokensUSD = Math.max(
    pool.lpTokenFreezeVaultBalance * poolTokenPrice,
    1000
  ) // When no liquidity staked - estimate APR for $1000

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
  // const hasLockedFunds = !!vesting.endTs
  const lockedFundsValue = vesting.startBalance.muln(poolTokenPrice)

  const farmingAPR =
    ((totalDailyRewardUsd * 365) / totalStakedLpTokensUSD) * 100 || 0

  const ticketsForPool = farmingTicketsMap.get(pool.swapToken) || []

  const availableToClaimMap = getUniqueAmountsToClaimMap({
    farmingTickets: ticketsForPool,
    farmingStates: pool.farming || [],
  })

  const availableToClaim = Array.from(availableToClaimMap.values()).map(
    (atc) => {
      const name = getTokenNameByMintAddress(atc.farmingTokenMint)
      const usdValue = (tokenPrices.get(name)?.price || 0) * atc.amount

      return { ...atc, name, usdValue }
    }
  )

  const availableToClaimUsd = availableToClaim.reduce(
    (acc, atc) => acc + atc.usdValue,
    0
  )

  const userInFarming =
    !!ticketsForPool.find(
      (t) => t.endTime === DEFAULT_FARMING_TICKET_END_TIME
    ) || availableToClaimUsd > 0

  const farmingsMap = groupBy(openFarmings, (f) => f.farmingTokenMint)

  const openFarmingsKeys = Array.from(farmingsMap.keys())

  return {
    extra: pool,
    fields: {
      pool: {
        rawValue: pool.parsedName,
        rendered: (
          <FlexBlock alignItems="center">
            <Link
              to={`/swap?base=${baseSymbol}&quote=${quoteSymbol}`}
              style={{ textDecoration: 'none' }}
              onClick={(e) => e.stopPropagation()}
            >
              <TokenIconsContainer tokenA={pool.tokenA} tokenB={pool.tokenB}>
                {!!walletPk && walletPk === pool.initializerAccount && (
                  <Text color="success" size="sm">
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
                  title={`Pool owner locked $${lockedFundsValue} liquidity until ${dayjs
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
            <Text size="sm">${stripByAmountAndFormat(tvlUSD)}</Text>
            <Text size="sm" margin="10px 0" color="hint">
              {stripByAmountAndFormat(pool.tvl.tokenA)} {baseSymbol} /{' '}
              {stripByAmountAndFormat(pool.tvl.tokenB)} {quoteSymbol}
            </Text>
          </>
        ),
      },
      apr: {
        rawValue: farmingAPR,
        rendered: (
          <Text color="success" size="sm" weight={700}>
            {stripByAmount(farmingAPR, 2)}%
          </Text>
        ),
      },
      farming: {
        rendered: (
          <FlexBlock alignItems="center">
            {userInFarming ? (
              <>
                <FarmingRewardsIcons
                  poolMint={pool.swapToken}
                  mints={openFarmingsKeys}
                />
                <div>
                  <InlineText size="sm">
                    {openFarmingsKeys
                      .map((ft) => getTokenNameByMintAddress(ft))
                      .join(' x ')}
                  </InlineText>
                  <div>
                    <InlineText size="sm">Available to claim:</InlineText>
                  </div>
                  <div>
                    <InlineText size="sm" color="success">
                      {availableToClaim
                        .map(
                          (atc) =>
                            `${stripByAmountAndFormat(atc.amount, 4)} ${
                              atc.name
                            }`
                        )
                        .join(' + ')}
                    </InlineText>
                  </div>
                </div>
              </>
            ) : (
              <FarmingRewards
                pool={pool}
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

export const PoolsTable: React.FC<PoolsTableProps> = (props) => {
  const {
    pools,
    tokenPrices,
    addColumns,
    searchValue = '',
    prepareCell: prepareMore,
    suffix,
    noDataText,
    farmingTicketsMap,
  } = props

  const [columns] = useState(mergeColumns(addColumns))

  const wallet = useWallet()
  const history = useHistory()

  const { data: vestings = [] } = useVesting()

  const vestingsByMint = toMap(vestings, (v) => v.mint.toBase58())

  const walletPk = wallet.wallet.publicKey?.toBase58() || ''

  const data = pools
    .filter((pool) =>
      symbolIncludesSearch(
        `${getTokenNameByMintAddress(pool.tokenA)}_${getTokenNameByMintAddress(
          pool.tokenB
        )}`,
        searchValue
      )
    )
    .map((pool) =>
      prepareCell({
        pool,
        tokenPrices,
        prepareMore,
        walletPk,
        vestings: vestingsByMint,
        farmingTicketsMap,
      })
    )

  return (
    <DataTable
      name={`pools_table_${suffix}`}
      data={data}
      columns={columns}
      defaultSortColumn="apr"
      defaultSortOrder={SORT_ORDER.ASC}
      onRowClick={(e, row) => {
        e.preventDefault()
        history.push(`/pools/${row.extra.parsedName}`)
      }}
      noDataText={
        noDataText || (
          <NoDataBlock justifyContent="center">No pools available.</NoDataBlock>
        )
      }
    />
  )
}

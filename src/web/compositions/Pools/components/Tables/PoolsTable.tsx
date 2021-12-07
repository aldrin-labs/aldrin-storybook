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
import ScalesIcon from '@icons/scales.svg'
import { Text } from '@sb/components/Typography'
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
import { toMap } from '@sb/utils'
import { DexTokensPrices, PoolInfo } from '../../index.types'
import { FarmingRewards } from '../FarminRewards'
import { TokenIconsContainer } from './components'
import { getFarmingStateDailyFarmingValue } from './UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { symbolIncludesSearch } from './utils'
import { STABLE_POOLS_TOOLTIP } from '../Popups/CreatePool/PoolConfirmationData'
import { Vesting } from '../../../../dexUtils/vesting/types'

export interface PoolsTableProps {
  pools: PoolInfo[]
  tokenPrices: Map<string, DexTokensPrices>
  addColumns: DataHeadColumn[]
  searchValue?: string
  prepareCell: (pool: PoolInfo) => { [c: string]: DataCellValue }
  suffix: string
  noDataText?: ReactNode
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

const prepareCell = (params: {
  pool: PoolInfo
  tokenPrices: Map<string, DexTokensPrices>
  prepareMore: (pool: PoolInfo) => { [c: string]: DataCellValue }
  walletPk: string
  vestings: Map<string, Vesting>
}): DataCellValues<PoolInfo> => {
  const { pool, tokenPrices, prepareMore, walletPk, vestings } = params
  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = tokenPrices.get(baseSymbol)?.price || 0
  const quoteTokenPrice = tokenPrices.get(quoteSymbol)?.price || 0

  const tvlUSD =
    baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB

  const poolTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap: tokenPrices,
  })

  const totalStakedLpTokensUSD = pool.lpTokenFreezeVaultBalance * poolTokenPrice

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

  const vesting = vestings.get(pool.poolTokenMint)

  const farmingAPR =
    ((totalDailyRewardUsd * 365) / totalStakedLpTokensUSD) * 100

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
            {pool.curveType === 1 && (
              <DarkTooltip title={STABLE_POOLS_TOOLTIP}>
                <SvgIcon src={ScalesIcon} width="15px" height="15px" />
              </DarkTooltip>
            )}
            {!!vesting && '👑'}
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
            <FarmingRewards
              pool={pool}
              farmingUsdValue={totalStakedLpTokensUSD}
            />
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

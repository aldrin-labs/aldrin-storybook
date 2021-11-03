import React from 'react'
import { DataTable, DataHead, DataCellValues } from '@sb/components/DataTable'
import { PoolInfo, DexTokensPrices, FeesEarned } from '../../index.types'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { Link } from 'react-router-dom'
import { TokenIconsContainer } from './components'
import { RowDataTdTopText, RowDataTdText, TextColumnContainer } from './index.styles'
import { stripByAmountAndFormat } from '@core/utils/chartPageUtils'
import { filterOpenFarmingStates } from '@sb/dexUtils/pools/filterOpenFarmingStates'
import { getFarmingStateDailyFarmingValue } from './UserLiquidity/utils/getFarmingStateDailyFarmingValue'
import { calculatePoolTokenPrice } from '@sb/dexUtils/pools/calculatePoolTokenPrice'
import { TokenIcon } from '@sb/components/TokenIcon'
import { Row } from '@sb/components/Layout'
import { Text } from '../../../../components/Typography'
import { getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity } from './UserLiquidity/utils/getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity'
import { COLORS } from '../../../../../variables/variables'

export interface PoolsTableProps {
  pools: PoolInfo[]
  tokenPrices: DexTokensPrices[]
  feesByAccount: FeesEarned[]
}

const CELLS: DataHead[] = [
  { key: 'pool', title: 'Pool' },
  { key: 'tvl', title: 'Total Value Locked' },
  {
    key: 'apr',
    title: 'APR',
    hint: 'Estimation for growth of your deposit over a year, projected based on trading activity in the past 24h as well as farming rewards.',
  },
  {
    key: 'farming',
    title: 'Farming',
    hint: 'You can stake your pool tokens (derivatives received as a guarantee that you are a liquidity provider after a deposit into the pool), receiving a reward in tokens allocated by the creator of the pool. The amount of reward specified in the pool info is the amount you will receive daily for each $1,000 deposited into the pool.'
  },
]

const prepareCell = (params: {
  pool: PoolInfo,
  dexTokensPricesMap: Map<string, DexTokensPrices>,
  feesMap: Map<string, FeesEarned>
}): DataCellValues => {
  const { pool, dexTokensPricesMap } = params
  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)


  const baseTokenPrice = dexTokensPricesMap.get(baseSymbol)?.price || 0
  const quoteTokenPrice = dexTokensPricesMap.get(quoteSymbol)?.price || 0

  const tvlUSD =
    baseTokenPrice * pool.tvl.tokenA + quoteTokenPrice * pool.tvl.tokenB



  const poolTokenPrice = calculatePoolTokenPrice({
    pool,
    dexTokensPricesMap,
  })

  const totalStakedLpTokensUSD = pool.lpTokenFreezeVaultBalance * poolTokenPrice

  const openFarmings = filterOpenFarmingStates(pool.farming || [])
  const isPoolWithFarming = pool.farming && pool.farming.length > 0

  const totalDailyRewardUsd = openFarmings.reduce(
    (acc, farmingState) => {
      const dailyReward = getFarmingStateDailyFarmingValue(
        { farmingState, totalStakedLpTokensUSD }
      )

      const farmingTokenSymbol = getTokenNameByMintAddress(farmingState.farmingTokenMint || '')

      const farmingTokenPrice = dexTokensPricesMap.get(farmingTokenSymbol)?.price || 0

      const dailyRewardUsd = dailyReward * farmingTokenPrice

      return (
        acc + dailyRewardUsd
      )
    },
    0
  )

  const farmingAPR = (totalDailyRewardUsd * 365) / totalStakedLpTokensUSD * 100

  const farmingRendered = isPoolWithFarming ?
    (
      <div>
        {openFarmings.map((farmingState) =>
          <TokenIcon
            mint={farmingState.farmingTokenMint}
            width={'1.5em'}
            emojiIfNoLogo={false}
            key={`farmin_icon_${farmingState.farmingTokenMint}`}
          />
        )}
        <div>
          <Text>
            {openFarmings.map((farmingState) => getTokenNameByMintAddress(farmingState.farmingTokenMint || '')).join(' ✕ ')}
          </Text>
          {openFarmings.length === 0 ?
            <Text color="success">Ended</Text> :
            <>
              {
                openFarmings.map((farmingState, i, arr) => {
                  const rewardPerK = getFarmingStateDailyFarmingValuePerThousandDollarsLiquidity(
                    { farmingState, totalStakedLpTokensUSD }
                  )

                  return (
                    <RowDataTdText>
                      <Text color="success">
                        {stripByAmountAndFormat(rewardPerK)}
                      </Text>{' '}
                      {getTokenNameByMintAddress(farmingState.farmingTokenMint || '')}
                      {/* + between every farming state token to be farmed, except last. for last - per day */}
                      {<span> {i === arr.length - 1 ? '/ Day' : '+'} </span>}
                    </RowDataTdText>
                  )
                })
              }
              <Text>for each <span style={{ color: COLORS.success }}>$1000</span></Text>
            </>
          }
        </div>
      </div>
    ) : <span>-</span>

  return {
    pool: {
      rawValue: pool.parsedName,
      rendered:
        <Link
          to={`/swap?base=${baseSymbol}&quote=${quoteSymbol}`}
          style={{ textDecoration: 'none' }}
        >
          <TokenIconsContainer
            needHover={true}
            tokenA={pool.tokenA}
            tokenB={pool.tokenB}
          />
        </Link>,
    },
    tvl: {
      rawValue: tvlUSD,
      rendered:
        <TextColumnContainer>
          <RowDataTdTopText >
            ${stripByAmountAndFormat(tvlUSD)}
          </RowDataTdTopText>
          <RowDataTdText>
            {stripByAmountAndFormat(pool.tvl.tokenA)}{' '}
            {baseSymbol} /{' '}
            {stripByAmountAndFormat(pool.tvl.tokenB)}{' '}
            {quoteSymbol}
          </RowDataTdText>
        </TextColumnContainer>,
    },
    apr: {
      rawValue: farmingAPR,
    },
    farming: {
      rendered: farmingRendered,
      rawValue: farmingAPR,
    }
  }
}

export const PoolsTable: React.FC<PoolsTableProps> = (props) => {

  // console.log('props:', props)

  const { pools, tokenPrices, feesByAccount } = props

  const dexTokensPricesMap = tokenPrices.reduce(
    (acc, tokenPrice) => acc.set(tokenPrice.symbol, tokenPrice),
    new Map<string, DexTokensPrices>()
  )

  const feesMap = feesByAccount.reduce(
    (acc, feesEarned) => acc.set(feesEarned.pool, feesEarned),
    new Map<string, FeesEarned>()
  )


  const data: DataCellValues[] = pools.map((pool) => prepareCell({ pool, dexTokensPricesMap, feesMap }))

  return (
    <DataTable name="pools_table" data={data} cells={CELLS} />
  )
}
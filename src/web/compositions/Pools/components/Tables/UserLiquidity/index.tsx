import { DataCellValue, DataHeadColumn, NoDataBlock } from '@sb/components/DataTable'
import {
  FarmingTicketsMap, FeesMap, PoolInfo,
  TokenPricesMap
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { getStakedTokensForPool } from '@sb/dexUtils/common/getStakedTokensForPool'
import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'
import { calculateWithdrawAmount } from '@sb/dexUtils/pools'
import React from 'react'
import { getTokenDataByMint } from '../../../utils'
import { PoolsTable } from '../PoolsTable'
import { ConnectWalletWrapper } from '../../../../../components/ConnectWalletWrapper'
import { stripByAmountAndFormat } from '../../../../../../../../core/src/utils/chartPageUtils'
import { Text } from '../../../../../components/Typography'


interface LiquidityTableProps {
  searchValue: string
  pools: PoolInfo[]
  allTokensData: TokenInfo[]
  dexTokensPricesMap: TokenPricesMap
  farmingTicketsMap: FarmingTicketsMap
  feesByPoolForUser: FeesMap
}


const COLUMNS: DataHeadColumn[] = [
  { key: 'userLiquidity', title: 'Your liquidity (Incl. Fees)', sortable: true },
  { key: 'feesEarned', title: 'Fees Earned', sortable: true },
]


interface PrepareCellParams {
  pool: PoolInfo
  tokenPrices: TokenPricesMap
  allTokensData: TokenInfo[]
  feesByPool: FeesMap
  farmingTicketsMap: FarmingTicketsMap
}
const prepareCell = (params: PrepareCellParams): { [c: string]: DataCellValue } => {
  const {
    pool,
    tokenPrices,
    allTokensData,
    farmingTicketsMap,
    feesByPool,
  } = params


  const baseSymbol = getTokenNameByMintAddress(pool.tokenA)
  const quoteSymbol = getTokenNameByMintAddress(pool.tokenB)

  const baseTokenPrice = tokenPrices.get(baseSymbol)?.price || 0
  const quoteTokenPrice = tokenPrices.get(quoteSymbol)?.price || 0

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


  const userLiquidityUSD =
    baseTokenPrice * userAmountTokenA + quoteTokenPrice * userAmountTokenB

  const feesEarnedByUserForPool = feesByPool.get(
    pool.swapToken
  ) || { totalBaseTokenFee: 0, totalQuoteTokenFee: 0 }

  const feesUsd =
    feesEarnedByUserForPool.totalBaseTokenFee * baseTokenPrice +
    feesEarnedByUserForPool.totalQuoteTokenFee * quoteTokenPrice

  return {
    userLiquidity: {
      rendered: (
        <>
          <Text>
            ${stripByAmountAndFormat(userLiquidityUSD + feesUsd, 4)}
          </Text>
          <Text color="hint" margin="10px 0">
            {stripByAmountAndFormat(
              userAmountTokenA + feesEarnedByUserForPool.totalBaseTokenFee
            )}{' '}
            {getTokenNameByMintAddress(pool.tokenA)} /{' '}
            {stripByAmountAndFormat(
              userAmountTokenB + feesEarnedByUserForPool.totalQuoteTokenFee
            )}{' '}
            {getTokenNameByMintAddress(pool.tokenB)}
          </Text>

        </>
      ),
      rawValue: userLiquidityUSD + feesUsd

    },
    feesEarned: {
      rendered:
        <Text>
          ${stripByAmountAndFormat(feesUsd, 4)}
        </Text>,

      rawValue: feesUsd

    },
  }
}


export const UserLiquidityTable: React.FC<LiquidityTableProps> = (props) => {

  const {
    searchValue,
    dexTokensPricesMap,
    pools,
    feesByPoolForUser,
    allTokensData,
    farmingTicketsMap,
  } = props

  return (
    <PoolsTable
      addColumns={COLUMNS}
      pools={pools}
      tokenPrices={dexTokensPricesMap}
      searchValue={searchValue}
      prepareCell={(pool) => prepareCell({
        pool,
        feesByPool: feesByPoolForUser,
        tokenPrices: dexTokensPricesMap,
        allTokensData,
        farmingTicketsMap: farmingTicketsMap
      })}
      noDataText={
        <ConnectWalletWrapper>
          <NoDataBlock>No pools available</NoDataBlock>
        </ConnectWalletWrapper>
      }
      suffix="user"
    />
  )
}


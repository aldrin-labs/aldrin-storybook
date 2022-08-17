import {
  FarmingTicketsMap,
  FeesMap,
  PoolInfo,
  TokenPricesMap,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

import { Farm } from '@core/solana'

export interface LiquidityTableProps {
  searchValue: string
  pools: PoolInfo[]
  allTokensData: TokenInfo[]
  dexTokensPricesMap: TokenPricesMap
  farmingTicketsMap: FarmingTicketsMap
  feesByPoolForUser: FeesMap
  farms?: Map<string, Farm>
}

export interface PrepareCellParams {
  pool: PoolInfo
  tokenPrices: TokenPricesMap
  allTokensData: TokenInfo[]
  feesByPool: FeesMap
  farmingTicketsMap: FarmingTicketsMap
}

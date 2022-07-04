import {
  FarmingTicketsMap,
  FeesMap,
  PoolInfo,
  TokenPricesMap,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'


export interface LiquidityTableProps {
  searchValue: string
  pools: PoolInfo[]
  allTokensData: TokenInfo[]
  dexTokensPricesMap: TokenPricesMap
  farmingTicketsMap: FarmingTicketsMap
  feesByPoolForUser: FeesMap
}

export interface PrepareCellParams {
  pool: PoolInfo
  tokenPrices: TokenPricesMap
  allTokensData: TokenInfo[]
  feesByPool: FeesMap
  farmingTicketsMap: FarmingTicketsMap
  tokensMap: Map<string, TokenInfo>
}

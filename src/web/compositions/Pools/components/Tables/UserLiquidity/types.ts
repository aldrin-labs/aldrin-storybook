import { ProgramAccount } from 'anchor024'

import {
  FeesMap,
  PoolInfo,
  TokenPricesMap,
} from '@sb/compositions/Pools/index.types'
import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'

import { Farm, Farmer } from '@core/solana'

export interface LiquidityTableProps {
  searchValue: string
  pools: PoolInfo[]
  allTokensData: TokenInfo[]
  dexTokensPricesMap: TokenPricesMap
  feesByPoolForUser: FeesMap
}

export interface PrepareCellParams {
  pool: PoolInfo
  tokenPrices: TokenPricesMap
  allTokensData: TokenInfo[]
  feesByPool: FeesMap
  tokensMap: Map<string, TokenInfo>
  farms?: Map<string, Farm>
  farmers?: Map<string, ProgramAccount<Farmer>>
}

import { ApolloQueryResult } from 'apollo-client'
import { Token } from '@sb/components/TokenSelector/SelectTokenModal'
import { Pool, PoolV2 } from '@sb/dexUtils/common/types'
import { TokenInfo } from '@sb/dexUtils/types'

import { DexTokensPrices, PoolInfo } from '../../../index.types'

export interface WithFarming {
  farming: {
    token: Token
    tokenAmount: string
    farmingPeriod: string
    vestingEnabled: boolean
    vestingPeriod?: string
  }
}

interface FirstDepositType {
  baseTokenAmount: string
  quoteTokenAmount: string
}

export interface FarmingFormType extends WithFarming {
  baseToken?: Token
  quoteToken?: Token
  firstDeposit?: FirstDepositType
}

export interface CreatePoolFormType extends WithFarming {
  price: string
  baseToken?: Token
  quoteToken?: Token
  stableCurve: boolean
  lockInitialLiquidity: boolean
  initialLiquidityLockPeriod: string
  firstDeposit: FirstDepositType
  farmingEnabled: boolean
}

export interface CreatePoolProps {
  onClose: () => void
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
  dexTokensPricesMap: Map<string, DexTokensPrices>
}

export interface CreatePoolFormProps {
  onClose: () => void
  userTokens: TokenInfo[]
  pools: (Pool | PoolV2)[]
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
  dexTokensPricesMap: Map<string, DexTokensPrices>
}

import { Token } from '@sb/components/TokenSelector/SelectTokenModal'

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
  baseToken: Token
  quoteToken: Token
  stableCurve: boolean
  lockInitialLiquidity: boolean
  initialLiquidityLockPeriod: string
  firstDeposit: FirstDepositType
  farmingEnabled: boolean
}

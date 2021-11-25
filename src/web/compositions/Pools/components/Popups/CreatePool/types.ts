import { Token } from "@sb/components/TokenSelector/SelectTokenModal";

export interface CreatePoolFormType {
  baseToken: Token
  quoteToken: Token
  stableCurve: boolean
  lockInitialLiquidity: boolean,
  initialLiquidityLockPeriod: number
  firstDeposit: {
    baseTokenAmount: number
    quoteTokenAmount: number
  }
  farmingEnabled: boolean
  farming: {
    token: Token
    tokenAmount: number
    farmingPeriod: number
    vestingEnabled: boolean
    vestingPeriod?: number
  }
}
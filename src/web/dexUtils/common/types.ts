export type FarmingTicket = {
  tokensFrozen: number
  endTime: string
  startTime: string
  pool: string
  farmingTicket: string
  userKey: string
  amountsToClaim: { amount: number; farmingState: string }[]
  statesAttached?: { farmingState: string }[]
}

export type PoolAddress = string

export type FarmingState = {
  farmingState: string
  farmingTokenVault: string
  farmingTokenMint?: string
  farmingTokenMintDecimals?: number
  farmingSnapshots: string
  tokensUnlocked: number
  tokensTotal: number
  startTime: number
  tokensPerPeriod: number
  periodLength: number
  vestingPeriod: number
}

export type StakingSnapshot = {
  isInitialized: boolean
  tokensFrozen: number
  tokensTotal: number
  time: number
}

export type StakingSnapshotQueue = {
  publicKey: string
  nextIndex: number
  snapshots: StakingSnapshot[]
}

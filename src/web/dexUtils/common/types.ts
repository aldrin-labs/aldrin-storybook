export type FarmingTicket = {
  tokensFrozen: number
  endTime: string
  startTime: string
  pool: string
  farmingTicket: string
  userKey: string
  amountsToClaim: AmountToClaim[]
  statesAttached: StateAttached[]
}

export type PoolAddress = string

export type AmountToClaim = { amount: number; farmingState: string }

export type StateAttached = {
  farmingState: string
  lastVestedWithdrawTime: number
  lastWithdrawTime: number
}

export type FarmingState = {
  farmingState: string
  farmingTokenVault: string
  farmingTokenMint?: string
  farmingTokenMintDecimals?: number
  farmingSnapshots: string
  tokensUnlocked: number
  tokensTotal: number
  startTime: number
  currentTime: number
  tokensPerPeriod: number
  periodLength: number
  vestingPeriod: number
}

export type Snapshot = {
  isInitialized: boolean
  tokensFrozen: number
  tokensTotal: number
  time: number
}

export type SnapshotQueue = {
  publicKey: string
  nextIndex: number
  snapshots: Snapshot[]
}

export type FarmingTicket = {
  tokensFrozen: number
  endTime: string
  startTime: number
  pool: string
  farmingTicket: string
  amountsToClaim: { amount: number; farmingState: string }[]
}

export type PoolAddress = string

export type FarmingState = {
  farmingState: string
  farmingTokenVault: string
  farmingTokenMint: string
  farmingSnapshots: string
  tokensUnlocked: number
  tokensTotal: number
  startTime: number
  tokensPerPeriod: number
  periodLength: number
  vestingPeriod: number
}

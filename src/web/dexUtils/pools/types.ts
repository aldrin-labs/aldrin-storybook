export type FarmingTicket = {
  tokensFrozen: number
  endTime: string
  startTime: number
  pool: string
  farmingTicket: string
  amountsToClaim: { amount: number; farmingState: string }[]
}
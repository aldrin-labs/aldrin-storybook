import { FarmingTicket } from './endFarming'

export const getAvailableFarmingTokensForPool = (
  farmingTickets: FarmingTicket[]
) => {
  return (
    farmingTickets.reduce(
      (acc, ticket) => acc + ticket.amountsToClaim[0].amount,
      0
    ) || 0
  )
}

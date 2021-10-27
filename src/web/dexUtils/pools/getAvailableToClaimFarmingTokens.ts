import { FarmingTicket } from '../common/types'

export const getAvailableToClaimFarmingTokens = (
  farmingTickets: FarmingTicket[]
) => {
  return (
    farmingTickets.reduce(
      (acc, ticket) => acc + ticket.amountsToClaim[0].amount,
      0
    ) || 0
  )
}

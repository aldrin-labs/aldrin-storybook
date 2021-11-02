import { getTotalFarmingAmountToClaim } from '../common/getTotalFarmingAmountToClaim'
import { FarmingTicket } from '../common/types'

export const getAvailableToClaimFarmingTokens = (
  farmingTickets: FarmingTicket[]
) => {
  return (
    farmingTickets.reduce(
      (acc, ticket) => acc + getTotalFarmingAmountToClaim(ticket),
      0
    ) || 0
  )
}

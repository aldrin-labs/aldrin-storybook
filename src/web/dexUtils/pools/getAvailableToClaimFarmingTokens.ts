import { getTotalFarmingAmountToClaim } from '../common/getTotalFarmingAmountToClaim'
import { FarmingTicket } from '../common/types'
import { MIN_POOL_TOKEN_AMOUNT_TO_STAKE } from '../common/config'

export const getAvailableToClaimFarmingTokens = (
  farmingTickets: FarmingTicket[]
) => {
  return (
    farmingTickets
      .filter((ft) => ft.tokensFrozen > MIN_POOL_TOKEN_AMOUNT_TO_STAKE)
      .reduce(
        (acc, ticket) => acc + getTotalFarmingAmountToClaim(ticket),
        0
      ) || 0
  )
}

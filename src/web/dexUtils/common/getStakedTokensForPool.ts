import { filterClosedFarmingTickets } from "./filterClosedFarmingTickets"
import { FarmingTicket } from "../common/types"

export const getStakedTokensForPool = (farmingTickets: FarmingTicket[]) => {
  return (
    filterClosedFarmingTickets(farmingTickets).reduce(
      (acc, ticket) => acc + ticket.tokensFrozen,
      0
    ) || 0
  )
}

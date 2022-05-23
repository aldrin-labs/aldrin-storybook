import { filterOpenFarmingTickets } from '@core/solana'

import { FarmingTicket } from './types'

export const getStakedTokensFromOpenFarmingTickets = (
  farmingTickets: FarmingTicket[]
) => {
  return filterOpenFarmingTickets(farmingTickets).reduce(
    (acc, ticket) => acc + ticket.tokensFrozen,
    0
  )
}

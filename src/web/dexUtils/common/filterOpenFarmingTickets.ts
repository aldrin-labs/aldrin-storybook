import { DEFAULT_FARMING_TICKET_END_TIME } from "./config"
import { FarmingTicket } from "./types"

// closed farming tickets - which was unstaked
export const filterOpenFarmingTickets = (
  tickets: FarmingTicket[] | undefined
) => {
  if (!tickets) {
    return []
  }

  return tickets.filter(
    (ticket) => ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME
  )
}
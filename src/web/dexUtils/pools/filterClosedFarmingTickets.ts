import { DEFAULT_FARMING_TICKET_END_TIME } from "./config"

// closed farming tickets - which was unstaked
export const filterClosedFarmingTickets = (
  tickets: FarmingTicket[] | undefined
) => {
  if (!tickets) {
    return []
  }

  return tickets.filter(
    (ticket) => ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME
  )
}

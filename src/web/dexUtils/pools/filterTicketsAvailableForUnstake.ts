import { FarmingState, FarmingTicket } from '../common/types'

export const filterTicketsAvailableForUnstake = (
  farmingTickets: FarmingTicket[],
  farmingState: FarmingState
) => {
  const filteredTicketsAvailableForUnstake = farmingTickets.filter(
    (ticket) =>
      +ticket.startTime + farmingState.periodLength + 60 * 20 <
      Date.now() / 1000
  )

  return filteredTicketsAvailableForUnstake
}

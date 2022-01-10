import { FarmingState, FarmingTicket } from '../common/types'

export const UNLOCK_STAKED_AFTER = 60 * 20
export const filterTicketsAvailableForUnstake = (
  farmingTickets: FarmingTicket[],
  farmingState: FarmingState
) => {
  const filteredTicketsAvailableForUnstake = farmingTickets?.filter(
    (ticket) =>
      +ticket?.startTime + farmingState?.periodLength + UNLOCK_STAKED_AFTER <
      Date.now() / 1000
  )

  return filteredTicketsAvailableForUnstake
}

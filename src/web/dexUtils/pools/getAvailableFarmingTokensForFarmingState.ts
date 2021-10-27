import { FarmingTicket } from './types'

export const getAvailableFarmingTokensForFarmingState = ({
  farmingTickets,
  farmingState,
}: {
  farmingTickets: FarmingTicket[]
  farmingState: string
}) => {
  return (
    farmingTickets
      .map((ticket) =>
        ticket.amountsToClaim.filter(
          (amount) => amount.farmingState === farmingState
        )
      )
      .flat()
      .reduce((acc, ticketAmount) => acc + ticketAmount.amount, 0) || 0
  )
}

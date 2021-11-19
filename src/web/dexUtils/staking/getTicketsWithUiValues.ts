import { FarmingTicket } from '../common/types'

export const getTicketsWithUiValues = ({
  tickets,
  farmingTokenMintDecimals,
}: {
  tickets: FarmingTicket[]
  farmingTokenMintDecimals: number
}) => {
  return tickets.map((ticket) => ({
    ...ticket,
    tokensFrozen: ticket.tokensFrozen / 10 ** farmingTokenMintDecimals,
  }))
}

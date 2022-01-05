import { PublicKey } from '@solana/web3.js'

import { FarmingTicket } from '../common/types'

export const filterFarmingTicketsByUserKey = ({
  allFarmingTickets,
  walletPublicKey,
}: {
  allFarmingTickets: FarmingTicket[]
  walletPublicKey: PublicKey
}) => {
  return allFarmingTickets.filter(
    (tickets) => tickets.userKey === walletPublicKey.toString()
  )
}

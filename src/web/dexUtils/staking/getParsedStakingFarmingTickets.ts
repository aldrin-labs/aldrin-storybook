import { Connection, PublicKey } from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadStakingFarmingTickets } from './loadStakingFarmingTickets'
import { FarmingTicket } from '../common/types'

export const getParsedStakingFarmingTickets = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<FarmingTicket[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const tickets = await loadStakingFarmingTickets({
    wallet,
    connection,
  })

  const allUserTicketsPerPool = tickets.map((ticket) => {
    const data = Buffer.from(ticket.account.data)
    const ticketData = program.coder.accounts.decode('FarmingTicket', data)

    return {
      tokensFrozen: ticketData.tokensFrozen.toNumber(),
      endTime: ticketData.endTime.toString(),
      startTime: ticketData.startTime.toString(),
      pool: ticketData.pool.toString(),
      farmingTicket: ticket.pubkey.toString(),
      amountsToClaim: [{ amount: 0, farmingState: '' }],
    }
  })

  return allUserTicketsPerPool
}

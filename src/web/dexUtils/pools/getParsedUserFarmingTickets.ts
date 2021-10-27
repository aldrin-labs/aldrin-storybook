import { Connection, PublicKey } from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadFarmingTickets } from './loadFarmingTickets'
import { FarmingTicket } from '../common/types'

export const getParsedUserFarmingTickets = async ({
  wallet,
  connection,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey?: PublicKey
}): Promise<FarmingTicket[]> => {
  if (!wallet.publicKey) return []

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const userTicketsPerPool = await loadFarmingTickets({
    wallet,
    connection,
    poolPublicKey,
    walletPublicKey: wallet.publicKey,
  })

  const parsedUserTicketsPerPool = userTicketsPerPool.map((ticket) => {
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

  return parsedUserTicketsPerPool
}

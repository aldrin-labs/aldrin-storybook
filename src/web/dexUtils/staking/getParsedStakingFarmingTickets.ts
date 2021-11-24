import { Connection, PublicKey } from '@solana/web3.js'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadStakingFarmingTickets } from './loadStakingFarmingTickets'
import { FarmingTicket } from '../common/types'
import { STAKING_FARMING_TOKEN_DIVIDER } from './config'

export const getParsedStakingFarmingTickets = async ({
  wallet,
  connection,
  walletPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
}): Promise<FarmingTicket[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const tickets = await loadStakingFarmingTickets({
    wallet,
    connection,
    walletPublicKey,
  })

  const allUserTicketsPerPool = tickets.map((ticket) => {
    const data = Buffer.from(ticket.account.data)
    const ticketData = program.coder.accounts.decode('FarmingTicket', data)

    const statesAttached = ticketData.statesAttached
      .map((el) => {
        return {
          farmingState: el.farmingState.toString(),
          lastVestedWithdrawTime: el.lastVestedWithdrawTime.toNumber(),
          lastWithdrawTime: el.lastWithdrawTime.toNumber(),
        }
      })
      .filter((el) => el.lastWithdrawTime > 0)

    return {
      tokensFrozen: parseFloat(ticketData.tokensFrozen.toString()),
      endTime: ticketData.endTime.toString(),
      startTime: ticketData.startTime.toString(),
      pool: ticketData.pool.toString(),
      farmingTicket: ticket.pubkey.toString(),
      userKey: ticketData.userKey.toString(),
      amountsToClaim: [{ amount: 0, farmingState: '' }],
      statesAttached,
    }
  })

  return allUserTicketsPerPool
}

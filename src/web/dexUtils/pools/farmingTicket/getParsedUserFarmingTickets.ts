import { Connection, PublicKey } from '@solana/web3.js'

import { FarmingTicket } from '@sb/dexUtils/common/types'
import { WalletAdapter } from '@sb/dexUtils/types'

import {
  ProgramsMultiton,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
} from '@core/solana'

import { loadFarmingTickets } from './loadFarmingTickets'
import { parseFarmingTickets } from './parseFarmingTickets'

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

  // load tickets from all pools programs
  const [ticketsFromPoolsV1, ticketsFromPoolsV2] = await Promise.all([
    loadFarmingTickets({
      wallet,
      connection,
      poolPublicKey,
      walletPublicKey: wallet.publicKey,
      programId: POOLS_PROGRAM_ADDRESS,
    }),
    loadFarmingTickets({
      wallet,
      connection,
      poolPublicKey,
      walletPublicKey: wallet.publicKey,
      programId: POOLS_V2_PROGRAM_ADDRESS,
    }),
  ])

  const programV1 = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const parsedTicketsFromPoolsV1 = parseFarmingTickets({
    tickets: ticketsFromPoolsV1,
    program: programV1,
  })

  const programV2 = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_V2_PROGRAM_ADDRESS,
  })

  const parsedTicketsFromPoolsV2 = parseFarmingTickets({
    tickets: ticketsFromPoolsV2,
    program: programV2,
  })

  return [...parsedTicketsFromPoolsV1, ...parsedTicketsFromPoolsV2]
}

import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { notify, notifyForDevelop } from '../notifications'
import { NUMBER_OF_RETRIES } from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { WalletAdapter } from '../types'
import { loadAccountsFromPoolsProgram } from './loadAccountsFromPoolsProgram'

// (2 ** 63) - 1
const DEFAULT_FARMING_TICKET_END_TIME = '9223372036854775807'

const loadUserFarmingTickets = async ({
  wallet,
  connection,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey?: PublicKey
}) => {
  const filterByPoolPublicKey = poolPublicKey
    ? [
        {
          memcmp: {
            offset: 64,
            bytes: poolPublicKey.toBase58(),
          },
        },
      ]
    : []

  return await loadAccountsFromPoolsProgram({
    connection,
    filters: [
      {
        dataSize: 584,
      },
      {
        memcmp: {
          offset: 32,
          bytes: wallet.publicKey.toBase58(),
        },
      },
      ...filterByPoolPublicKey,
    ],
  })
}

export type FarmingTicket = {
  tokensFrozen: number
  endTime: string
  startTime: number
  pool: string
  farmingTicket: PublicKey
}

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

export const getParsedUserFarmingTickets = async ({
  wallet,
  connection,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey?: PublicKey
}): Promise<FarmingTicket[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const tickets = await loadUserFarmingTickets({
    wallet,
    connection,
    poolPublicKey,
  })

  const allUserTicketsPerPool = tickets.map((ticket) => {
    const data = Buffer.from(ticket.account.data)
    const ticketData = program.coder.accounts.decode('FarmingTicket', data)

    return {
      tokensFrozen: ticketData.tokensFrozen.toNumber(),
      endTime: ticketData.endTime.toString(),
      startTime: ticketData.startTime.toString(),
      pool: ticketData.pool.toString(),
      farmingTicket: ticket.pubkey,
    }
  })

  return allUserTicketsPerPool
}

export const endFarming = async ({
  wallet,
  connection,
  poolPublicKey,
  farmingStatePublicKey,
  snapshotQueuePublicKey,
  userPoolTokenAccount,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  farmingStatePublicKey: PublicKey
  snapshotQueuePublicKey: PublicKey
  userPoolTokenAccount: PublicKey
}) => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const { lpTokenFreezeVault } = await program.account.pool.fetch(poolPublicKey)

  const allUserTicketsPerPool = await getParsedUserFarmingTickets({
    wallet,
    connection,
    poolPublicKey,
  })

  const commonTransaction = new Transaction()

  for (let ticketData of allUserTicketsPerPool) {
    const endFarmingTransaction = await program.instruction.endFarming({
      accounts: {
        pool: poolPublicKey,
        farmingState: farmingStatePublicKey,
        farmingSnapshots: snapshotQueuePublicKey,
        farmingTicket: ticketData.farmingTicket,
        lpTokenFreezeVault,
        poolSigner: vaultSigner,
        userPoolTokenAccount,
        userKey: wallet.publicKey,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        clock: SYSVAR_CLOCK_PUBKEY,
        rent: SYSVAR_RENT_PUBKEY,
      },
    })
    commonTransaction.add(endFarmingTransaction)
  }

  let counter = 0
  while (counter < NUMBER_OF_RETRIES) {
    try {
      if (counter > 0) {
        await notify({
          type: 'error',
          message: 'Unstaking failed. Please confirm transaction again.',
        })
      }

      const tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: [],
      })

      if (tx) {
        return 'success'
      } else {
        counter++
      }
    } catch (e) {
      console.log('end farming catch error', e)
      counter++

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }
  }

  return 'failed'
}

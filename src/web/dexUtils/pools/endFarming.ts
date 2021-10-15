import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

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
  farmingTicket: string
  amountToClaim: number
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
      farmingTicket: ticket.pubkey.toString(),
      amountToClaim: 0,
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

  const filteredUserFarmingTicketsPerPool = filterClosedFarmingTickets(
    allUserTicketsPerPool
  )

  if (filteredUserFarmingTicketsPerPool.length === 0) {
    return 'failed'
  }

  const commonTransaction = new Transaction()
  let tx = null

  const sendPartOfTransactions = async () => {
    try {
      tx = await sendTransaction({
        wallet,
        connection,
        transaction: commonTransaction,
        signers: [],
        focusPopup: true,
      })

      if (!tx) {
        return 'failed'
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (e.message.includes('cancelled')) {
        return 'cancelled'
      }
    }

    return 'success'
  }

  for (let ticketData of filteredUserFarmingTicketsPerPool) {
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

    if (commonTransaction.instructions.length > 5) {
      const result = await sendPartOfTransactions()
      if (result !== 'success') {
        return result
      }
    }
  }

  if (commonTransaction.instructions.length > 0) {
    const result = await sendPartOfTransactions()
    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}

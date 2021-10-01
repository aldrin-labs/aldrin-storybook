import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'

import { notify } from '../notifications'
import { NUMBER_OF_RETRIES } from '../pools'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendTransaction } from '../send'
import { WalletAdapter } from '../types'

const loadUserTicketsPerPool = async ({
  wallet,
  connection,
  poolPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
}) => {
  return await connection.getProgramAccounts(
    new PublicKey(POOLS_PROGRAM_ADDRESS),
    {
      commitment: 'finalized',
      filters: [
        {
          dataSize: 584,
        },
        // {
        //   memcmp: {
        //     offset: 8 + 16 + 32,
        //     bytes: poolPublicKey.toBase58(),
        //   },
        // },
        // {
        //   memcmp: {
        //     offset: 8 + 16,
        //     bytes: wallet.publicKey.toBase58(),
        //   },
        // },
      ],
    }
  )
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

  const poolAccount = await program.account.pool.fetch(poolPublicKey)

  const lpTokenFreezeVault = poolAccount.lpTokenFreezeVault

  const tickets = await loadUserTicketsPerPool({
    wallet,
    connection,
    poolPublicKey,
  })

  const allUserTicketsPerPool = tickets.map((ticket) => {
    const data = Buffer.from(ticket.account.data)
    const ticketData = program.coder.accounts.decode(
      'FarmingTicket',
      data,
      ticket.pubkey.toString()
    )

    return {
      tokensFrozen: ticketData.tokensFrozen.toNumber(),
      farmingTicket: ticket.pubkey,
    }
  })

  let counter = 0
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

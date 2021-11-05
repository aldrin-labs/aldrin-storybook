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
import { isTransactionFailed, sendTransaction } from '../send'
import { WalletAdapter } from '../types'
import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { getParsedUserFarmingTickets } from './getParsedUserFarmingTickets'
import { isCancelledTransactionError } from '../common/isCancelledTransactionError'

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

  const filteredUserFarmingTicketsPerPool = filterOpenFarmingTickets(
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

      if (isTransactionFailed(tx)) {
        return 'failed'
      }
    } catch (e) {
      console.log('end farming catch error', e)

      if (isCancelledTransactionError(e)) {
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

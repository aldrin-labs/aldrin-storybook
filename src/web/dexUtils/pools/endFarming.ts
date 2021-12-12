import { TokenInstructions } from '@project-serum/serum'
import { filterOpenFarmingTickets } from '@sb/dexUtils/common/filterOpenFarmingTickets'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { createTokenAccountTransaction } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
} from '@solana/web3.js'
import { TransactionAndSigner } from '../common/types'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { getParsedUserFarmingTickets } from './getParsedUserFarmingTickets'
import { signAndSendTransaction } from './signAndSendTransaction'

export const getEndFarmingTransactions = async ({
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
  userPoolTokenAccount: PublicKey | null
}): Promise<TransactionAndSigner[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const { poolMint, lpTokenFreezeVault } = await program.account.pool.fetch(
    poolPublicKey
  )

  const allUserTicketsPerPool = await getParsedUserFarmingTickets({
    wallet,
    connection,
    poolPublicKey,
  })

  const filteredUserFarmingTicketsPerPool = filterOpenFarmingTickets(
    allUserTicketsPerPool
  )

  if (filteredUserFarmingTicketsPerPool.length === 0) {
    return []
  }

  let commonTransaction = new Transaction()

  // create pool token account for user if not exist
  if (!userPoolTokenAccount) {
    const {
      transaction: createAccountTransaction,
      newAccountPubkey,
    } = await createTokenAccountTransaction({
      wallet,
      mintPublicKey: poolMint,
    })

    userPoolTokenAccount = newAccountPubkey
    commonTransaction.add(createAccountTransaction)
  }

  const transactionsAndSigners = []

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
      transactionsAndSigners.push({ transaction: commonTransaction })
    }
  }

  if (commonTransaction.instructions.length > 0) {
    transactionsAndSigners.push({ transaction: commonTransaction })
  }

  return transactionsAndSigners
}

export const endFarming = async ({
  wallet,
  connection,
  poolPublicKey,
  farmingStatePublicKey,
  snapshotQueuePublicKey,
  userPoolTokenAccount,
  curveType,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  farmingStatePublicKey: PublicKey
  snapshotQueuePublicKey: PublicKey
  userPoolTokenAccount: PublicKey | null
  curveType: number | null
}) => {
  const transactionsAndSigners = await getEndFarmingTransactions({
    wallet,
    connection,
    poolPublicKey,
    farmingStatePublicKey,
    snapshotQueuePublicKey,
    userPoolTokenAccount,
  })

  const result = await signAndSendTransaction({
    wallet,
    connection,
    transactionsAndSigners,
  })

  return result
}

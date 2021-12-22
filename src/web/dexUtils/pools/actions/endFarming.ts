import { TokenInstructions } from '@project-serum/serum'
import {
  Connection,
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { filterOpenFarmingTickets } from '@sb/dexUtils/common/filterOpenFarmingTickets'
import { FarmingState, TransactionAndSigner } from '@sb/dexUtils/common/types'
import { getParsedUserFarmingTickets } from '@sb/dexUtils/pools/farmingTicket/getParsedUserFarmingTickets'
import { ProgramsMultiton } from '@sb/dexUtils/ProgramsMultiton/ProgramsMultiton'
import { getPoolsProgramAddress } from '@sb/dexUtils/ProgramsMultiton/utils'
import { createTokenAccountTransaction } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'

import { splitBy } from '../../../utils'
import { signAndSendTransactions } from '../../transactions'
import { filterTicketsAvailableForUnstake } from '../filterTicketsAvailableForUnstake'

export const getEndFarmingTransactions = async (params: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  farmingState: FarmingState
  userPoolTokenAccount: PublicKey | null
  curveType: number | null
}): Promise<TransactionAndSigner[]> => {
  const { wallet, connection, poolPublicKey, farmingState, curveType } = params

  let { userPoolTokenAccount } = params
  const farmingStatePublicKey = new PublicKey(farmingState.farmingState)
  const snapshotQueuePublicKey = new PublicKey(farmingState.farmingSnapshots)
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: getPoolsProgramAddress({ curveType }),
  })

  const [vaultSigner] = await PublicKey.findProgramAddress(
    [poolPublicKey.toBuffer()],
    program.programId
  )

  const { poolMint, lpTokenFreezeVault } = (await program.account.pool.fetch(
    poolPublicKey
  )) as { poolMint: PublicKey; lpTokenFreezeVault: PublicKey }

  const allUserTicketsPerPool = await getParsedUserFarmingTickets({
    wallet,
    connection,
    poolPublicKey,
  })
  const availableToUnstakeTickets = filterTicketsAvailableForUnstake(
    allUserTicketsPerPool,
    farmingState
  )

  const filteredUserFarmingTicketsPerPool = filterOpenFarmingTickets(
    availableToUnstakeTickets
  )

  if (filteredUserFarmingTicketsPerPool.length === 0) {
    return []
  }

  const commonTransaction = new Transaction()

  // create pool token account for user if not exist
  if (!userPoolTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: poolMint,
      })

    userPoolTokenAccount = newAccountPubkey
    commonTransaction.add(createAccountTransaction)
  }

  const endFarmingInstructions = await Promise.all(
    filteredUserFarmingTicketsPerPool.map(
      async (ticketData) =>
        program.instruction.endFarming({
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
        }) as TransactionInstruction
    )
  )

  const [firstTx, ...transactions] = splitBy(endFarmingInstructions, 4).map(
    (instr) => ({
      transaction: new Transaction().add(...instr),
    })
  )

  return [
    { transaction: commonTransaction.add(...firstTx.transaction.instructions) },
    ...transactions,
  ]
}

export const endFarming = async ({
  wallet,
  connection,
  poolPublicKey,
  farmingState,
  userPoolTokenAccount,
  curveType,
}: {
  wallet: WalletAdapter
  connection: Connection
  poolPublicKey: PublicKey
  farmingState: FarmingState
  userPoolTokenAccount: PublicKey | null
  curveType: number | null
}) => {
  const transactionsAndSigners = await getEndFarmingTransactions({
    wallet,
    connection,
    poolPublicKey,
    farmingState,
    userPoolTokenAccount,
    curveType,
  })

  const result = await signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners,
  })

  return result
}

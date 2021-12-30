import { TokenInstructions } from '@project-serum/serum'
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js'

import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import { createTokenAccountTransaction } from '../../send'
import { getCurrentFarmingStateFromAll } from '../../staking/getCurrentFarmingStateFromAll'
import { buildTransactions, signAndSendTransactions } from '../../transactions'
import { filterOpenFarmingTickets } from '../filterOpenFarmingTickets'
import { getTicketsAvailableToClose } from '../getTicketsAvailableToClose'
import { EndstakingParams } from './types'

export const endStakingInstructions = async (
  params: EndstakingParams
): Promise<TransactionInstruction[]> => {
  const { wallet, connection, farmingTickets, stakingPool, programAddress } =
    params

  let { userPoolTokenAccount } = params

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress,
  })

  const commonInstructions: TransactionInstruction[] = []

  if (!userPoolTokenAccount) {
    const { transaction: createAccountTransaction, newAccountPubkey } =
      await createTokenAccountTransaction({
        wallet,
        mintPublicKey: new PublicKey(stakingPool.poolTokenMint),
      })

    userPoolTokenAccount = newAccountPubkey
    commonInstructions.push(...createAccountTransaction.instructions)
  }
  const farmingState = getCurrentFarmingStateFromAll(stakingPool.farming || [])

  const openTickets = getTicketsAvailableToClose({
    farmingState,
    tickets: filterOpenFarmingTickets(farmingTickets),
  })

  const [poolSigner] = await PublicKey.findProgramAddress(
    [new PublicKey(stakingPool.swapToken).toBuffer()],
    program.programId
  )

  const instructions = await Promise.all(
    openTickets.map(async (ticketData) => {
      return (await program.instruction.endFarming({
        accounts: {
          pool: new PublicKey(stakingPool.swapToken),
          farmingState: new PublicKey(farmingState.farmingState),
          farmingSnapshots: new PublicKey(farmingState.farmingSnapshots),
          farmingTicket: new PublicKey(ticketData.farmingTicket),
          // Make code compatible for both staking and pools farming
          stakingVault:
            'stakingVault' in stakingPool
              ? new PublicKey(stakingPool.stakingVault)
              : undefined,
          lpTokenFreezeVault:
            'lpTokenFreezeVault' in stakingPool
              ? new PublicKey(stakingPool.lpTokenFreezeVault)
              : undefined,
          userStakingTokenAccount: userPoolTokenAccount,
          userPoolTokenAccount,

          poolSigner,
          userKey: wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
      })) as TransactionInstruction
    })
  )

  return [...commonInstructions, ...instructions]
}

export const endStaking = async (params: EndstakingParams) => {
  const instructions = await endStakingInstructions(params)

  const { wallet, connection } = params

  if (!wallet.publicKey) {
    throw new Error('No publicKey for wallet!')
  }

  const transactionsAndSigners = buildTransactions(
    instructions.map((instruction) => ({ instruction })),
    wallet.publicKey,
    []
  )

  return signAndSendTransactions({
    transactionsAndSigners,
    connection,
    wallet,
  })
}

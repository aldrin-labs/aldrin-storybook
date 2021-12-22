import { TokenInstructions } from '@project-serum/serum'
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  SYSVAR_RENT_PUBKEY,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { splitBy } from '../../utils/collection'
import { filterOpenFarmingTickets } from '../common/filterOpenFarmingTickets'
import { getTicketsAvailableToClose } from '../common/getTicketsAvailableToClose'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { sendPartOfTransactions, signTransactions } from '../send'
import { getCurrentFarmingStateFromAll } from './getCurrentFarmingStateFromAll'
import { EndstakingParams } from './types'

export const endStakingInstructions = async (
  params: EndstakingParams
): Promise<TransactionInstruction[][]> => {
  const {
    wallet,
    connection,
    userPoolTokenAccount,
    farmingTickets,
    stakingPool,
  } = params

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection: connection.getConnection(),
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const farmingState = getCurrentFarmingStateFromAll(stakingPool.farming)

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
          stakingVault: new PublicKey(stakingPool.stakingVault),
          userStakingTokenAccount: userPoolTokenAccount,
          poolSigner,
          userKey: wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
          rent: SYSVAR_RENT_PUBKEY,
        },
      })) as TransactionInstruction
    })
  )

  return splitBy(instructions, 6)
}

export const endStaking = async (params: EndstakingParams) => {
  const instructionChunks = await endStakingInstructions(params)

  const { wallet, connection } = params

  const transactions = instructionChunks.map((instr) =>
    new Transaction().add(...instr)
  )

  const signedTransactions = await signTransactions({
    transactionsAndSigners: transactions.map((transaction) => ({
      transaction,
      signers: [],
    })),
    wallet,
    connection,
  })

  for (const transaction of signedTransactions) {
    const result = await sendPartOfTransactions(connection, transaction)
    if (result !== 'success') {
      return result
    }
  }

  return 'success'
}

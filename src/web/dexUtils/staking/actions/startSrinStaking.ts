import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { ProgramsMultiton, PLUTONIANS_STAKING_ADDRESS } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'
import { StartSrinStakingParams } from './types'
import { getStakingAccount } from './utils'

export const startSrinStakingInstructions = async (
  params: StartSrinStakingParams
) => {
  const {
    stakingPool,
    stakingTier,
    connection,
    wallet,
    amount,
    userStakeTokenaccount,
    stakeVault,
  } = params
  const w = walletAdapterToWallet(wallet)

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: PLUTONIANS_STAKING_ADDRESS,
  })

  const [userStakingAccount] = await getStakingAccount(w.publicKey, stakingTier)

  return program.instruction.deposit(amount, {
    accounts: {
      user: w.publicKey,
      userStakingAccount,
      userStakeWallet: userStakeTokenaccount,
      stakeVault,
      stakingPool,
      stakingTier,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
    },
  }) as TransactionInstruction
}

export const startSrinStaking = async (params: StartSrinStakingParams) => {
  const instruction = await startSrinStakingInstructions(params)
  const transaction = new Transaction().add(instruction)
  return signAndSendSingleTransaction({
    transaction,
    wallet: params.wallet,
    connection: params.connection,
  })
}

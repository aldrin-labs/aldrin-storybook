import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'

import { PLUTONIANS_STAKING_ADDRESS, ProgramsMultiton } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'
import { StartSrinStakingParams } from './types'

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
    poolStakeTokenaccount,
  } = params
  const w = walletAdapterToWallet(wallet)

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: PLUTONIANS_STAKING_ADDRESS,
  })

  const [userStakingAccount, bumpUserStakingAccount] =
    await PublicKey.findProgramAddress(
      [
        Buffer.from('user_staking_account'),
        w.publicKey.toBytes(),
        stakingTier.toBytes(),
      ],
      new PublicKey(PLUTONIANS_STAKING_ADDRESS)
    )

  return program.instruction.deposit(amount, bumpUserStakingAccount, {
    accounts: {
      user: w.publicKey,
      userStakingAccount,
      userStakeTokenaccount,
      poolStakeTokenaccount,
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

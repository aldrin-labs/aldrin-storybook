import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from '@solana/web3.js'
import bs58 from 'bs58'

import { walletAdapterToWallet } from '../../common'
import {
  PLUTONIANS_STAKING_ADDRESS,
  ProgramsMultiton,
} from '../../ProgramsMultiton'
import { signAndSendSingleTransaction } from '../../transactions'
import { StartSrinStakingParams } from './types'

export const startSrinStakingInstructions = async (
  params: StartSrinStakingParams
) => {
  const { stakingPool, stakingTier, connection, wallet, amount } = params
  const w = walletAdapterToWallet(wallet)

  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: PLUTONIANS_STAKING_ADDRESS,
  })

  const [userStakingAccount, bumpUserStakingAccount] =
    await PublicKey.findProgramAddress(
      [
        bs58.decode('user_staking_account'),
        w.publicKey.toBytes(),
        stakingPool.toBytes(),
      ],
      new PublicKey(PLUTONIANS_STAKING_ADDRESS)
    )

  return program.instruction.deposit(amount, bumpUserStakingAccount, {
    accounts: {
      user: w.publicKey,
      userStakingAccount,
      stakingPool,
      stakingTier,
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

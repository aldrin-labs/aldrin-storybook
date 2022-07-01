import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'

import {
  createAssociatedTokenAccountTransaction,
  buildStopFarmingV2Instruction,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { StopFarmingParams } from './types'

export const stopFarmingV2 = async (params: StopFarmingParams) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, userTokens, connection, amount } = params
  const stakeMint = farm.stakeMint.toString()
  let userTokenAccount = userTokens.find((ut) => ut.mint === stakeMint)?.address

  const instructions: TransactionInstruction[] = []
  if (!userTokenAccount) {
    const { newAccountPubkey, transaction } =
      await createAssociatedTokenAccountTransaction({
        wallet,
        mintPublicKey: farm.stakeMint,
      })
    userTokenAccount = newAccountPubkey.toString()

    instructions.push(...transaction.instructions)

    // TODO: Add SOL check & close wSOL account
  }

  const { instruction } = await buildStopFarmingV2Instruction({
    wallet,
    connection,
    farm,
    stakeWallet: new PublicKey(userTokenAccount),
    stakeVault: farm.stakeVault,
    amount,
    userTokens,
  })

  instructions.push(instruction)

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners: [
      { transaction: new Transaction().add(...instructions) },
    ],
  })
}

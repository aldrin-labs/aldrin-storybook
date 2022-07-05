import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'

import {
  buildStartFarmingV2Instruction,
  buildCreateFarmerInstruction,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { StartFarmingV2Params } from './types'

export const startFarmingV2 = async (params: StartFarmingV2Params) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, userTokens, amount, connection, farmer } = params
  const stakeMint = farm.stakeMint.toString()
  const userTokenAccount = userTokens.find((ut) => ut.mint === stakeMint)
  if (!userTokenAccount) {
    throw new Error('Token account not found!')
  }
  const amountWithDecimals = amount * 10 ** userTokenAccount.decimals

  const instructions: TransactionInstruction[] = []

  if (!farmer) {
    const newFarmer = await buildCreateFarmerInstruction({
      farm: farm.publicKey,
      wallet,
      connection,
    })
    instructions.push(newFarmer.instruction)
  }

  const { instruction } = await buildStartFarmingV2Instruction({
    amount: amountWithDecimals,
    farm: farm.publicKey,
    stakeVault: farm.stakeVault,
    stakeWallet: new PublicKey(userTokenAccount.address),
    wallet,
    connection,
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

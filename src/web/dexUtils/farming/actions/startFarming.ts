import { Transaction, TransactionInstruction } from '@solana/web3.js'

import {
  buildStartFarmingV2Instruction,
  buildCreateFarmerInstruction,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { StartFarmingV2Params } from './types'

export const startFarmingV2 = async (params: StartFarmingV2Params) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, connection, farmer, userTokens, amount } = params

  const instructions: TransactionInstruction[] = []

  if (!farmer) {
    const { instruction } = await buildCreateFarmerInstruction({
      farm: farm.publicKey,
      wallet,
      connection,
    })
    instructions.push(instruction)
  }

  const { instruction } = await buildStartFarmingV2Instruction({
    farm,
    stakeVault: farm.stakeVault,
    wallet,
    connection,
    userTokens,
    amount,
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

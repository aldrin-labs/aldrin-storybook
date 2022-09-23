import { Transaction, TransactionInstruction } from '@solana/web3.js'

import { buildNewHarvestPeriodInstructions } from '@core/solana/programs/farming/instructions/newHarvestPeriodTransaction'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { NewHarvestPeriodParams } from './types'

export const createNewHarvestPeriod = async (
  params: NewHarvestPeriodParams
) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const {
    farm,
    connection,
    userTokens,
    amount,
    harvestMint,
    startsAt,
    periodLengthInSlots,
  } = params

  const instructions: TransactionInstruction[] = []

  const { instruction } = await buildNewHarvestPeriodInstructions({
    wallet,
    connection,
    amount,
    userTokens,
    farm,
    harvestMint,
    startsAt,
    periodLengthInSlots,
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

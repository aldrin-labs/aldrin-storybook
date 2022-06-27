import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js'
import BN from 'bn.js'

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
  const stakeMint = farm.stakeMint.toString()
  const userTokenAccount = userTokens.find((ut) => ut.mint === stakeMint)
  if (!userTokenAccount) {
    throw new Error('Token account not found!')
  }
  const amountWithDecimals = (amount * 10 ** userTokenAccount.decimals).toFixed(
    0
  )

  const tokenAmount = new BN(amountWithDecimals)

  const instructions: TransactionInstruction[] = []

  const { instruction } = await buildNewHarvestPeriodInstructions({
    wallet,
    connection,
    tokenAmount,
    farm: farm.publicKey,
    harvestMint,
    harvestWallet: new PublicKey(userTokenAccount.address),
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

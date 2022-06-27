import { Transaction, TransactionInstruction } from '@solana/web3.js'
import BN from 'bn.js'

import { buildAddHarvestInstructions } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { AddHarvestParams } from './types'

export const addHarvestV2 = async (params: AddHarvestParams) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, connection, userTokens, amount, harvestMint } = params
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

  const { instruction } = await buildAddHarvestInstructions({
    wallet,
    connection,
    tokenAmount,
    farm: farm.publicKey,
    harvestMint,
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

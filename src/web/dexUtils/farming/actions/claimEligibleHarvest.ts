import { Transaction, TransactionInstruction } from '@solana/web3.js'

import { buildClaimEligibleHarvestInstruction } from '@core/solana/programs/farming/instructions/claimEligibleHarvestTransaction'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { StartFarmingV2Params } from './types'

export const claimEligibleHarvest = async (params: StartFarmingV2Params) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const { farm, userTokens, connection } = params
  const stakeMint = farm.stakeMint.toString()

  const userTokenAccount = userTokens.find((ut) => ut.mint === stakeMint)
  if (!userTokenAccount) {
    throw new Error('Token account not found!')
  }

  const instructions: TransactionInstruction[] = []

  const { instruction } = await buildClaimEligibleHarvestInstruction({
    farm: farm.publicKey,
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

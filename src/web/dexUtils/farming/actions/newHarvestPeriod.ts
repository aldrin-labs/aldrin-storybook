import { Transaction } from '@solana/web3.js'

import {
  buildNewHarvestPeriodInstructions,
  BuildNewHarvestPeriodInstructionsParams,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { WalletAdapter } from '../../types'

export const createNewHarvestPeriod = async (
  params: BuildNewHarvestPeriodInstructionsParams<WalletAdapter>
) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const {
    farm,
    connection,
    userTokens,
    amount,
    harvestMint,
    duration,
    stakeMint,
  } = params

  const { instructions, signers } = await buildNewHarvestPeriodInstructions({
    wallet,
    connection,
    amount,
    userTokens,
    farm,
    harvestMint,
    duration,
    stakeMint,
  })

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners: [
      { transaction: new Transaction().add(...instructions), signers },
    ],
  })
}

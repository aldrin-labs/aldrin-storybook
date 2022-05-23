import { Transaction } from '@solana/web3.js'

import { buildStartSrinStakingInstructions } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'
import { StartSrinStakingParams } from './types'

export const startSrinStaking = async (params: StartSrinStakingParams) => {
  const wallet = walletAdapterToWallet(params.wallet)
  const instruction = await buildStartSrinStakingInstructions({
    ...params,
    wallet,
  })
  const transaction = new Transaction().add(instruction)
  return signAndSendSingleTransaction({
    transaction,
    wallet,
    connection: params.connection,
  })
}

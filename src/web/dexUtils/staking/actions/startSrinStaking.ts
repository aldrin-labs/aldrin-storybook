import { Transaction } from '@solana/web3.js'

import {
  buildStartSrinStakingInstructions,
  StartSrinStakingParams,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'
import { WalletAdapter } from '../../types'

export const startSrinStaking = async (
  params: StartSrinStakingParams<WalletAdapter>
) => {
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

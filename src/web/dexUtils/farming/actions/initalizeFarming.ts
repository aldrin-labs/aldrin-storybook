import {
  buildInitializefarmingInstruction,
  buildTransactions,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendTransactions } from '../../transactions'
import { InitializeFarmingParams } from './types'

export const initializeFarmingV2 = async (params: InitializeFarmingParams) => {
  const { connection } = params
  const wallet = walletAdapterToWallet(params.wallet)

  const { instructions, signers } = await buildInitializefarmingInstruction({
    ...params,
    wallet,
  })

  const transactionsAndSigners = buildTransactions(
    instructions.map((instruction) => ({ instruction })),
    wallet.publicKey,
    signers
  )

  return signAndSendTransactions({
    wallet,
    connection,
    transactionsAndSigners,
  })
}

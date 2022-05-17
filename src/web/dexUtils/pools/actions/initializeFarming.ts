import {
  InitializeFarmingParams,
  walletAdapterToWallet,
  initializeFarmingTransaction,
} from '@core/solana'

import { signAndSendSingleTransaction } from '../../transactions'
import { WalletAdapter } from '../../types'

export const initializeFaming = async (
  params: InitializeFarmingParams<WalletAdapter>
) => {
  const walletWithPk = walletAdapterToWallet(params.wallet)
  const [transaction, signers] = await initializeFarmingTransaction({
    ...params,
    wallet: walletWithPk,
  })

  return signAndSendSingleTransaction({
    transaction,
    connection: params.connection,
    wallet: walletWithPk,
    signers,
  })
}

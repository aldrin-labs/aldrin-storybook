import {
  InitializeFarmingParams,
  walletAdapterToWallet,
  buildInitializeFarmingTransaction,
} from '@core/solana'

import { signAndSendSingleTransaction } from '../../transactions'
import { WalletAdapter } from '../../types'

export const initializeFaming = async (
  params: InitializeFarmingParams<WalletAdapter>
) => {
  const walletWithPk = walletAdapterToWallet(params.wallet)
  const [transaction, signers] = await buildInitializeFarmingTransaction({
    ...params,
    wallet: walletWithPk,
  })

  return signAndSendSingleTransaction({
    transaction,
    connection: params.connection,
    fallbackConnection: params.fallbackConnection,
    wallet: walletWithPk,
    signers,
  })
}

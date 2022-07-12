import { isTransactionFailed } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'

import { buildSwapTransaction, SwapTransactionParams } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'

export const swap = async (params: SwapTransactionParams<WalletAdapter>) => {
  try {
    const w = walletAdapterToWallet(params.wallet)
    const swapTransactionAndSigners = await buildSwapTransaction({
      ...params,
      wallet: w,
    })

    if (!swapTransactionAndSigners) {
      return 'failed'
    }

    const { transaction, signers } = swapTransactionAndSigners

    const tx = await signAndSendSingleTransaction({
      wallet: w,
      connection: params.connection,
      signers,
      transaction,
      focusPopup: true,
    })

    if (!isTransactionFailed(tx)) {
      return 'success'
    }

    return tx
  } catch (e) {
    console.log('swap catch error', e)
  }

  return 'failed'
}

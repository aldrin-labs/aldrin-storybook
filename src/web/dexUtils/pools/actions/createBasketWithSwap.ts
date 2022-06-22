
import { isTransactionFailed } from '@sb/dexUtils/send'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { WalletAdapter } from '@sb/dexUtils/types'

import {
  buildCreateBasketWithSwapTransaction,
  CreateBasketWithSwapParams,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'

export async function createBasketWithSwap(
  params: CreateBasketWithSwapParams<WalletAdapter>
) {
  try {
    const wallet = walletAdapterToWallet(params.wallet)
    const { transaction, signers } = await buildCreateBasketWithSwapTransaction(
      {
        ...params,
        wallet,
      }
    )

    const result = await signAndSendSingleTransaction({
      wallet,
      connection: params.connection,
      transaction,
      signers,
      focusPopup: true,
    })

    if (isTransactionFailed(result)) {
      return 'failed'
    }

    return result
  } catch (e) {
    console.log('deposit with swap catch error', e)

    return 'failed'
  }
}

import {
  createBasketTransaction,
  walletAdapterToWallet,
  CreateBasketParams,
  buildCreateBasketTransaction,
} from '@core/solana'

import { isTransactionFailed } from '../../send'
import { signAndSendSingleTransaction } from '../../transactions'

async function createBasket(params: CreateBasketParams) {
  const { wallet, connection } = params
  try {
    const walletWithPk = walletAdapterToWallet(wallet)

    const { transaction: commonTransaction, signers: commonSigners } =
      await buildCreateBasketTransaction({
        ...params,
        wallet: walletWithPk,
      })

    const result = await signAndSendSingleTransaction({
      wallet: walletWithPk,
      connection,
      signers: commonSigners,
      transaction: commonTransaction,
    })

    if (isTransactionFailed(result)) {
      return 'failed'
    }

    return result
  } catch (e) {
    console.log('deposit catch error', e)

    return 'failed'
  }
}

export { createBasketTransaction, createBasket }

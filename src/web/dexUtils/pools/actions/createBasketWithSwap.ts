import { PublicKey } from '@solana/web3.js'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { isTransactionFailed } from '@sb/dexUtils/send'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { WalletAdapter } from '@sb/dexUtils/types'

import {
  AldrinConnection,
  buildCreateBasketWithSwapTransaction,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { PoolBalances } from '../hooks/usePoolBalances'

export async function createBasketWithSwap(params: {
  wallet: WalletAdapter
  connection: AldrinConnection
  pool: PoolInfo
  poolBalances: PoolBalances
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
}) {
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

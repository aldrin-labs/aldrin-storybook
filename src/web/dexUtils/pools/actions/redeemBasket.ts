import { PublicKey } from '@solana/web3.js'

import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'
import { signAndSendSingleTransaction } from '@sb/dexUtils/transactions'
import { WalletAdapter } from '@sb/dexUtils/types'

import {
  AldrinConnection,
  VestingWithPk,
  buildRedeemBasketTransaction,
} from '@core/solana'

import { walletAdapterToWallet } from '../../common'

export async function redeemBasket(params: {
  wallet: WalletAdapter
  connection: AldrinConnection
  curveType: number | null
  poolPublicKey: PublicKey
  userPoolTokenAccount?: PublicKey
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  userPoolTokenAmount: number
  unlockVesting?: VestingWithPk
}) {
  try {
    const wallet = walletAdapterToWallet(params.wallet)
    const { transaction, signers } = await buildRedeemBasketTransaction({
      ...params,
      wallet,
    })

    return signAndSendSingleTransaction({
      wallet,
      connection: params.connection,
      transaction,
      signers,
    })
  } catch (e) {
    console.log('withdraw catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }

  return 'success'
}

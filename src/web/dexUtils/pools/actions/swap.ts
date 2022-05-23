import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { isTransactionFailed } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'

import { buildSwapTransaction, AldrinConnection } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { signAndSendSingleTransaction } from '../../transactions'

export const swap = async ({
  wallet,
  connection,
  poolPublicKey,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  swapAmountIn,
  swapAmountOut,
  isSwapBaseToQuote,
  transferSOLToWrapped,
  curveType,
}: {
  wallet: WalletAdapter
  connection: AldrinConnection
  poolPublicKey: PublicKey
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  swapAmountIn: BN
  swapAmountOut: BN
  isSwapBaseToQuote: boolean
  transferSOLToWrapped: boolean
  curveType: number | null
}) => {
  try {
    const w = walletAdapterToWallet(wallet)
    const swapTransactionAndSigners = await buildSwapTransaction({
      wallet: w,
      connection,
      poolPublicKey,
      userBaseTokenAccount,
      userQuoteTokenAccount,
      swapAmountIn,
      swapAmountOut,
      isSwapBaseToQuote,
      transferSOLToWrapped,
      curveType,
    })

    if (!swapTransactionAndSigners) {
      return 'failed'
    }

    const { transaction, signers } = swapTransactionAndSigners

    const tx = await signAndSendSingleTransaction({
      wallet: w,
      connection,
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

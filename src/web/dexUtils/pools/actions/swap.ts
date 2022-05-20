import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

import { isTransactionFailed } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'

import { buildSwapTransaction } from '@core/solana'

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
  connection: Connection
  poolPublicKey: PublicKey
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  swapAmountIn: BN
  swapAmountOut: BN
  isSwapBaseToQuote: boolean
  transferSOLToWrapped: boolean
  curveType: number | null
}) => {
  const swapTransactionAndSigners = await buildSwapTransaction({
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
  })

  if (!swapTransactionAndSigners) {
    return 'failed'
  }

  const { commonTransaction, signers } = swapTransactionAndSigners

  try {
    const tx = await signAndSendSingleTransaction({
      wallet,
      connection,
      signers,
      transaction: commonTransaction,
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

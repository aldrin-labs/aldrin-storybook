import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'
import { isTransactionFailed, sendTransaction } from '@sb/dexUtils/send'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import { PoolBalances } from '../hooks/usePoolBalances'
import { findClosestAmountToSwapForDeposit } from '../swap/findClosestAmountToSwapForDeposit'
import { getCreateBasketTransaction } from './createBasket'
import { getSwapTransaction } from './swap'

export async function createBasketWithSwap({
  wallet,
  connection,
  pool,
  poolBalances,
  userPoolTokenAccount,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  userBaseTokenAmount,
  userQuoteTokenAmount,
  transferSOLToWrapped,
  slippage = 0.3, // percentages
}: {
  wallet: WalletAdapter
  connection: Connection
  pool: PoolInfo
  poolBalances: PoolBalances
  userPoolTokenAccount: PublicKey | null
  userBaseTokenAccount: PublicKey
  userQuoteTokenAccount: PublicKey
  userBaseTokenAmount: number
  userQuoteTokenAmount: number
  transferSOLToWrapped: boolean
  slippage?: number
}) {
  const { swapToken, curveType, tokenADecimals, tokenBDecimals } = pool
  const poolPublicKey = new PublicKey(swapToken)

  console.log({
    userBaseTokenAmount,
    userQuoteTokenAmount,
  })

  const { isSwapBaseToQuote, swapAmountIn, swapAmountOut } =
    findClosestAmountToSwapForDeposit({
      pool,
      poolBalances,
      userAmountTokenA: userBaseTokenAmount,
      userAmountTokenB: userQuoteTokenAmount,
    })

  const swapAmountOutWithSlippage =
    swapAmountOut - (swapAmountOut / 100) * slippage

  const [baseAmountToDeposit, quoteAmountToDeposit] = isSwapBaseToQuote
    ? [
        userBaseTokenAmount - swapAmountIn,
        userQuoteTokenAmount + swapAmountOutWithSlippage,
      ]
    : [
        userBaseTokenAmount + swapAmountOutWithSlippage,
        userQuoteTokenAmount - swapAmountIn,
      ]

  console.log({
    baseAmountToDeposit,
    quoteAmountToDeposit,
  })

  try {
    const swapTransactionResult = await getSwapTransaction({
      wallet,
      connection,
      curveType,
      isSwapBaseToQuote,
      poolPublicKey,
      swapAmountIn,
      swapAmountOut: swapAmountOutWithSlippage,
      transferSOLToWrapped,
      userBaseTokenAccount,
      userQuoteTokenAccount,
    })

    if (swapTransactionResult === null) {
      throw new Error('Swap transaction creation failed')
    }

    const [baseTokenDecimals, quoteTokenDecimals] = isSwapBaseToQuote
      ? [tokenADecimals, tokenBDecimals]
      : [tokenBDecimals, tokenADecimals]

    const [swapTransaction, swapSigners] = swapTransactionResult

    const [createBasketTransaction, createBasketSigners] =
      await getCreateBasketTransaction({
        wallet,
        connection,
        poolPublicKey,
        userBaseTokenAccount,
        userQuoteTokenAccount,
        userBaseTokenAmount: baseAmountToDeposit * 10 ** baseTokenDecimals,
        userQuoteTokenAmount: quoteAmountToDeposit * 10 ** quoteTokenDecimals,
        userPoolTokenAccount,
        transferSOLToWrapped,
        curveType,
      })

    const commonTransaction = new Transaction().add(
      swapTransaction,
      createBasketTransaction
    )
    const commonSigners = [...swapSigners, ...createBasketSigners]

    const tx = await sendTransaction({
      wallet,
      connection,
      transaction: commonTransaction,
      signers: commonSigners,
      focusPopup: true,
    })

    if (isTransactionFailed(tx)) {
      return 'failed'
    }
  } catch (e) {
    console.log('deposit with swap catch error', e)

    if (isCancelledTransactionError(e)) {
      return 'cancelled'
    }
  }

  return 'success'
}

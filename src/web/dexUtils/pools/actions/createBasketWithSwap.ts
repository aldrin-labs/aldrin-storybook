import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { isCancelledTransactionError } from '@sb/dexUtils/common/isCancelledTransactionError'
import { isTransactionFailed, sendTransaction } from '@sb/dexUtils/send'
import { Token, TOKEN_PROGRAM_ID } from '@sb/dexUtils/token/token'
import { WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
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
}) {
  const {
    swapToken,
    poolTokenMint,
    curveType,
    tokenADecimals,
    tokenBDecimals,
  } = pool

  const poolPublicKey = new PublicKey(swapToken)

  const { isSwapBaseToQuote, swapAmountIn, swapAmountOut } =
    findClosestAmountToSwapForDeposit({
      pool,
      poolBalances,
      userAmountTokenA: userBaseTokenAmount,
      userAmountTokenB: userQuoteTokenAmount,
    })

  console.log('swapAmountIn, swapAmountOut', swapAmountIn, swapAmountOut)

  const [baseAmountToDeposit, quoteAmountToDeposit] = isSwapBaseToQuote
    ? [userBaseTokenAmount - swapAmountIn, userQuoteTokenAmount + swapAmountOut]
    : [userBaseTokenAmount + swapAmountOut, userQuoteTokenAmount - swapAmountIn]

  try {
    const [swapAmountInDecimals, swapAmountOutDecimals] = isSwapBaseToQuote
      ? [tokenADecimals, tokenBDecimals]
      : [tokenBDecimals, tokenADecimals]

    const swapAmountInWithDecimals = new BN(
      swapAmountIn * 10 ** swapAmountInDecimals
    )

    const swapAmountOutWithDecimals = new BN(
      swapAmountOut * 10 ** swapAmountOutDecimals
    )

    const swapTransactionResult = await getSwapTransaction({
      wallet,
      connection,
      curveType,
      isSwapBaseToQuote,
      poolPublicKey,
      swapAmountIn: swapAmountInWithDecimals,
      swapAmountOut: swapAmountOutWithDecimals,
      transferSOLToWrapped,
      userBaseTokenAccount,
      userQuoteTokenAccount,
    })

    if (swapTransactionResult === null) {
      throw new Error('Swap transaction creation failed')
    }

    const [swapTransaction, swapSigners] = swapTransactionResult

    const baseAmountToDepositWithDecimals = new BN(
      baseAmountToDeposit * 10 ** tokenADecimals
    )

    const quoteAmountToDepositWithDecimals = new BN(
      quoteAmountToDeposit * 10 ** tokenBDecimals
    )

    const poolToken = new Token(
      wallet,
      connection,
      new PublicKey(poolTokenMint),
      TOKEN_PROGRAM_ID
    )

    const { supply } = await poolToken.getMintInfo()

    // for swap base to quote - add swap amount in, otherwise remove amount out
    const poolBaseTokenAmoutAfterSwap = isSwapBaseToQuote
      ? poolBalances.baseTokenAmountBN.add(swapAmountInWithDecimals)
      : poolBalances.baseTokenAmountBN.sub(swapAmountOutWithDecimals)

    const poolTokenAmountToReceive = supply
      .mul(new BN(baseAmountToDepositWithDecimals))
      .div(poolBaseTokenAmoutAfterSwap)
      .div(new BN(1000))
      .mul(new BN(997))

    const [createBasketTransaction, createBasketSigners] =
      await getCreateBasketTransaction({
        wallet,
        connection,
        poolPublicKey,
        userBaseTokenAccount,
        userQuoteTokenAccount,
        userBaseTokenAmount: baseAmountToDepositWithDecimals,
        userQuoteTokenAmount: quoteAmountToDepositWithDecimals,
        userPoolTokenAccount,
        transferSOLToWrapped,
        curveType,
        poolTokenAmountToReceive,
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

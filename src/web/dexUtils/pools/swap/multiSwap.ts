import { Connection, PublicKey, Transaction } from '@solana/web3.js'

import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { isTransactionFailed } from '@sb/dexUtils/send'
import { signAndSendTransactions } from '@sb/dexUtils/transactions'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'

import { toBNWithDecimals } from '@core/utils/helpers'

import { getSwapTransaction } from '../actions/swap'
import { SwapRoute } from './getMultiSwapAmountOut'

const multiSwap = async ({
  wallet,
  connection,
  swapRoute,
  allTokensData,
}: {
  wallet: WalletAdapter
  connection: Connection
  swapRoute: SwapRoute
  allTokensData: TokenInfo[]
}) => {
  const transactionsAndSigners = []

  let commonTransaction = new Transaction()
  let commonSigners = []

  for (let i = 1; i <= swapRoute.length; i += 1) {
    const swapStep = swapRoute[i - 1]

    const { swapAmountIn, swapAmountOut, pool, isSwapBaseToQuote } = swapStep

    const {
      curveType,
      swapToken,
      tokenADecimals,
      tokenBDecimals,
      tokenA,
      tokenB,
    } = pool

    const [tokenInDecimals, tokenOutDecimals] = isSwapBaseToQuote
      ? [tokenADecimals, tokenBDecimals]
      : [tokenBDecimals, tokenADecimals]

    const swapAmountInWithDecimals = toBNWithDecimals(
      swapAmountIn,
      tokenInDecimals
    )

    const swapAmountOutWithDecimals = toBNWithDecimals(
      swapAmountOut,
      tokenOutDecimals
    )

    const [baseTokenMint, quoteTokenMint] = isSwapBaseToQuote
      ? [tokenA, tokenB]
      : [tokenB, tokenA]

    const { address: userBaseTokenAccount } = getTokenDataByMint(
      allTokensData,
      baseTokenMint
    )

    const { address: userQuoteTokenAccount } = getTokenDataByMint(
      allTokensData,
      quoteTokenMint
    )

    const nativeSOLTokenData = allTokensData[0]

    const isNativeSOLSelected =
      nativeSOLTokenData?.address === userBaseTokenAccount ||
      nativeSOLTokenData?.address === userQuoteTokenAccount

    const swapTransactionAndSigners = await getSwapTransaction({
      wallet,
      connection,
      poolPublicKey: new PublicKey(swapToken),
      userBaseTokenAccount: userBaseTokenAccount
        ? new PublicKey(userBaseTokenAccount)
        : null,
      userQuoteTokenAccount: userQuoteTokenAccount
        ? new PublicKey(userQuoteTokenAccount)
        : null,
      swapAmountIn: swapAmountInWithDecimals,
      swapAmountOut: swapAmountOutWithDecimals,
      isSwapBaseToQuote,
      transferSOLToWrapped: isNativeSOLSelected,
      curveType,
    })

    if (!swapTransactionAndSigners) {
      throw new Error('Swap transaction creation failed')
    }

    const [transaction, signers] = swapTransactionAndSigners

    commonTransaction.add(transaction)
    commonSigners.push(...signers)

    // add only if second swap or last
    if (i % 2 === 0) {
      transactionsAndSigners.push({
        transaction: commonTransaction,
        signers: commonSigners,
      })

      commonTransaction = new Transaction()
      commonSigners = []
    }
  }

  if (commonTransaction.instructions.length > 0) {
    transactionsAndSigners.push({
      transaction: commonTransaction,
      signers: commonSigners,
    })
  }

  console.log('transactionsAndSigners', transactionsAndSigners)

  try {
    const tx = await signAndSendTransactions({
      wallet,
      connection,
      transactionsAndSigners,
      commitment: 'confirmed',
      skipPreflight: false,
    })

    if (!isTransactionFailed(tx)) {
      return 'success'
    }

    return tx
  } catch (e) {
    console.error('multi swap catch error', e)
  }

  return 'failed'
}

export { multiSwap }

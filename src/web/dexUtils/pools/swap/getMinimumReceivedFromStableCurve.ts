import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'

import { parseTokenAccountData } from '@sb/dexUtils/tokens'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import { getSwapTransaction } from '../actions/swap'

export const getMinimumReceivedFromStableCurveForSwap = async ({
  swapAmountIn,
  isSwapBaseToQuote,
  pool,
  wallet,
  connection,
  userBaseTokenAccount,
  userQuoteTokenAccount,
  transferSOLToWrapped,
  allTokensData,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  pool: PoolInfo
  wallet: WalletAdapter
  connection: Connection
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  transferSOLToWrapped: boolean
  allTokensData: TokenInfo[]
}) => {
  const { curveType, swapToken } = pool

  const poolPublicKey = new PublicKey(swapToken)
  const swapAmountOut = 0

  if (swapAmountIn === 0 || (transferSOLToWrapped && !wallet.publicKey)) {
    return 0
  }

  const basePoolTokenMint = isSwapBaseToQuote ? pool.tokenA : pool.tokenB
  const { decimals: basePoolTokenDecimals } = getTokenDataByMint(
    allTokensData,
    basePoolTokenMint
  )

  console.log({
    userBaseTokenAccount,
    userQuoteTokenAccount,
  })

  const swapTransactionAndSigners = await getSwapTransaction({
    wallet,
    connection,
    poolPublicKey,
    userBaseTokenAccount,
    userQuoteTokenAccount,
    swapAmountIn: swapAmountIn * 10 ** basePoolTokenDecimals,
    swapAmountOut,
    isSwapBaseToQuote,
    transferSOLToWrapped,
    unwrapWrappedSOL: false,
    curveType,
  })

  if (!swapTransactionAndSigners) {
    return 0
  }

  const [
    swapTransaction,
    _,
    userBaseTokenAccountUsedInSwap,
    userQuoteTokenAccountUsedInSwap,
  ] = swapTransactionAndSigners

  // TODO: check with not SOL
  swapTransaction.feePayer = wallet.publicKey

  let response = null

  try {
    response = await connection.simulateTransaction(
      swapTransaction,
      undefined,
      [
        isSwapBaseToQuote
          ? userQuoteTokenAccountUsedInSwap
          : userBaseTokenAccountUsedInSwap,
      ]
    )
  } catch (e) {
    console.error('error simulate transaction', e)
  }

  console.log('response', response)

  if (
    !response ||
    !response.value ||
    !response.value.accounts ||
    response.value.err
  ) {
    return 0
  }

  console.log('response 2', response)

  const postUserQuoteTokenAccountData = Buffer.from(
    response.value.accounts[0].data[0],
    'base64'
  )

  console.log('postUserQuoteTokenAccountData', postUserQuoteTokenAccountData)

  const parsedQuote = parseTokenAccountData(postUserQuoteTokenAccountData)
  const quotePoolTokenMint = parsedQuote.mint.toString()

  let {
    amount: quoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(allTokensData, quotePoolTokenMint)

  const quoteAmountAfterSwap = parsedQuote.amount / 10 ** quoteTokenDecimals

  console.log({
    quoteAmount,
    quoteAmountAfterSwap,
  })

  let swapAmount = 0

  if (quotePoolTokenMint === WRAPPED_SOL_MINT.toString()) {
    // because we checking the wrapped sol account which is not closed,
    // so we receive exactly what we got from swap on this account
    swapAmount = quoteAmountAfterSwap
  } else {
    swapAmount = quoteAmountAfterSwap - quoteAmount
  }

  console.log('swapAmount', swapAmount)

  return swapAmount
}

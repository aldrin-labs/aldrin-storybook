import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { sendTransaction } from '@sb/dexUtils/send'

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

  swapTransaction.feePayer = wallet.publicKey

  let response = null

  console.log({
    swapTransaction,
  })

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

  if (
    !response ||
    !response.value ||
    !response.value.accounts ||
    response.value.err
  ) {
    return 0
  }

  const postUserQuoteTokenAccountData = Buffer.from(
    response.value.accounts[0].data[0],
    'base64'
  )

  const parsedQuote = parseTokenAccountData(postUserQuoteTokenAccountData)
  const quotePoolTokenMint = parsedQuote.mint.toString()

  let {
    amount: quoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(allTokensData, quotePoolTokenMint)

  const quoteAmountAfterSwap = parsedQuote.amount / 10 ** quoteTokenDecimals

  let swapAmount = 0

  if (quotePoolTokenMint === WRAPPED_SOL_MINT.toString()) {
    // because we checking the wrapped sol account which is not closed,
    // so we receive exactly what we got from swap on this account
    swapAmount = quoteAmountAfterSwap
  } else {
    swapAmount = quoteAmountAfterSwap - quoteAmount
  }

  return swapAmount
}

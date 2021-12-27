import { WRAPPED_SOL_MINT } from '@project-serum/serum/lib/token-instructions'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { Token } from '@sb/dexUtils/token/token'
import { parseTokenAccountData } from '@sb/dexUtils/tokens'
import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'

import { getSwapTransaction } from '../actions/swap'

export const getMinimumReceivedFromStableCurveForSwap = async ({
  swapAmountIn,
  isSwapBaseToQuote,
  pool,
  wallet,
  tokensMap,
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
  tokensMap: Map<string, TokenInfo>
  connection: Connection
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  transferSOLToWrapped: boolean
  allTokensData: TokenInfo[]
}) => {
  const { curveType, swapToken } = pool

  const poolPublicKey = new PublicKey(swapToken)
  const swapAmountOut = 0

  if (!wallet.publicKey) {
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
    address: userQuoteTokenAddress,
    amount: quoteAmount,
    decimals: quoteTokenDecimals,
  } = getTokenDataByMint(allTokensData, quotePoolTokenMint)

  // if user doesn't have quote token account
  if (!userQuoteTokenAddress) {
    const isTokenInTokensMap = tokensMap.has(quotePoolTokenMint)

    // rpc request only if no token in map
    if (isTokenInTokensMap) {
      const { decimals } = tokensMap.get(quotePoolTokenMint)
      quoteTokenDecimals = decimals
    } else {
      const quoteToken = new Token(
        wallet,
        connection,
        parsedQuote.mint,
        TOKEN_PROGRAM_ID
      )
      const { decimals } = await quoteToken.getMintInfo()
      quoteTokenDecimals = decimals
    }
  }

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

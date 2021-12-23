import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { getTokenDataByMint } from '@sb/compositions/Pools/utils'
import { computeOutputAmountWithoutFee } from '@sb/dexUtils/stablecurve/stableCurve'
import { Token } from '@sb/dexUtils/token/token'

import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import BN from 'bn.js'

export const getMinimumReceivedFromStableCurveForSwap = async ({
  swapAmountIn,
  isSwapBaseToQuote,
  pool,
  wallet,
  tokensMap,
  connection,
  allTokensData,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  pool: PoolInfo
  wallet: WalletAdapter
  tokensMap: Map<string, TokenInfo>
  connection: Connection
  allTokensData: TokenInfo[]
}) => {
  const {
    amp,
    tvl: { tokenA, tokenB },
    fees: {
      tradeFeeDenominator,
      ownerTradeFeeDenominator,
      tradeFeeNumerator,
      ownerTradeFeeNumerator,
    },
  } = pool

  console.log({
    tokenA,
    tokenB,
    swapAmountIn,
    isSwapBaseToQuote,
  })

  if (swapAmountIn === 0) {
    return ''
  }

  const [basePoolTokenMint, quotePoolTokenMint] = isSwapBaseToQuote
    ? [pool.tokenA, pool.tokenB]
    : [pool.tokenB, pool.tokenA]

  const { decimals: basePoolTokenDecimals } = getTokenDataByMint(
    allTokensData,
    basePoolTokenMint
  )

  let {
    address: userQuoteTokenAddress,
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
        new PublicKey(quotePoolTokenMint),
        TOKEN_PROGRAM_ID
      )
      const { decimals } = await quoteToken.getMintInfo()
      quoteTokenDecimals = decimals
    }
  }

  const [inputPoolAmount, outputPoolAmount] = isSwapBaseToQuote
    ? [
        new u64(tokenA * 10 ** basePoolTokenDecimals),
        new u64(tokenB * 10 ** quoteTokenDecimals),
      ]
    : [
        new u64(tokenB * 10 ** quoteTokenDecimals),
        new u64(tokenA * 10 ** basePoolTokenDecimals),
      ]

  const poolFeesMultiplicator = new BN(tradeFeeNumerator)
    .div(new BN(ownerTradeFeeNumerator))
    .div(new BN(tradeFeeDenominator).div(new BN(ownerTradeFeeDenominator)))
    .toNumber()

  console.log({
    tradeFeeDenominator,
    ownerTradeFeeDenominator,
    tradeFeeNumerator,
    ownerTradeFeeNumerator,
  })

  const swapAmountOut = computeOutputAmountWithoutFee(
    new u64(swapAmountIn * 10 ** 6),
    inputPoolAmount,
    outputPoolAmount,
    // poolFeesMultiplicator,
    // amp
  )

  const swapAmountOutWithoutDecimals =
    +swapAmountOut.toString() / 10 ** quoteTokenDecimals

  return swapAmountOutWithoutDecimals
}

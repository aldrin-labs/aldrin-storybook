import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { PoolInfo } from '@sb/compositions/Pools/index.types'

import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey } from '@solana/web3.js'
import { PoolBalances } from '../hooks/usePoolBalances'
import { CURVE } from '../types'
import { getMinimumReceivedFromProductCurve } from './getMinimumReceivedFromProductCurve'
import { getMinimumReceivedFromStableCurveForSwap } from './getMinimumReceivedFromStableCurve'

export const getMinimumReceivedAmountFromSwap = async ({
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
  poolBalances,
}: {
  swapAmountIn: number
  isSwapBaseToQuote: boolean
  pool?: PoolInfo
  wallet: WalletAdapter
  tokensMap: Map<string, TokenInfo>
  connection: Connection
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  transferSOLToWrapped: boolean
  allTokensData: TokenInfo[]
  poolBalances: PoolBalances
}) => {
  if (!pool) return 0

  const { curveType = CURVE.PRODUCT } = pool

  let swapAmountOut = 0

  if (swapAmountIn === 0) {
    return 0
  }

  if (curveType === CURVE.STABLE) {
    // program v2 stable pool
    swapAmountOut = await getMinimumReceivedFromStableCurveForSwap({
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
    })
  } else {
    swapAmountOut = getMinimumReceivedFromProductCurve({
      swapAmountIn,
      isSwapBaseToQuote,
      poolBalances,
    })
  }

  const strippedSwapAmountOut = stripDigitPlaces(swapAmountOut, 8)

  return strippedSwapAmountOut
}

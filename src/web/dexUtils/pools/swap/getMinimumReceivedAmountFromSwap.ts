import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  POOLS_PROGRAM_ADDRESS,
} from '@sb/dexUtils/ProgramsMultiton/utils'

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

  if (curveType === CURVE.PRODUCT) {
    swapAmountOut = getMinimumReceivedFromProductCurve({
      swapAmountIn,
      isSwapBaseToQuote,
      poolBalances,
    })
  } else {
    // program v2 stable pool
    swapAmountOut = await getMinimumReceivedFromStableCurveForSwap({
      swapAmountIn,
      isSwapBaseToQuote,
      pool,
      wallet,
      connection,
      userBaseTokenAccount,
      userQuoteTokenAccount,
      transferSOLToWrapped,
      allTokensData,
    })
  }

  const strippedSwapAmountOut = stripDigitPlaces(swapAmountOut, 8)

  return strippedSwapAmountOut
}

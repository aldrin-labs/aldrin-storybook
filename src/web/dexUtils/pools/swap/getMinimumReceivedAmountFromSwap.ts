import { stripDigitPlaces } from '@core/utils/PortfolioTableUtils'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  getPoolsProgramAddress,
  POOLS_PROGRAM_ADDRESS,
} from '@sb/dexUtils/ProgramsMultiton/utils'

import { TokenInfo, WalletAdapter } from '@sb/dexUtils/types'
import { Connection, PublicKey } from '@solana/web3.js'
import { PoolBalances } from '../hooks/usePoolBalances'
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
  pool: PoolInfo
  wallet: WalletAdapter
  connection: Connection
  userBaseTokenAccount: PublicKey | null
  userQuoteTokenAccount: PublicKey | null
  transferSOLToWrapped: boolean
  allTokensData: TokenInfo[]
  poolBalances: PoolBalances
}) => {
  const { curveType } = pool

  let swapAmountOut = 0

  if (getPoolsProgramAddress({ curveType }) === POOLS_PROGRAM_ADDRESS) {
    swapAmountOut = getMinimumReceivedFromProductCurve({
      swapAmountIn,
      isSwapBaseToQuote,
      poolBalances,
    })
  } else {
    // program v2
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

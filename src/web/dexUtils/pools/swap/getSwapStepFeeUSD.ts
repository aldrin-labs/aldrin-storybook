import { SwapStep } from '@aldrin_exchange/swap_hook'
import { TokenInfoMap } from '@solana/spl-token-registry'

import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { removeDecimalsFromBN } from '@core/utils/helpers'

export const getSwapStepFeesAmount = ({
  swapStep,
  pricesMap,
  tokenInfosMap,
}: {
  swapStep: SwapStep
  pricesMap: Map<string, number>
  tokenInfosMap: TokenInfoMap
}) => {
  const { feeAmount, feeMint } = swapStep
  const { decimals } = tokenInfosMap.get(feeMint.toString()) || { decimals: 0 }
  const symbol = getTokenNameByMintAddress(feeMint.toString())
  const inputTokenPrice = pricesMap.get(symbol) || 0

  return removeDecimalsFromBN(feeAmount, decimals) * inputTokenPrice
}

export const getSwapRouteFeesAmount = ({
  swapSteps,
  tokenInfosMap,
  pricesMap,
}: {
  swapSteps: SwapStep[]
  tokenInfosMap: TokenInfoMap
  pricesMap: Map<string, number>
}) => {
  return swapSteps.reduce(
    (acc, swapStep) =>
      acc + getSwapStepFeesAmount({ swapStep, pricesMap, tokenInfosMap }),
    0
  )
}

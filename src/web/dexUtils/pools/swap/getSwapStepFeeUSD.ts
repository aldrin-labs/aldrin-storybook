import { getTokenNameByMintAddress } from '@sb/dexUtils/markets'

import { getFeesAmount } from './getFeesAmount'
import { SwapStep } from './getSwapRoute'

export const getSwapStepFeesAmount = ({
  swapStep,
  pricesMap,
}: {
  swapStep: SwapStep
  pricesMap: Map<string, number>
}) => {
  switch (swapStep.ammLabel) {
    case 'Aldrin': {
      const amountInFee = getFeesAmount({
        pool: swapStep.pool,
        amount: swapStep.swapAmountIn,
      })

      const mint = swapStep.isSwapBaseToQuote
        ? swapStep.pool.tokenA
        : swapStep.pool.tokenB

      const symbol = getTokenNameByMintAddress(mint)

      const inputTokenPrice = pricesMap.get(symbol) || 0

      return amountInFee * inputTokenPrice
    }
    case 'Serum': {
      return 0
    }
    default: {
      return 0
    }
  }
}

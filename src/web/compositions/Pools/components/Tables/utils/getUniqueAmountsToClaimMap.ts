import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'
import { getAvailableFarmingTokensForFarmingState } from '@sb/dexUtils/pools/getAvailableFarmingTokensForFarmingState'

export const getUniqueAmountsToClaimMap = ({
  farmingTickets,
  farmingStates,
}: {
  farmingTickets: FarmingTicket[]
  farmingStates: FarmingState[]
}) => {
  return farmingStates.reduce((acc, farmingState) => {
    const { farmingTokenMint } = farmingState

    const availableToClaimFromFarmingState = getAvailableFarmingTokensForFarmingState(
      {
        farmingTickets,
        farmingState: farmingState.farmingState,
      }
    )

    if (acc.has(farmingTokenMint)) {
      const { amount, ...rest } = acc.get(farmingTokenMint)
      acc.set(farmingTokenMint, {
        ...rest,
        amount: amount + availableToClaimFromFarmingState,
      })
    } else {
      acc.set(farmingTokenMint, {
        farmingTokenMint,
        amount: availableToClaimFromFarmingState,
      })
    }

    return acc
  }, new Map())
}

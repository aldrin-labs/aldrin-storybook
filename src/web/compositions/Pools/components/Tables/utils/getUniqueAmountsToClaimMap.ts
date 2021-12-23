import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'
import { getAvailableFarmingTokensForFarmingState } from '@sb/dexUtils/pools/getAvailableFarmingTokensForFarmingState'

interface FamingStateClaimable {
  farmingTokenMint: string
  amount: number
}

export const getUniqueAmountsToClaimMap = ({
  farmingTickets,
  farmingStates = [],
}: {
  farmingTickets: FarmingTicket[]
  farmingStates?: FarmingState[]
}) => {
  if (!farmingStates) {
    return new Map<string, FamingStateClaimable>()
  }
  return farmingStates.reduce((acc, farmingState) => {
    const { farmingTokenMint } = farmingState

    if (!farmingTokenMint) {
      return acc
    }

    const availableToClaimFromFarmingState =
      getAvailableFarmingTokensForFarmingState({
        farmingTickets,
        farmingState: farmingState.farmingState,
      })

    const state = acc.get(farmingTokenMint) || {
      farmingTokenMint,
      amount: 0,
    }

    acc.set(farmingTokenMint, {
      farmingTokenMint,
      amount: state.amount + availableToClaimFromFarmingState,
    })

    return acc
  }, new Map<string, FamingStateClaimable>())
}

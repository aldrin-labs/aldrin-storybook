import { toMap } from '../../../utils/collection'
import { FarmingState, FarmingTicket, SnapshotQueue } from '../../common/types'
import { getFarmingRewardsFromFarmingStates } from './getFarmingRewardsFromFarmingStates'

interface CalculateRewardsParams {
  snapshotQueues: SnapshotQueue[]
  farmingTickets: FarmingTicket[]
  pools: {
    swapToken: string
    farming: FarmingState[] | null
  }[]
}

/**
 * Adding farming rewards (amounts to claim) for farming tickets
 */
export const addFarmingRewardsToTickets = (params: CalculateRewardsParams) => {
  const { snapshotQueues, farmingTickets, pools } = params

  const poolsMap = toMap(pools, (p) => p.swapToken)

  // go through every ticket and calc amount to claim for every farming state
  return farmingTickets.map((ticket) => {
    const farmingTicketPool = poolsMap.get(ticket.pool)
    const farmingStates = farmingTicketPool?.farming || []

    // go through every farming state inside ticket
    const amountsToClaim = getFarmingRewardsFromFarmingStates({
      farmingStates,
      snapshotQueues,
      ticket,
    })

    return { ...ticket, amountsToClaim }
  })
}

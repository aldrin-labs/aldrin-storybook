import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { StakingPool } from '@sb/dexUtils/staking/types'

import { FarmingTicket, SnapshotQueue } from '../../common/types'
import { getFarmingRewardsFromFarmingStates } from './getFarmingRewardsFromFarmingStates'

interface CalculateRewardsParams {
  snapshotQueues: SnapshotQueue[]
  farmingTickets: FarmingTicket[]
  pools: PoolInfo[] | StakingPool[]
}

/**
 * Adding farming rewards (amounts to claim) for farming tickets
 */
export const addFarmingRewardsToTickets = (params: CalculateRewardsParams) => {
  const { snapshotQueues, farmingTickets, pools } = params

  const poolsMap: Map<string, PoolInfo> = pools.reduce(
    (acc, pool) => acc.set(pool.swapToken, pool),
    new Map()
  )

  // go through every ticket and calc amount to claim for every farming state
  const userRewardsForAllTickets = farmingTickets.reduce(
    (ticketsAcc: FarmingTicket[], ticket) => {
      const farmingTicketPool = poolsMap.get(ticket.pool)
      const farmingStates = farmingTicketPool?.farming || []

      // go through every farming state inside ticket
      const amountsToClaim = getFarmingRewardsFromFarmingStates({
        farmingStates,
        snapshotQueues,
        ticket,
      })

      return [...ticketsAcc, { ...ticket, amountsToClaim }]
    },
    []
  )

  return userRewardsForAllTickets
}

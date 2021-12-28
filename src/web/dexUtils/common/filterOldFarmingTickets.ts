import { PoolInfo } from '../../compositions/Pools/index.types'
import { filterOpenFarmingStates } from '../pools/filterOpenFarmingStates'
import { DEFAULT_FARMING_TICKET_END_TIME } from './config'
import { FarmingTicket } from './types'

// Looking for old active tickets which should be closed/restake
export const filterOldFarmingTickets = (
  tickets: FarmingTicket[],
  pools: PoolInfo[]
) => {
  return tickets.filter((ticket) => {
    const existingPool = pools.find((p) => p.swapToken === ticket.pool)

    // Wrong ticket and pool does not exists
    if (!existingPool) {
      return false
    }

    const openFarmings = filterOpenFarmingStates(existingPool.farming || [])

    // No farmings for pool, or farming is ended
    if (openFarmings.length === 0) {
      return false
    }

    // Ticket is live and available space (10 slots) ending soon
    return (
      ticket.endTime === DEFAULT_FARMING_TICKET_END_TIME &&
      ticket.statesAttached.length >= 8
    )
  })
}

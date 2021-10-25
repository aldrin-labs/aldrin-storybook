import { PoolInfo } from "@sb/compositions/Pools/index.types"
import { FarmingTicket, filterClosedFarmingTickets } from "./endFarming"

export const getStakedTokensForPool = ({
  pool,
  farmingTicketsMap
}: {
  pool: PoolInfo,
  farmingTicketsMap: Map<string, FarmingTicket[]>
}) => {
  return filterClosedFarmingTickets(farmingTicketsMap.get(pool.swapToken)).reduce(
    (acc, ticket) => acc + ticket.tokensFrozen,
    0
  ) || 0
}
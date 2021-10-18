import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { FarmingTicket } from './endFarming'

export const getAvailableFarmingTokensForPool = ({
  pool,
  farmingTicketsMap,
}: {
  pool: PoolInfo
  farmingTicketsMap: Map<string, FarmingTicket[]>
}) => {
  return (
    farmingTicketsMap
      .get(pool.swapToken)
      ?.reduce((acc, ticket) => acc + ticket.amountsToClaim[0].amount, 0) || 0
  )
}

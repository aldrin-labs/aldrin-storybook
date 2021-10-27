import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { filterOpenFarmingTickets } from '@sb/dexUtils/common/filterOpenFarmingTickets'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { PoolInfo } from '../index.types'

export const getUserPoolsFromAll = ({
  poolsInfo,
  allTokensDataMap,
  farmingTicketsMap,
}: {
  allTokensDataMap: Map<string, TokenInfo>
  farmingTicketsMap: Map<string, FarmingTicket[]>
  poolsInfo: PoolInfo[]
}) => {
  return poolsInfo.filter((el) => {
    const poolTokenAmount = allTokensDataMap.has(el.poolTokenMint)
      ? allTokensDataMap.get(el.poolTokenMint).amount
      : 0

    const openFarmingTickets = filterOpenFarmingTickets(
      farmingTicketsMap.get(el.swapToken)
    )

    const availableToClaimAmount =
      farmingTicketsMap
        .get(el.swapToken)
        ?.reduce((acc, ticket) => acc + ticket.amountsToClaim[0].amount, 0) || 0

    return (
      poolTokenAmount > 0 ||
      openFarmingTickets.length > 0 ||
      availableToClaimAmount > 0
    )
  })
}

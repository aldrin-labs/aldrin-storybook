import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import {
  FarmingTicket,
  filterClosedFarmingTickets,
} from '@sb/dexUtils/pools/endFarming'
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

    const openFarmingTickets = filterClosedFarmingTickets(
      farmingTicketsMap.get(el.swapToken)
    )

    const availableToClaimAmount =
      farmingTicketsMap
        .get(el.swapToken)
        ?.reduce((acc, ticket) => acc + ticket.amountToClaim, 0) || 0

    return (
      poolTokenAmount > 0 ||
      openFarmingTickets.length > 0 ||
      availableToClaimAmount > 0
    )
  })
}

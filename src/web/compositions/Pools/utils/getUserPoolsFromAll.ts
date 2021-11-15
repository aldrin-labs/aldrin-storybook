import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY } from '@sb/dexUtils/common/config'
import { filterOpenFarmingTickets } from '@sb/dexUtils/common/filterOpenFarmingTickets'
import { getTotalFarmingAmountToClaim } from '@sb/dexUtils/common/getTotalFarmingAmountToClaim'
import { FarmingTicket } from '@sb/dexUtils/common/types'
import { getTokenDataByMint } from '.'
import { PoolInfo } from '../index.types'

export const getUserPoolsFromAll = ({
  poolsInfo,
  allTokensData,
  farmingTicketsMap,
}: {
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  poolsInfo: PoolInfo[]
}) => {
  return poolsInfo.filter((el) => {
    const { amount: poolTokenAmount } = getTokenDataByMint(
      allTokensData,
      el.poolTokenMint
    )

    const openFarmingTickets = filterOpenFarmingTickets(
      farmingTicketsMap.get(el.swapToken)
    )

    const availableToClaimAmount =
      farmingTicketsMap
        .get(el.swapToken)
        ?.reduce(
          (acc, ticket) => acc + getTotalFarmingAmountToClaim(ticket),
          0
        ) || 0

    return (
      poolTokenAmount > MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY ||
      openFarmingTickets.length > 0 ||
      availableToClaimAmount > 0
    )
  })
}

import { PublicKey } from '@solana/web3.js'
import { BN } from 'bn.js'

import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY } from '@sb/dexUtils/common/config'
import { filterOpenFarmingTickets } from '@sb/dexUtils/common/filterOpenFarmingTickets'
import { getTotalFarmingAmountToClaim } from '@sb/dexUtils/common/getTotalFarmingAmountToClaim'
import { FarmingCalc, FarmingTicket } from '@sb/dexUtils/common/types'

import { getTokenDataByMint } from '.'
import { Vesting } from '../../../dexUtils/vesting/types'
import { PoolInfo } from '../index.types'

export const getUserPoolsFromAll = ({
  poolsInfo,
  allTokensData,
  farmingTicketsMap,
  vestings,
  walletPublicKey,
  calcAccounts = new Map<string, FarmingCalc[]>(),
}: {
  allTokensData: TokenInfo[]
  farmingTicketsMap: Map<string, FarmingTicket[]>
  poolsInfo: PoolInfo[]
  vestings: Map<string, Vesting>
  walletPublicKey?: PublicKey | null
  calcAccounts?: Map<string, FarmingCalc[]>
}) => {
  const walletKey = walletPublicKey?.toBase58()
  return poolsInfo.filter((el) => {
    const { amount: poolTokenAmount } = getTokenDataByMint(
      allTokensData,
      el.poolTokenMint
    )

    const vesting = vestings.get(el.poolTokenMint)

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

    const calcAmounts = el.farming?.map((farming) =>
      (calcAccounts.get(farming.farmingState) || []).reduce(
        (acc, ca) => acc.add(ca.tokenAmount),
        new BN(0)
      )
    )

    return (
      poolTokenAmount > MIN_POOL_TOKEN_AMOUNT_TO_SHOW_LIQUIDITY ||
      openFarmingTickets.length > 0 ||
      availableToClaimAmount > 0 ||
      vesting?.startBalance.gtn(0) ||
      !!calcAmounts?.find((ca) => ca.gtn(0)) ||
      el.initializerAccount === walletKey
    )
  })
}

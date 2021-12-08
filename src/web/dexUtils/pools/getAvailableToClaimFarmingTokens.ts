import { getTotalFarmingAmountToClaim } from '../common/getTotalFarmingAmountToClaim'
import { FarmingTicket } from '../common/types'
import { MIN_POOL_TOKEN_AMOUNT_TO_STAKE } from '../common/config'
import { FarmingCalc } from '../staking/getCalcAccountsForWallet'
import { groupBy } from '../../utils/collection'
import BN from 'bn.js'

export const getAvailableToClaimFarmingTokens = (
  farmingTickets: FarmingTicket[],
  calcAccounts: FarmingCalc[] = [],
  farmingDecimals = 0,
) => {
  const calcByTicket = groupBy(calcAccounts, (ca) => ca.farmingTicket.toBase58())
  return (
    farmingTickets
      .filter((ft) => ft.tokensFrozen > MIN_POOL_TOKEN_AMOUNT_TO_STAKE)
      .reduce(
        (acc, ticket) => {
          const calculatedReward = (calcByTicket.get(ticket.farmingTicket) || [])
            .filter((cft) => ticket.amountsToClaim.find((atc) => atc.farmingState === cft.farmingState.toBase58()))
            .reduce((acc, cft) => { return acc.add(new BN(cft.tokenAmount.toString())) }, new BN(0))

          const calculatedRewardNum = parseFloat(calculatedReward.toString()) / (10 ** farmingDecimals)
          return acc + getTotalFarmingAmountToClaim(ticket) + calculatedRewardNum
        },
        0
      ) || 0
  )
}

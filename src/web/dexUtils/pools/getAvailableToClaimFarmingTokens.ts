import BN from 'bn.js'
import { MIN_POOL_TOKEN_AMOUNT_TO_STAKE } from '../common/config'
import { getTotalFarmingAmountToClaim } from '../common/getTotalFarmingAmountToClaim'
import { FarmingTicket } from '../common/types'
import { FarmingCalc } from '../common/getCalcAccountsForWallet'

export const getAvailableToClaimFarmingTokens = (
  farmingTickets: FarmingTicket[],
  calcAccounts: FarmingCalc[] = [],
  farmingDecimals = 0,
) => {

  const ticketsAmount = farmingTickets
    .filter((ft) => ft.tokensFrozen > MIN_POOL_TOKEN_AMOUNT_TO_STAKE)
    .reduce(
      (acc, ticket) => {
        ticket.amountsToClaim.forEach((atc) => acc.states.add(atc.farmingState))
        return {
          total: acc.total + getTotalFarmingAmountToClaim(ticket),
          states: acc.states
        }
      },
      { total: 0, states: new Set<string>() }
    )

  const calculatedAmount = calcAccounts
    .filter((ca) => ticketsAmount.states.has(ca.farmingState.toBase58()))
    .reduce((acc, cft) => { return acc.add(new BN(cft.tokenAmount.toString())) }, new BN(0))

  return parseFloat(calculatedAmount.toString()) / (10 ** farmingDecimals) + ticketsAmount.total
}

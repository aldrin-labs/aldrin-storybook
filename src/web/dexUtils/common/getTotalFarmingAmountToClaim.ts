import { FarmingTicket } from '../common/types'

export const getTotalFarmingAmountToClaim = (farmingTicket: FarmingTicket) => {
  return (
    farmingTicket.amountsToClaim.reduce(
      (acc, amountToClaim) => acc + amountToClaim.amount,
      0
    ) || 0
  )
}

import { FarmingTicket } from '../common/types'

export const calculateAvailableToClaim = (farmingTickets: FarmingTicket[]) => {
  const availableToClaim = farmingTickets.reduce((acc, current) => {
    return (
      acc +
      current.amountsToClaim.reduce((acc: number, current) => {
        return acc + current.amount
      }, 0)
    )
  }, 0)

  return availableToClaim
}

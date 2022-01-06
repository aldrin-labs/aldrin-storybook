import {
  FarmingCalc,
  FarmingState,
  FarmingTicket,
} from '@sb/dexUtils/common/types'

interface FamingStateClaimable {
  farmingTokenMint: string
  amount: number
}

export const getUniqueAmountsToClaimMap = ({
  farmingTickets,
  farmingStates = [],
  calcAccounts = new Map<string, FarmingCalc>(),
}: {
  farmingTickets: FarmingTicket[]
  farmingStates?: FarmingState[]
  calcAccounts?: Map<string, FarmingCalc>
}) => {
  if (!farmingStates) {
    return new Map<string, FamingStateClaimable>()
  }
  return farmingStates.reduce((acc, farmingState) => {
    const {
      farmingTokenMint,
      farmingState: fs,
      farmingTokenMintDecimals,
    } = farmingState

    if (!farmingTokenMint) {
      return acc
    }

    const state = acc.get(farmingTokenMint) || {
      farmingTokenMint,
      amount: 0,
    }

    const calcAccountAmount =
      parseFloat(calcAccounts.get(fs)?.tokenAmount.toString() || '0') /
      10 ** farmingTokenMintDecimals

    acc.set(farmingTokenMint, {
      farmingTokenMint,
      amount: state.amount + calcAccountAmount,
    })

    return acc
  }, new Map<string, FamingStateClaimable>())
}

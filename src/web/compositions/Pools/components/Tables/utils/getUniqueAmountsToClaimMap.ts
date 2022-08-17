import { BN } from 'bn.js'

import { FarmingCalc, FarmingState } from '@sb/dexUtils/common/types'

interface FamingStateClaimable {
  farmingTokenMint: string
  amount: number
}

export const getUniqueAmountsToClaimMap = ({
  farmingStates = [],
  calcAccounts = new Map<string, FarmingCalc[]>(),
}: {
  farmingStates?: FarmingState[]
  calcAccounts?: Map<string, FarmingCalc[]>
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
      parseFloat(
        (calcAccounts.get(fs) || [])
          .reduce((acc2, ca) => acc2.add(ca.tokenAmount), new BN(0))
          .toString()
      ) /
      10 ** farmingTokenMintDecimals

    acc.set(farmingTokenMint, {
      farmingTokenMint,
      amount: state.amount + calcAccountAmount,
    })

    return acc
  }, new Map<string, FamingStateClaimable>())
}

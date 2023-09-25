import { Connection } from '@solana/web3.js'

import { getMultipleAccounts } from './getMultipleAccounts'
import { FarmingStateRaw, FarmingTokenMintsMap } from './types'

export const getFarmingTokenMintsMap = async (
  connection: Connection,
  farmingStates: FarmingStateRaw[]
) => {
  const farmingTokenVaults = farmingStates.reduce(
    (acc: string[], farmingData) => {
      acc.push(farmingData.farmingTokenVault.toString())
      return acc
    },
    []
  )

  const farmingTokenVaultsData = await getMultipleAccounts({
    connection,
    accounts: farmingTokenVaults,
  })

  const farmingTokenMintsMap: FarmingTokenMintsMap =
    farmingTokenVaultsData.reduce((acc, el, index) => {
      const infoData = el.data.parsed.info
      const { mint, tokenAmount } = infoData
      const { decimals } = tokenAmount

      acc[farmingTokenVaults[index]] = { mint, decimals }

      return acc
    }, {})

  return farmingTokenMintsMap
}

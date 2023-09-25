import { Connection } from '@solana/web3.js'

import { getFarmingTokenMintsMap } from './getFarmingTokenMintsMap'
import { FarmingStateRaw, FarmingTokenMintsMap } from './types'

export const addFarmingTokenMintToFarmingStates = async (
  connection: Connection,
  farmingStates: FarmingStateRaw[]
) => {
  let farmingTokenMintsMap: FarmingTokenMintsMap

  try {
    farmingTokenMintsMap = await getFarmingTokenMintsMap(
      connection,
      farmingStates
    )
  } catch (e) {
    console.log(
      'getting farmingTokenMintsMap error in addFarmingTokenMintToFarmingStates',
      e
    )
    throw e
  }

  return farmingStates.map((farmingState) => {
    const farmingTokenMintData =
      farmingTokenMintsMap[farmingState.farmingTokenVault.toString()]
    const farmingTokenMint = farmingTokenMintData && farmingTokenMintData.mint
    const farmingTokenMintDecimals =
      farmingTokenMintData && farmingTokenMintData.decimals

    return {
      ...farmingState,
      farmingTokenMint,
      farmingTokenMintDecimals,
    }
  })
}

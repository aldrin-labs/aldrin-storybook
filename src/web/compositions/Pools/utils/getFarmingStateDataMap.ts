import { Program } from '@project-serum/anchor'
import { Connection, PublicKey } from '@solana/web3.js'

import { addFarmingTokenMintToFarmingStates } from './addFarmingTokenMintToFarmingStates'
import { ACCOUNT_DATA_SIZE_MAP_BY_PROGRAM_ID } from './config'
import { FarmingStateDataMap, FarmingStateRaw } from './types'

export const getFarmingStateDataMap = async (
  program: Program,
  connection: Connection,
  programId: PublicKey
): Promise<FarmingStateDataMap> => {
  const dataSizes = ACCOUNT_DATA_SIZE_MAP_BY_PROGRAM_ID[programId.toString()]

  const farmingStateData = await connection.getProgramAccounts(programId, {
    commitment: 'finalized',
    filters: [{ dataSize: dataSizes.FarmingState }],
  })

  const parsedFarmingStates: FarmingStateRaw[] = farmingStateData.map((el) => {
    const farmingDataParsed = program.coder.accounts.decode(
      'FarmingState',
      el.account.data
    )
    return {
      ...farmingDataParsed,
      farmingPubKey: el.pubkey,
    }
  })

  const farmingStatesWithMints = await addFarmingTokenMintToFarmingStates(
    connection,
    parsedFarmingStates
  )

  const farmingStateDataMap: FarmingStateDataMap =
    farmingStatesWithMints.reduce((acc: FarmingStateDataMap, farmingData) => {
      const poolAddress = farmingData.pool.toString()

      if (acc[poolAddress]) {
        acc[poolAddress].push(farmingData)
      } else {
        acc[poolAddress] = [farmingData]
      }

      return acc
    }, {})

  return farmingStateDataMap
}

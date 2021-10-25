import { Connection } from '@solana/web3.js'
import { STAKING_FARMING_STATE } from '../common/config'
import { loadAccountsFromStakingProgram } from './loadAccountsFromStakingProgram'

export const loadStakingFarmingStates = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromStakingProgram({
    connection,
    filters: [
      {
        dataSize: STAKING_FARMING_STATE,
      },
    ],
  })
}

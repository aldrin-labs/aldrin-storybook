import { Connection } from '@solana/web3.js'
import { STAKING_SNAPSHOTS_SIZE } from '../common/config'
import { loadAccountsFromStakingProgram } from './loadAccountsFromStakingProgram'

export const loadStakingSnapshots = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromStakingProgram({
    connection,
    filters: [
      {
        dataSize: STAKING_SNAPSHOTS_SIZE,
      },
    ],
  })
}

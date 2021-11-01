import { Connection } from '@solana/web3.js'
import { SNAPSHOT_QUEUE_SIZE } from '../common/config'
import { loadAccountsFromPoolsProgram } from './loadAccountsFromPoolsProgram'

export const loadSnapshotQueues = async ({
  connection,
}: {
  connection: Connection
}) => {
  return await loadAccountsFromPoolsProgram({
    connection,
    filters: [
      {
        dataSize: SNAPSHOT_QUEUE_SIZE,
      },
    ],
  })
}

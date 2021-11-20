import { Connection } from '@solana/web3.js'
import { Snapshot, SnapshotQueue } from '../common/types'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadSnapshotQueues } from './loadSnapshotQueues'

export const getParsedSnapshotQueues = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<SnapshotQueue[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: POOLS_PROGRAM_ADDRESS,
  })

  const snapshotQueues = await loadSnapshotQueues({
    connection,
  })

  const parsedSnapshotQueues = snapshotQueues.map((snapshot) => {
    const data = Buffer.from(snapshot.account.data)
    const snapshotQueueData = program.coder.accounts.decode(
      'SnapshotQueue',
      data
    )

    const parsedSnapshots: Snapshot[] = snapshotQueueData.snapshots
      .map((el) => {
        return {
          time: el.time.toNumber(),
          isInitialized: el.isInitialized,
          tokensFrozen: parseFloat(el?.tokensFrozen?.toSring()),
          tokensTotal: parseFloat(el?.farmingTokens?.toString()),
        }
      })
      .filter((snapshot: Snapshot) => snapshot.isInitialized)

    return {
      publicKey: snapshot.pubkey.toString(),
      nextIndex: parseFloat(snapshotQueueData.nextIndex.toNumber()),
      snapshots: parsedSnapshots,
    }
  })

  return parsedSnapshotQueues
}

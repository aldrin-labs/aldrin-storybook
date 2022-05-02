import { Connection } from '@solana/web3.js'

import { Snapshot, SnapshotQueue } from '../common/types'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { loadStakingSnapshots } from './loadStakingSnapshots'

export const getParsedStakingSnapshots = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<SnapshotQueue[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const snapshots = await loadStakingSnapshots({
    connection,
  })

  const allUserSnapshots = snapshots.map((snapshot) => {
    const data = Buffer.from(snapshot.account.data)
    const snapshotQueueData = program.coder.accounts.decode(
      'SnapshotQueue',
      data
    )

    const parsedSnapshotData: Snapshot[] = snapshotQueueData.snapshots
      .map((el) => {
        return {
          time: el.time.toNumber(),
          isInitialized: el.isInitialized,
          tokensFrozen: parseFloat(el?.tokensFrozen?.toString()),
          tokensTotal: parseFloat(el?.farmingTokens?.toString()),
        }
      })
      .filter((snapshot) => snapshot.isInitialized)

    return {
      publicKey: snapshot.pubkey.toString(),
      nextIndex: snapshotQueueData.nextIndex.toNumber(),
      snapshots: parsedSnapshotData,
    }
  })

  return allUserSnapshots
}

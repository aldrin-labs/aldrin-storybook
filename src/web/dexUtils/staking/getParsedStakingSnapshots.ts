import { Connection } from '@solana/web3.js'
import { StakingSnapshot, StakingSnapshotQueue } from '../common/types'
import { ProgramsMultiton } from '../ProgramsMultiton/ProgramsMultiton'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { WalletAdapter } from '../types'
import { STAKING_FARMING_TOKEN_MULTIPLIER } from './config'
import { loadStakingSnapshots } from './loadStakingSnapshots'

export const getParsedStakingSnapshots = async ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): Promise<StakingSnapshotQueue[]> => {
  const program = ProgramsMultiton.getProgramByAddress({
    wallet,
    connection,
    programAddress: STAKING_PROGRAM_ADDRESS,
  })

  const shapshots = await loadStakingSnapshots({
    connection,
  })

  const allUserSnapshots = shapshots.map((snapshot) => {
    const data = Buffer.from(snapshot.account.data)
    const snapshotQueueData = program.coder.accounts.decode(
      'SnapshotQueue',
      data
    )

    const parsedSnapshotData: StakingSnapshot[] = snapshotQueueData.snapshots
      .map((el) => {
        return {
          time: el.time.toNumber(),
          isInitialized: el.isInitialized,
          tokensFrozen:
            el?.tokensFrozen?.toNumber() * STAKING_FARMING_TOKEN_MULTIPLIER,
          tokensTotal:
            el?.tokensTotal?.toNumber() * STAKING_FARMING_TOKEN_MULTIPLIER,
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

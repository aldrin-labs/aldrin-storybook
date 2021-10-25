import { Connection } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { StakingSnapshotQueue } from '../common/types'
import { RefreshFunction, WalletAdapter } from '../types'
import { getParsedStakingSnapshots } from './getParsedStakingSnapshots'

export const useStakingSnapshotQueues = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [StakingSnapshotQueue[], RefreshFunction] => {
  const [allStakingSnapshotQueues, setAllStakingSnapshotQueues] = useState<
    StakingSnapshotQueue[]
  >([])
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadStakingSnapshotQueues = async () => {
      const allStakingSnapshotQueues = await getParsedStakingSnapshots({
        wallet,
        connection,
      })

      setAllStakingSnapshotQueues(allStakingSnapshotQueues)
    }

    loadStakingSnapshotQueues()
  }, [refreshCounter])

  return [allStakingSnapshotQueues, refresh]
}

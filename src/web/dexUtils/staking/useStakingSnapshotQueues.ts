import { Connection } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'
import { StakingSnapshotQueue } from '../common/types'
import { WalletAdapter, AsyncRefreshFunction } from '../types'
import { getParsedStakingSnapshots } from './getParsedStakingSnapshots'

export const useStakingSnapshotQueues = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [StakingSnapshotQueue[], AsyncRefreshFunction] => {
  const [allStakingSnapshotQueues, setAllStakingSnapshotQueues] = useState<
    StakingSnapshotQueue[]
  >([])

  const loadStakingSnapshotQueues = useCallback(async () => {
    const allStakingSnapshotQueues = await getParsedStakingSnapshots({
      wallet,
      connection,
    })
    setAllStakingSnapshotQueues(allStakingSnapshotQueues)
    return true
  }, [])

  useEffect(() => {
    loadStakingSnapshotQueues()
  }, [])
  
  return [allStakingSnapshotQueues, loadStakingSnapshotQueues]
}

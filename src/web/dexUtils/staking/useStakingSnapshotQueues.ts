import { Connection } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'

import { getParsedStakingSnapshotQueues } from '@core/solana'

import { SnapshotQueue } from '../common/types'
import { WalletAdapter, AsyncRefreshFunction } from '../types'

export const useStakingSnapshotQueues = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [SnapshotQueue[], AsyncRefreshFunction] => {
  const [allStakingSnapshotQueues, setAllStakingSnapshotQueues] = useState<
    SnapshotQueue[]
  >([])

  const loadStakingSnapshotQueues = useCallback(async () => {
    const stakingSnapshotQueues = await getParsedStakingSnapshotQueues({
      wallet,
      connection,
    })
    setAllStakingSnapshotQueues(stakingSnapshotQueues)
    return true
  }, [])

  useEffect(() => {
    loadStakingSnapshotQueues()
  }, [])

  return [allStakingSnapshotQueues, loadStakingSnapshotQueues]
}

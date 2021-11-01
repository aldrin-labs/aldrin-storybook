import { Connection } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'
import { SnapshotQueue } from '../common/types'
import { WalletAdapter, AsyncRefreshFunction } from '../types'
import { getParsedSnapshotQueues } from './getParsedSnapshotQueues'

export const useSnapshotQueues = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [SnapshotQueue[], AsyncRefreshFunction] => {
  const [allSnapshotQueues, setAllSnapshotQueues] = useState<SnapshotQueue[]>(
    []
  )

  const loadSnapshotQueues = useCallback(async () => {
    const allSnapshotQueues = await getParsedSnapshotQueues({
      wallet,
      connection,
    })

    setAllSnapshotQueues(allSnapshotQueues)

    return true
  }, [])

  useEffect(() => {
    loadSnapshotQueues()
  }, [])

  return [allSnapshotQueues, loadSnapshotQueues]
}

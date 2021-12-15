import { Connection } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'
import { SnapshotQueue } from '@sb/dexUtils/common/types'
import { WalletAdapter, AsyncRefreshFunction } from '@sb/dexUtils/types'
import { getParsedSnapshotQueues } from '@sb/dexUtils/pools/snapshotQueue/getParsedSnapshotQueues'

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

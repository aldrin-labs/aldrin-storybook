import { Connection } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'

import { SnapshotQueue } from '@sb/dexUtils/common/types'
import { getParsedSnapshotQueues } from '@sb/dexUtils/pools/snapshotQueue/getParsedSnapshotQueues'
import { WalletAdapter, AsyncRefreshFunction } from '@sb/dexUtils/types'

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
    if (!wallet.publicKey) {
      return false
    }
    const allSnapshots = await getParsedSnapshotQueues({
      wallet,
      connection,
    })

    setAllSnapshotQueues(allSnapshots)

    return true
  }, [wallet.publicKey?.toBase58()])

  useEffect(() => {
    loadSnapshotQueues()
  }, [wallet.publicKey?.toBase58()])

  return [allSnapshotQueues, loadSnapshotQueues]
}

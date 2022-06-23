import { useEffect, useState, useCallback } from 'react'

import { SnapshotQueue } from '@sb/dexUtils/common/types'
import { AsyncRefreshFunction } from '@sb/dexUtils/types'

import { getParsedAmmFarmingSnapshotQueues } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useSnapshotQueues = (): [
  SnapshotQueue[],
  AsyncRefreshFunction
] => {
  const [allSnapshotQueues, setAllSnapshotQueues] = useState<SnapshotQueue[]>(
    []
  )

  const connection = useConnection()
  const { wallet } = useWallet()

  const loadSnapshotQueues = useCallback(async () => {
    try {
      const w = walletAdapterToWallet(wallet)

      const allSnapshots = await getParsedAmmFarmingSnapshotQueues({
        wallet: w,
        connection,
      })

      setAllSnapshotQueues(allSnapshots)
    } catch (e) {
      return false
    }

    return true
  }, [wallet.publicKey?.toBase58()])

  useEffect(() => {
    loadSnapshotQueues()
  }, [wallet.publicKey?.toBase58()])

  return [allSnapshotQueues, loadSnapshotQueues]
}

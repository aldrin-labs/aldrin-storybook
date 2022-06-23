import { Connection } from '@solana/web3.js'
import { useEffect, useState } from 'react'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import {
  FarmingTicket,
  PoolAddress,
  SnapshotQueue,
} from '@sb/dexUtils/common/types'
import { RefreshFunction, WalletAdapter } from '@sb/dexUtils/types'

import {
  getParsedUserFarmingTickets,
  addFarmingRewardsToTickets,
} from '@core/solana'

import { groupBy } from '../../../utils'

/**
 *
 * @param
 * @returns tickets groupped by pool address
 */
export const useFarmingTicketsMap = ({
  wallet,
  connection,
  pools,
  snapshotQueues,
}: {
  wallet: WalletAdapter
  connection: Connection
  pools: PoolInfo[]
  snapshotQueues: SnapshotQueue[]
}): [Map<string, FarmingTicket[]>, RefreshFunction] => {
  const [farmingTicketsMap, setFarmingTicketsMap] = useState(
    new Map<PoolAddress, FarmingTicket[]>()
  )

  const [refreshCounter, setRefreshCounter] = useState(0)
  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadFarmingTickets = async () => {
      const allUserFarmingTickets = await getParsedUserFarmingTickets({
        wallet,
        connection,
      })

      const allUserFarmingTicketsWithAmountsToClaim =
        addFarmingRewardsToTickets({
          pools,
          farmingTickets: allUserFarmingTickets,
          snapshotQueues,
        })

      const ticketMap = groupBy(
        allUserFarmingTicketsWithAmountsToClaim,
        (ticket) => ticket.pool
      )

      setFarmingTicketsMap(ticketMap)
    }

    if (
      pools &&
      pools.length > 0 &&
      snapshotQueues &&
      snapshotQueues.length > 0 &&
      wallet.publicKey
    ) {
      loadFarmingTickets()
    }
  }, [wallet.publicKey, pools, snapshotQueues, refreshCounter])

  return [farmingTicketsMap, refresh]
}

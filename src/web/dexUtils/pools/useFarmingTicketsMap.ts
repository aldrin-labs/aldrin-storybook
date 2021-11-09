import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { RefreshFunction, WalletAdapter } from '../types'
import { getParsedUserFarmingTickets } from './getParsedUserFarmingTickets'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { FarmingTicket, PoolAddress, SnapshotQueue } from '../common/types'
import { addFarmingRewardsToTickets } from './addFarmingRewardsToTickets/addFarmingRewardsToTickets'

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
  const [farmingTicketsMap, setFarmingTicketsMap] = useState<
    Map<PoolAddress, FarmingTicket[]>
  >(new Map())

  const [refreshCounter, setRefreshCounter] = useState(0)
  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadFarmingTickets = async () => {
      const allUserFarmingTickets = await getParsedUserFarmingTickets({
        wallet,
        connection,
      })

      const allUserFarmingTicketsWithAmountsToClaim = addFarmingRewardsToTickets(
        {
          pools,
          farmingTickets: allUserFarmingTickets,
          snapshotQueues,
        }
      )

      const farmingTicketsMap = allUserFarmingTicketsWithAmountsToClaim.reduce(
        (acc, farmingTicket) => {
          const { pool } = farmingTicket

          if (acc.has(pool)) {
            acc.set(pool, [...acc.get(pool), farmingTicket])
          } else {
            acc.set(pool, [farmingTicket])
          }

          return acc
        },
        new Map()
      )

      setFarmingTicketsMap(farmingTicketsMap)
    }

    if (pools && pools.length > 0 && snapshotQueues && snapshotQueues.length > 0 && wallet.publicKey) {
      loadFarmingTickets()
    }
  }, [wallet.publicKey, pools, snapshotQueues, refreshCounter])

  return [farmingTicketsMap, refresh]
}

import { useEffect, useState } from 'react'
import { Connection } from '@solana/web3.js'
import { RefreshFunction, WalletAdapter } from '../types'
import { getParsedUserFarmingTickets } from './getParsedUserFarmingTickets'
import { addAmountsToClaimForFarmingTickets } from './addAmountsToClaimForFarmingTickets'
import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { FarmingTicket, PoolAddress } from './types'

export const useFarmingTicketsMap = ({
  wallet,
  connection,
  pools,
}: {
  wallet: WalletAdapter
  connection: Connection
  pools: PoolInfo[]
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

      const allUserFarmingTicketsWithAmountsToClaim = await addAmountsToClaimForFarmingTickets(
        {
          pools,
          wallet,
          connection,
          allUserFarmingTickets,
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

    if (pools && pools.length > 0 && wallet.publicKey) {
      loadFarmingTickets()
    }
  }, [wallet.publicKey, pools, refreshCounter])

  return [farmingTicketsMap, refresh]
}

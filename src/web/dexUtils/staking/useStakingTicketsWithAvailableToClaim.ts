import { Connection, PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'
import { FarmingTicket, SnapshotQueue } from '../common/types'
import { RefreshFunction, WalletAdapter } from '../types'
import { StakingPool } from './types'
import { addFarmingRewardsToTickets } from '../pools/addFarmingRewardsToTickets/addFarmingRewardsToTickets'

export const useStakingTicketsWithAvailableToClaim = ({
  wallet,
  connection,
  walletPublicKey,
  stakingPool,
  snapshotQueues,
  allStakingFarmingTickets,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
  stakingPool: StakingPool
  snapshotQueues: SnapshotQueue[]
  allStakingFarmingTickets: FarmingTicket[]
}): [FarmingTicket[], RefreshFunction] => {
  const [availableToClaim, setAvailableToClaim] = useState(<FarmingTicket[]>[])
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const getAvailableToClaim = async () => {
      const availableToClaimFarmingTickets = addFarmingRewardsToTickets({
        pools: [stakingPool],
        farmingTickets: allStakingFarmingTickets,
        snapshotQueues,
      })

      setAvailableToClaim(availableToClaimFarmingTickets)
    }

    getAvailableToClaim()
  }, [
    JSON.stringify(allStakingFarmingTickets),
    refreshCounter,
    JSON.stringify(stakingPool),
    JSON.stringify(snapshotQueues),
    wallet.publicKey,
  ])

  return [availableToClaim, refresh]
}

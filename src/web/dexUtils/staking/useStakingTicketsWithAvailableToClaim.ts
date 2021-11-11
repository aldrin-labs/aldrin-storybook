import { Connection, PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'
import { FarmingTicket, SnapshotQueue } from '../common/types'
import { addAmountsToClaimForFarmingTickets } from '../common/addAmountsToClaimForFarmingTickets'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
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
  snapshotQueues: SnapshotQueue
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
  }, [JSON.stringify(allStakingFarmingTickets), refreshCounter])

  return [availableToClaim, refresh]
}

import { Connection, PublicKey } from '@solana/web3.js'
import { useState, useEffect } from 'react'
import { FarmingTicket } from '../common/types'
import { addAmountsToClaimForFarmingTickets } from '../pools/addAmountsToClaimForFarmingTickets'
import { STAKING_PROGRAM_ADDRESS } from '../ProgramsMultiton/utils'
import { RefreshFunction, WalletAdapter } from '../types'
import { calculateAvailableToClaim } from './calculateAvailableToClaim'
import { StakingPool } from './types'

export const useStakingTicketsWithAvailableToClaim = ({
  wallet,
  connection,
  walletPublicKey,
  parsedStakingPool,
  allStakingFarmingTickets,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
  parsedStakingPool: StakingPool
  allStakingFarmingTickets: FarmingTicket[]
}): [FarmingTicket[], RefreshFunction] => {
  const [availableToClaim, setAvailableToClaim] = useState(<FarmingTicket[]>[])
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const getAvailableToClaim = async () => {
      const availableToClaimFarmingTickets = await addAmountsToClaimForFarmingTickets(
        {
          pools: [parsedStakingPool],
          wallet,
          connection,
          allUserFarmingTickets: allStakingFarmingTickets,
          programAddress: STAKING_PROGRAM_ADDRESS,
        }
      )
      console.log('availableToClaim', availableToClaimFarmingTickets)

      setAvailableToClaim(availableToClaimFarmingTickets)
    }
    getAvailableToClaim()
  }, [allStakingFarmingTickets])

  return [availableToClaim, refresh]
}

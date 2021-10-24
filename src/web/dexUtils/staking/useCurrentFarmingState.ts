import { Connection } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { FarmingState } from '../common/types'
import { RefreshFunction, WalletAdapter } from '../types'
import { getCurrentFarmingStateFromAll } from './getCurrentFarmingStateFromAll'
import { getParsedStakingFarmingStates } from './getParsedStakingFarmingStates'

export const useCurrentFarmingState = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [FarmingState, RefreshFunction] => {
  const [currentStakingFarmingState, setCurrentStakingFarmingState] = useState(
    <FarmingState>{}
  )
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadStakingFarmingStates = async () => {
      const allStakingFarmingStates = await getParsedStakingFarmingStates({
        wallet,
        connection,
      })
      const currentStakingFarmingState = getCurrentFarmingStateFromAll(
        allStakingFarmingStates
      )
      console.log('currentStakingFarmingState', currentStakingFarmingState)
      setCurrentStakingFarmingState(currentStakingFarmingState)
    }

    loadStakingFarmingStates()
  }, [refreshCounter])

  return [currentStakingFarmingState, refresh]
}

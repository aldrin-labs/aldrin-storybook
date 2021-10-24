import { Connection } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { FarmingState } from '../common/types'
import { RefreshFunction, WalletAdapter } from '../types'
import { getParsedStakingFarmingStates } from './getParsedStakingFarmingStates'

export const useAllFarmingStates = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [FarmingState[], RefreshFunction] => {
  const [allStakingFarmingStates, setAllStakingFarmingStates] = useState<
    FarmingState[]
  >([])
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadStakingFarmingStates = async () => {
      const allStakingFarmingStates = await getParsedStakingFarmingStates({
        wallet,
        connection,
      })

      setAllStakingFarmingStates(allStakingFarmingStates)
    }

    loadStakingFarmingStates()
  }, [refreshCounter])

  return [allStakingFarmingStates, refresh]
}

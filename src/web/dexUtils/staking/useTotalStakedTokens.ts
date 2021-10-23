import { useEffect, useState } from 'react'
import { Connection } from '@solana/web3.js'
import { getStakedTokensFromOpenFarmingTickets } from '../common/getStakedTokensFromOpenFarmingTickets'
import { RefreshFunction, WalletAdapter } from '../types'
import { getParsedStakingFarmingTickets } from './getParsedStakingFarmingTickets'

export const useTotalStakedTokens = ({
  wallet,
  connection,
}: {
  wallet: WalletAdapter
  connection: Connection
}): [number, RefreshFunction] => {
  const [totalStakedTokens, setTotalStakedTokens] = useState(0)
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadStakingTickets = async () => {
      const allStakingFarmingTickets = await getParsedStakingFarmingTickets({
        wallet,
        connection,
      })

      const totalStakedTokens = getStakedTokensFromOpenFarmingTickets(
        allStakingFarmingTickets
      )
      
      setTotalStakedTokens(totalStakedTokens)
    }

    loadStakingTickets()
  }, [refreshCounter])

  return [totalStakedTokens, refresh]
}

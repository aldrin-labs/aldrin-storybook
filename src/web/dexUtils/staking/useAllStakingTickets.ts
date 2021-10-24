import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState } from 'react'
import { FarmingTicket } from '../common/types'
import { RefreshFunction, WalletAdapter } from '../types'
import { getParsedStakingFarmingTickets } from './getParsedStakingFarmingTickets'

export const useAllStakingTickets = ({
  wallet,
  connection,
  walletPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
}): [FarmingTicket[], RefreshFunction] => {
  const [allStakingFarmingTickets, setAllStakingFarmingTickets] = useState<
    FarmingTicket[]
  >([])
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadStakingTickets = async () => {
      const allStakingFarmingTickets = await getParsedStakingFarmingTickets({
        wallet,
        connection,
        walletPublicKey,
      })

      setAllStakingFarmingTickets(allStakingFarmingTickets)
    }

    loadStakingTickets()
  }, [refreshCounter, walletPublicKey])

  return [allStakingFarmingTickets, refresh]
}

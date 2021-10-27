import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'
import { FarmingTicket } from '../common/types'
import { WalletAdapter, AsyncRefreshFunction } from '../types'
import { getParsedStakingFarmingTickets } from './getParsedStakingFarmingTickets'

export const useAllStakingTickets = ({
  wallet,
  connection,
  walletPublicKey,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey
}): [FarmingTicket[], AsyncRefreshFunction] => {
  const [allStakingFarmingTickets, setAllStakingFarmingTickets] = useState<
    FarmingTicket[]
  >([])

  const loadStakingTickets = useCallback(
    async () => {
      const allStakingFarmingTickets = await getParsedStakingFarmingTickets({
        wallet,
        connection,
        walletPublicKey,
      })

      setAllStakingFarmingTickets(allStakingFarmingTickets)
      return true
    },
    [walletPublicKey],
  )

  useEffect(() => {
    loadStakingTickets()
  }, [walletPublicKey])

  return [allStakingFarmingTickets, loadStakingTickets]
}

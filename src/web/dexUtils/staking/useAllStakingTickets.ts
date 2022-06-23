import { Connection, PublicKey } from '@solana/web3.js'
import { useEffect, useState, useCallback } from 'react'

import { getParsedUserStakingTickets } from '@core/solana'

import { FarmingTicket } from '../common/types'
import { WalletAdapter, AsyncRefreshFunction } from '../types'

export const useAllStakingTickets = ({
  wallet,
  connection,
  walletPublicKey,
  onlyUserTickets = false,
}: {
  wallet: WalletAdapter
  connection: Connection
  walletPublicKey?: PublicKey | null
  onlyUserTickets?: boolean
}): [FarmingTicket[], AsyncRefreshFunction] => {
  const [allStakingFarmingTickets, setAllStakingFarmingTickets] = useState<
    FarmingTicket[]
  >([])

  const loadStakingTickets = useCallback(async () => {
    if (onlyUserTickets && !walletPublicKey) {
      setAllStakingFarmingTickets([])
      return false
    }
    const allTickets = await getParsedUserStakingTickets({
      wallet,
      connection,
    })

    setAllStakingFarmingTickets(allTickets)
    return true
  }, [walletPublicKey])

  useEffect(() => {
    loadStakingTickets()
  }, [walletPublicKey])

  return [allStakingFarmingTickets, loadStakingTickets]
}

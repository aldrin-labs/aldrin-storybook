import { Connection, PublicKey } from '@solana/web3.js'
import useSWR from 'swr'

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
  const fetcher = async () => {
    if (onlyUserTickets && !walletPublicKey) {
      return []
    }

    const allTickets = await getParsedUserStakingTickets({
      wallet,
      connection,
    })

    return allTickets
  }

  const { data, mutate } = useSWR(
    `all-staking-tickets-${wallet.publicKey?.toString()}`,
    fetcher
  )

  return [data || [], mutate]
}

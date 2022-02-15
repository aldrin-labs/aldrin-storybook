import useSWR from 'swr'

import { useWallet } from '@sb/dexUtils/wallet'

import { useMarinadeSdk } from './useMarinadeSdk'

export const useMarinadeTickets = () => {
  const sdk = useMarinadeSdk()
  const { wallet } = useWallet()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return undefined
    }
    const state = await sdk.getMarinadeState()
    console.log('state: ', state)
    (await sdk.depositStakeAccount(wallet.publicKey))
    return state
  }
  return useSWR(`marinade-tickets-${wallet.publicKey?.toString()}`, fetcher, {
    refreshInterval: 60_000,
  })
}

import useSWR from 'swr'

import { loadFarmerAccountsData } from '@core/solana/programs/farming/fetchers/loadFarmerAccountsData'

import { useConnection } from '../connection'
import { useWallet } from '../wallet'

export const useFarmersAccountInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    const accountInfo = await loadFarmerAccountsData({ connection, wallet })
    return accountInfo
  }

  return useSWR(`farmers-account-info-${wallet.publicKey?.toString()}`, fetcher) // .data
}

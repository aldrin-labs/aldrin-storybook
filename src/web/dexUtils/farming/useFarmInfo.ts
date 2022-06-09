import useSWR from 'swr'

import { loadFarmAccountsData } from '@core/solana/programs/farming/fetchers/loadFarmAccountsData'

import { useConnection } from '../connection'
import { useWallet } from '../wallet'

export const useFarmInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    const accountInfo = await loadFarmAccountsData({ connection, wallet })
    return accountInfo
  }

  return useSWR(`farm-info-${wallet.publicKey?.toString()}`, fetcher) // .data
}

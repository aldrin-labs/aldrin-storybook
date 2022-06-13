import useSWR from 'swr'

import { useWallet, walletAdapterToWallet } from '@core/solana'
import { loadFarmerAccountsData } from '@core/solana/programs/farming/fetchers/loadFarmerAccountsData'

import { useConnection } from '../connection'

export const useFarmersAccountInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  if (!wallet.publicKey) {
    return
  }

  const walletWithPk = walletAdapterToWallet(wallet)

  const fetcher = async () => {
    const accountInfo = await loadFarmerAccountsData({
      connection,
      wallet: walletWithPk,
    })
    return accountInfo
  }

  return useSWR(`farmers-account-info-${wallet.publicKey?.toString()}`, fetcher) // .data
}

import useSWR from 'swr'

import { walletAdapterToWallet, loadFarmerAccountsData } from '@core/solana'

import { toMap } from '../../../utils'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useFarmersAccountInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    const walletWithPk = walletAdapterToWallet(wallet)

    const accountInfo = await loadFarmerAccountsData({
      connection,
      wallet: walletWithPk,
    })
    return toMap(accountInfo, (acc) => acc.account.farm.toString())
  }

  return useSWR(`farmers-account-info-${wallet.publicKey?.toString()}`, fetcher) // .data
}

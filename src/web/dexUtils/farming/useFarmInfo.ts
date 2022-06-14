import useSWR from 'swr'

import { loadFarmAccountsData, walletAdapterToWallet, Farm } from '@core/solana'

import { toMap } from '../../utils'
import { useConnection } from '../connection'
import { useWallet } from '../wallet'

export const useFarmInfo = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return new Map<string, Farm>()
    }
    const walletWithPk = walletAdapterToWallet(wallet)

    const farms = await loadFarmAccountsData({
      connection,
      wallet: walletWithPk,
    })

    return toMap(farms, (farm) => farm.stakeMint.toString())
  }

  return useSWR(`farm-info-${wallet.publicKey?.toString()}`, fetcher) // .data}
}

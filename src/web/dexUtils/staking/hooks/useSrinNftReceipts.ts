import useSWR from 'swr'

import { fetchSrinNftReceipts } from '@core/solana'

import { walletAdapterToWallet } from '../../common'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useSrinNftReceipts = () => {
  const { wallet } = useWallet()
  const connection = useConnection()

  return useSWR(`srin-nft-receipts-${wallet.publicKey?.toString()}`, () => {
    if (!wallet.publicKey) {
      return []
    }

    const w = walletAdapterToWallet(wallet)
    return fetchSrinNftReceipts(w, connection)
  })
}

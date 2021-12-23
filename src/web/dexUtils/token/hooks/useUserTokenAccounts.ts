import useSWR from 'swr'

import { getAllTokensData } from '@sb/compositions/Rebalance/utils'

import { useConnection } from '../../connection'
import { RefreshFunction, TokenInfo } from '../../types'
import { useWallet } from '../../wallet'

export const useUserTokenAccounts = (): [TokenInfo[], RefreshFunction] => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    console.log('Fetch tokens1')
    if (!wallet.publicKey) {
      return []
    }
    console.log('Fetch tokens2')
    const data = await getAllTokensData(wallet.publicKey, connection)
    console.log('Fetch tokens3', data)
    return data
  }

  const swr = useSWR(`usertokens-${wallet.publicKey?.toBase58()}`, fetcher, {
    refreshInterval: 60_000,
  })

  return [swr.data || [], swr.mutate]
}

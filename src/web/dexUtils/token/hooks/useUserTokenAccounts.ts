import useSWR from 'swr'

import { getAllTokensData } from '@sb/compositions/Rebalance/utils'

import { useConnection } from '../../connection'
import { RefreshFunction, TokenInfo } from '../../types'
import { useWallet } from '../../wallet'

const EMPTY_DATA: TokenInfo[] = []
export const useUserTokenAccounts = (): [TokenInfo[], RefreshFunction] => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return []
    }
    const data = await getAllTokensData(wallet.publicKey, connection)

    return data
  }

  const swr = useSWR(`usertokens-${wallet.publicKey?.toBase58()}`, fetcher, {
    refreshInterval: 60_000,
  })

  return [swr.data || EMPTY_DATA, swr.mutate]
}

import { getAllTokensData } from '@sb/compositions/Rebalance/utils'
import useSWR from 'swr'
import { useConnection } from '../../connection'
import { RefreshFunction, TokenInfo } from '../../types'
import { useWallet } from '../../wallet'

export const useUserTokenAccounts = (): [TokenInfo[], RefreshFunction] => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (!wallet.publicKey) {
      return []
    }
    return getAllTokensData(wallet.publicKey, connection)
  }

  const swr = useSWR(`usertokens-${wallet.publicKey?.toBase58()}`, fetcher, {
    refreshInterval: 60_000,
  })

  return [swr.data || [], swr.mutate]
}

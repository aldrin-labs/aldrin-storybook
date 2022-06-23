import useSWR from 'swr'

import { getAllTokensData } from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

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
    const data = await getAllTokensData(wallet.publicKey, connection)

    return data
  }

  const swr = useSWR(`usertokens-${wallet.publicKey?.toBase58()}`, fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })

  return [swr.data || [], swr.mutate]
}

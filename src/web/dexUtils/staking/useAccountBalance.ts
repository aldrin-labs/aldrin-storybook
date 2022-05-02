import { PublicKey } from '@solana/web3.js'
import useSWR from 'swr'

import { useConnection } from '../connection'
import { AsyncRefreshVoidFunction } from '../types'

export const useAccountBalance = ({
  publicKey,
}: {
  publicKey?: PublicKey
}): [number, AsyncRefreshVoidFunction<number | undefined>] => {
  const connection = useConnection()

  const fetcher = async () => {
    if (!publicKey) {
      return 0
    }
    const balance = await connection.getTokenAccountBalance(publicKey)

    return balance?.value?.uiAmount || 0
  }

  const swr = useSWR(`account-balance-${publicKey?.toBase58()}`, fetcher)

  return [swr.data || 0, swr.mutate]
}

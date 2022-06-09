import { PublicKey } from '@solana/web3.js'
import useSWR from 'swr'

import { getAllTokensData } from '@sb/compositions/Rebalance/utils'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useConnection } from '../../connection'
import { RefreshFunction, TokenInfo } from '../../types'

export const useOwnerTokenAccounts = (
  owner: PublicKey
): [TokenInfo[], RefreshFunction] => {
  const connection = useConnection()

  const fetcher = async () => {
    try {
      return await getAllTokensData(owner, connection)
    } catch (e) {
      console.log('error loading tokens data in useOwnerTokenAccounts', e)
      return []
    }
  }

  const swr = useSWR(`owner-tokens-${owner.toString()}`, fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })

  return [swr.data || [], swr.mutate]
}

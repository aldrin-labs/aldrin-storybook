import useSWR from 'swr'

import { fetchSrinStakingPools } from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { walletAdapterToWallet } from '../../common'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useSrinStakingPools = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async () => {
    if (!wallet.publicKey) {
      return []
    }
    const w = walletAdapterToWallet(wallet)
    return fetchSrinStakingPools(w, connection)
  }
  return useSWR(`srin-staking-pools`, fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })
}

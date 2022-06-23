import useSWR from 'swr'

import { fetchSrinStakingPools } from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useSrinStakingPools = () => {
  const { wallet } = useWallet()
  const connection = useConnection()
  const fetcher = async () => {
    return fetchSrinStakingPools(wallet, connection)
  }
  return useSWR(`srin-staking-pools`, fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })
}

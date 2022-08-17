import useSWR from 'swr'

import { loadFarmAccountsData } from '@core/solana'

import { toMap } from '../../../utils'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useFarmInfo = (stakingDataMap: any) => {
  // TODO: type
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (stakingDataMap) {
      return stakingDataMap
    }
    const farms = await loadFarmAccountsData({
      connection,
      wallet,
    })
    return toMap(farms, (farm) => farm.stakeMint.toString())
  }

  return useSWR(`farm-info-${wallet.publicKey?.toString()}`, fetcher) // .data}
}

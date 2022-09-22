import useSWR from 'swr'

import { Farm, loadFarmAccountsData } from '@core/solana'

import { toMap } from '../../../utils'
import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const useFarmInfo = (stakingDataMap: Map<string, Farm>) => {
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = async () => {
    if (stakingDataMap.size !== 0) {
      return stakingDataMap
    }

    const farms = await loadFarmAccountsData({
      connection,
      wallet,
    })

    return toMap(farms, (farm: Farm) => farm.stakeMint.toString())
  }

  return useSWR(`farm-info-${wallet.publicKey?.toString()}`, fetcher) // .data}
}

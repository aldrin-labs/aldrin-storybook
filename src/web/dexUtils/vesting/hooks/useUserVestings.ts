import useSWR from 'swr'

import { VestingWithPk } from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useMultiEndpointConnection } from '../../connection'
import { RefreshFunction } from '../../types'
import { useWallet } from '../../wallet'
import { vestingAddress, VESTING_LAYOUT } from './utils'

export const useUserVestings = (): [
  VestingWithPk[] | undefined,
  RefreshFunction
] => {
  const connection = useMultiEndpointConnection()
  const { wallet } = useWallet()

  // Since program has only type of accounts, we don't need some filters
  const fetcher = async (): Promise<VestingWithPk[]> => {
    if (!wallet.publicKey) {
      return []
    }

    // console.debug('wallet.publicKey: ', wallet.publicKey.toString())

    const rawData = await connection
      .getConnection()
      .getProgramAccounts(vestingAddress, {
        filters: [
          {
            memcmp: {
              offset: 8,
              bytes: wallet.publicKey.toString(),
            },
          },
        ],
      })

    const decodedData = rawData.map((d) => {
      const decoded = VESTING_LAYOUT.decode(d.account.data)

      return {
        ...decoded,
        vesting: d.pubkey,
      }
    })
    const filtredData = decodedData.filter(
      (vesting) => vesting.createdTs > 0 && vesting.outstanding.gtn(0)
    )

    // console.debug('rawData: ', rawData)
    // console.debug('decodedData: ', decodedData)
    // console.debug('filtredData: ', filtredData)
    // console.debug('json:', JSON.stringify(decodedData[0]))

    return filtredData
  }
  const { data, mutate } = useSWR(
    `user-vestings-${wallet.publicKey}`,
    fetcher,
    {
      refreshInterval: COMMON_REFRESH_INTERVAL,
    }
  )
  return [data, mutate]
}

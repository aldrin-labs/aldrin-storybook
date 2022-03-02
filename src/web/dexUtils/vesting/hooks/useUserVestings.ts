import useSWR from 'swr'

import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useMultiEndpointConnection } from '../../connection'
import { RefreshFunction } from '../../types'
import { useWallet } from '../../wallet'
import { VestingWithPk } from '../types'
import { vestingAddress, VESTING_LAYOUT } from './utils'

export const useUserVestings = (): [VestingWithPk[], RefreshFunction] => {
  const connection = useMultiEndpointConnection()
  const { wallet } = useWallet()

  // Since program has only type of accounts, we don't need some filters
  const fetcher = async (): Promise<VestingWithPk[]> => {
    if (!wallet.publicKey) {
      return []
    }
    const data = await connection
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

    return data
      .map((d) => {
        const decoded = VESTING_LAYOUT.decode(d.account.data)

        return {
          ...decoded,
          vesting: d.pubkey,
        }
      })
      .filter((vesting) => vesting.createdTs > 0 && vesting.outstanding.gtn(0))
  }
  const { data, mutate } = useSWR(
    `user-vestings-${wallet.publicKey}`,
    fetcher,
    {
      refreshInterval: COMMON_REFRESH_INTERVAL,
    }
  )
  return [data || [], mutate]
}

import useSWR from 'swr'

import { VestingWithPk } from '@core/solana'
import { COMMON_REFRESH_INTERVAL } from '@core/utils/config'

import { useMultiEndpointConnection } from '../../connection'
import { RefreshFunction } from '../../types'
import { vestingAddress, VESTING_LAYOUT } from './utils'

export const useVestings = (): [VestingWithPk[], RefreshFunction] => {
  const connection = useMultiEndpointConnection()

  // Since program has only type of accounts, we don't need some filters
  const fetcher = async (): Promise<VestingWithPk[]> => {
    const data = await connection
      .getConnection()
      .getProgramAccounts(vestingAddress)

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
  const { data, mutate } = useSWR('vestings', fetcher, {
    refreshInterval: COMMON_REFRESH_INTERVAL,
  })
  return [data || [], mutate]
}

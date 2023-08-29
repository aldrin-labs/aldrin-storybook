import { PublicKey } from '@solana/web3.js'
import { useCallback } from 'react'
import useSwr from 'swr'

import { getPools } from '@sb/compositions/Pools/utils/getPools'
import { getPoolsInfo } from '@sb/compositions/Pools/utils/getPoolsInfo'
import { PoolsInfoType } from '@sb/compositions/Pools/utils/types'
import { RefreshFunction } from '@sb/dexUtils/types'

import { POOLS_PROGRAM_ADDRESS, POOLS_V2_PROGRAM_ADDRESS } from '@core/solana'

import { useConnection } from '../../connection'

export const usePoolsInfo = (): [PoolsInfoType[], RefreshFunction] => {
  const connection = useConnection()

  const fetcher = useCallback(async () => {
    const [pools, v2pools] = await Promise.all([
      getPools(new PublicKey(POOLS_PROGRAM_ADDRESS), connection),
      getPools(new PublicKey(POOLS_V2_PROGRAM_ADDRESS), connection),
    ])
    const allPoolsRaw = [...pools, ...v2pools]
    const poolsInfo = await getPoolsInfo(allPoolsRaw, connection)

    return poolsInfo
  }, [])

  const pools = useSwr('use-pools-info-query', fetcher, {
    refreshInterval: 60_000,
  })

  return [pools.data || [], pools.mutate]
}

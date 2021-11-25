import { Pool, PoolV2 } from '@sb/dexUtils/common/types'
import { AsyncRefreshFunction } from '@sb/dexUtils/types'
import { useCallback, useEffect, useState } from 'react'
import { useConnection } from '../../connection'
import { ProgramsMultiton } from '../../ProgramsMultiton/ProgramsMultiton'
import { POOLS_PROGRAM_ADDRESS, POOLS_V2_PROGRAM_ADDRESS } from '../../ProgramsMultiton/utils'
import { useWallet } from '../../wallet'

export const usePools = (): [(Pool | PoolV2)[], AsyncRefreshFunction] => {

  const { wallet } = useWallet()
  const connection = useConnection()
  const [allPools, setAllPools] = useState<(Pool | PoolV2)[]>(
    []
  )

  const loadPools = useCallback(async () => {
    const program = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: POOLS_PROGRAM_ADDRESS,
    })

    const programv2 = ProgramsMultiton.getProgramByAddress({
      wallet,
      connection,
      programAddress: POOLS_V2_PROGRAM_ADDRESS,
    })

    const [
      pools,
      v2pools
    ] = await Promise.all([
      program.account.pool.all(),
      programv2.account.pool.all()
    ])

    const allPools: (Pool | PoolV2)[] = [
      ...pools.map((p) => p.account as Pool),
      ...v2pools.map((p) => p.account as PoolV2),
    ]

    setAllPools(allPools)

    return true
  }, [])

  useEffect(() => {
    loadPools()
  }, [])

  return [allPools, loadPools]
}

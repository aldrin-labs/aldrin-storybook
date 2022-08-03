import { useCallback } from 'react'
import useSwr from 'swr'

import { Pool, PoolV2 } from '@sb/dexUtils/common/types'
import { RefreshFunction } from '@sb/dexUtils/types'

import {
  ProgramsMultiton,
  POOLS_PROGRAM_ADDRESS,
  POOLS_V2_PROGRAM_ADDRESS,
} from '@core/solana'

import { useConnection } from '../../connection'
import { useWallet } from '../../wallet'

export const usePools = (): [(Pool | PoolV2)[], RefreshFunction] => {
  // TODO: rewrite layout parsing without wallet usage,
  // move connection out of context
  const { wallet } = useWallet()
  const connection = useConnection()

  const fetcher = useCallback(async () => {
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

    const [pools, v2pools] = await Promise.all([
      program.account.pool.all(),
      programv2.account.pool.all(),
    ])

    const allPoolsList: (Pool | PoolV2)[] = [
      ...pools.map((p) => {
        const pool = { ...p.account, publicKey: p.publicKey } as Pool
        return pool
      }),
      ...v2pools.map((p) => {
        const pool = { ...p.account, publicKey: p.publicKey } as PoolV2
        return pool
      }),
    ]

    return allPoolsList
  }, [])

  const pools = useSwr('ammpools', fetcher)

  return [pools.data || [], pools.mutate]
}

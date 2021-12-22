import { PublicKey } from '@solana/web3.js'
import useSwr from 'swr'
import { RefreshFunction } from '@sb/dexUtils/types'
import { useConnection } from '../../connection'

interface PoolTokens {
  poolTokenAccountA?: string
  poolTokenAccountB?: string
}

export interface PoolBalances {
  baseTokenAmount: number
  quoteTokenAmount: number
}

const EMPTY_POOL: PoolBalances = {
  baseTokenAmount: 0,
  quoteTokenAmount: 0,
}

export const usePoolBalances = (
  pool: PoolTokens
): [PoolBalances, RefreshFunction] => {
  const connection = useConnection()
  const fetcher = async () => {
    if (!pool.poolTokenAccountA || !pool.poolTokenAccountB) {
      return EMPTY_POOL
    }

    const [baseTokenBalanceInPool, quoteTokenBalanceInPool] = await Promise.all(
      [
        connection.getTokenAccountBalance(
          new PublicKey(pool.poolTokenAccountA)
        ),
        connection.getTokenAccountBalance(
          new PublicKey(pool.poolTokenAccountB)
        ),
      ]
    )

    const baseTokenAmount = baseTokenBalanceInPool?.value?.uiAmount || 0
    const quoteTokenAmount = quoteTokenBalanceInPool?.value?.uiAmount || 0

    return {
      baseTokenAmount,
      quoteTokenAmount,
    }
  }

  const { data, mutate } = useSwr(
    `pool-balance-${pool.poolTokenAccountA || ''}-${
      pool.poolTokenAccountB || ''
    }`,
    fetcher
  )

  return [data || EMPTY_POOL, mutate]
}

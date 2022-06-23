import { PublicKey } from '@solana/web3.js'
import BN from 'bn.js'
import useSwr from 'swr'

import { useConnection } from '@sb/dexUtils/connection'
import { RefreshFunction } from '@sb/dexUtils/types'

interface PoolTokens {
  poolTokenAccountA?: string
  poolTokenAccountB?: string
}

export interface PoolBalances {
  baseTokenAmount: number
  baseTokenAmountBN: BN
  quoteTokenAmount: number
  quoteTokenAmountBN: BN
}

const EMPTY_POOL: PoolBalances = {
  baseTokenAmount: 0,
  quoteTokenAmount: 0,
  baseTokenAmountBN: new BN(0),
  quoteTokenAmountBN: new BN(0),
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
      baseTokenAmountBN: new BN(baseTokenBalanceInPool?.value?.amount),
      quoteTokenAmountBN: new BN(quoteTokenBalanceInPool?.value.amount),
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

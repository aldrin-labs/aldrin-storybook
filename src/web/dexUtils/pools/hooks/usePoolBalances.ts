import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { RefreshFunction } from '@sb/dexUtils/types'

interface PoolTokens {
  poolTokenAccountA?: string
  poolTokenAccountB?: string
}

interface PoolBalances {
  baseTokenAmount: number
  quoteTokenAmount: number
}

export const usePoolBalances = ({
  pool,
  connection,
}: {
  pool: PoolTokens
  connection: Connection
}): [PoolBalances, RefreshFunction] => {
  const [poolBalances, setPoolBalances] = useState<PoolBalances>({
    baseTokenAmount: 0,
    quoteTokenAmount: 0,
  })
  const [refreshCounter, setRefreshCounter] = useState(0)

  const refresh: RefreshFunction = () => setRefreshCounter(refreshCounter + 1)

  useEffect(() => {
    const loadPoolBalances = async () => {
      if (!pool.poolTokenAccountA || !pool.poolTokenAccountB) return

      const [baseTokenBalanceInPool, quoteTokenBalanceInPool] =
        await Promise.all([
          connection.getTokenAccountBalance(
            new PublicKey(pool.poolTokenAccountA)
          ),
          connection.getTokenAccountBalance(
            new PublicKey(pool.poolTokenAccountB)
          ),
        ])

      const baseTokenAmount = baseTokenBalanceInPool?.value?.uiAmount || 0
      const quoteTokenAmount = quoteTokenBalanceInPool?.value?.uiAmount || 0

      setPoolBalances({
        baseTokenAmount,
        quoteTokenAmount,
      })
    }

    if (pool.poolTokenAccountA && pool.poolTokenAccountB) {
      loadPoolBalances()
    }
  }, [pool.poolTokenAccountA, pool.poolTokenAccountB, refreshCounter])

  return [poolBalances, refresh]
}

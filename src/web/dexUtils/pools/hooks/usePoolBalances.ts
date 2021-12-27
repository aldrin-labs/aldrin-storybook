import { useEffect, useState } from 'react'
import { Connection, PublicKey } from '@solana/web3.js'
import { RefreshFunction } from '@sb/dexUtils/types'
import BN from 'bn.js'

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

export const usePoolBalances = ({
  pool,
  connection,
}: {
  pool: PoolTokens
  connection: Connection
}): [PoolBalances, RefreshFunction] => {
  const [poolBalances, setPoolBalances] = useState<PoolBalances>({
    baseTokenAmount: 0,
    baseTokenAmountBN: new BN(0),
    quoteTokenAmount: 0,
    quoteTokenAmountBN: new BN(0),
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
        baseTokenAmountBN: new BN(baseTokenBalanceInPool?.value?.amount),
        quoteTokenAmount,
        quoteTokenAmountBN: new BN(quoteTokenBalanceInPool?.value.amount),
      })
    }

    if (pool.poolTokenAccountA && pool.poolTokenAccountB) {
      loadPoolBalances()
    }
  }, [pool.poolTokenAccountA, pool.poolTokenAccountB, refreshCounter])

  return [poolBalances, refresh]
}

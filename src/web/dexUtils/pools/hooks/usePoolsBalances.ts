import BN from 'bn.js'
import useSwr from 'swr'

import { PoolInfo } from '@sb/compositions/Pools/index.types'
import { useConnection } from '@sb/dexUtils/connection'

import { splitArray } from '@core/utils/helpers'

import { PoolBalances } from '.'

type PoolsBalancesMap = Map<string, PoolBalances>

export const usePoolsBalances = ({
  pools,
}: {
  pools: PoolInfo[]
}): [PoolsBalancesMap, () => void] => {
  const connection = useConnection()

  const fetcher = async (): Promise<PoolsBalancesMap> => {
    if (!pools || pools.length === 0) {
      return new Map()
    }

    const tokenAccounts = pools
      .map((pool) => [pool.poolTokenAccountA, pool.poolTokenAccountB])
      .flat()

    const tokenAccountsDataResult = await connection._rpcRequest(
      'getMultipleAccounts',
      [tokenAccounts, { encoding: 'jsonParsed' }]
    )

    const tokenAccountsData = tokenAccountsDataResult.result.value.map(
      (tokenAccountData) => tokenAccountData.data.parsed.info
    )

    // create chunks by 2
    const splittedTokenAccountsData = splitArray(tokenAccountsData, 2)

    // set pool balances
    const poolsBalancesMap = pools.reduce((acc, pool, index) => {
      const [baseTokenBalanceInPool, quoteTokenBalanceInPool] =
        splittedTokenAccountsData[index]

      const baseTokenAmount = baseTokenBalanceInPool?.tokenAmount?.uiAmount || 0
      const quoteTokenAmount =
        quoteTokenBalanceInPool?.tokenAmount?.uiAmount || 0

      const poolBalances = {
        baseTokenAmount,
        quoteTokenAmount,
        baseTokenAmountBN: new BN(baseTokenBalanceInPool?.tokenAmount?.amount),
        quoteTokenAmountBN: new BN(quoteTokenBalanceInPool?.tokenAmount.amount),
      }

      return acc.set(pool.swapToken, poolBalances)
    }, new Map())

    return poolsBalancesMap
  }

  const key = `pools-balances${pools
    .map((pool) => `-${pool.swapToken}`)
    .join('')}`

  const { data, mutate } = useSwr(key, fetcher)

  return [data || new Map(), mutate]
}

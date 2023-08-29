import { PoolsBasicInfoType, RawPool } from './types'

export const getPoolsBaseQuoteAccountsAddresses = (
  pools: (RawPool | PoolsBasicInfoType)[]
): string[] => {
  const poolBaseQuoteTokenAccounts: string[] = pools.reduce(
    (acc: string[], pool) => {
      acc.push(pool.tokenAccountA.toString())
      acc.push(pool.tokenAccountB.toString())
      acc.push(pool.lpTokenFreezeVault.toString())
      acc.push(pool.poolToken.toString())

      return acc
    },
    []
  )

  return poolBaseQuoteTokenAccounts
}

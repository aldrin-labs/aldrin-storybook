import { PoolInfo } from '@sb/compositions/Pools/index.types'

export const getPoolsMintsEdges = (pools: PoolInfo[]): [string, string][] =>
  pools.map((pool) => [pool.tokenA, pool.tokenB])

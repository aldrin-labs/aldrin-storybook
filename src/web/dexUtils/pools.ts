import { PoolInfo } from '@sb/compositions/Pools/index.types'

/**
 * Get max amount in tokenA and tokenB to withdrawal from pool
 * @param selectedPool The pool which poolTokenAmount user has
 * @param poolTokenAmount The amount of  user's pool tokens
 */
export const calculateWithdrawAmount = ({
  selectedPool,
  poolTokenAmount,
}: {
  selectedPool: PoolInfo
  poolTokenAmount: number
}): [number, number] => {
  const {
    supply,
    tvl: { tokenA: poolTokenAmountA, tokenB: poolTokenAmountB },
  } = selectedPool

  if (supply === 0) return [0, 0]

  const withdrawAmountTokenA = (poolTokenAmountA * poolTokenAmount) / supply
  const withdrawAmountTokenB = (poolTokenAmountB * poolTokenAmount) / supply

  return [withdrawAmountTokenA, withdrawAmountTokenB]
}

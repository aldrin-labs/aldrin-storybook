import { Pool } from './amm/types'

/**
 * Get max amount in tokenA and tokenB to withdrawal from pool
 * @param selectedPool The pool which poolTokenAmount user has
 * @param poolTokenAmount The amount of  user's pool tokens
 */
export const calculateWithdrawAmount = ({
  selectedPool,
  poolTokenAmount,
  supply,
}: {
  selectedPool: Pool
  poolTokenAmount: number
  supply: number
}) => {
  const poolTokenAmountA =
    selectedPool.account.reserves[0].tokens.amount.toNumber()
  const poolTokenAmountB =
    selectedPool.account.reserves[1].tokens.amount.toNumber()

  if (supply === 0) return [0, 0]

  const withdrawAmountTokenA = (poolTokenAmountA * poolTokenAmount) / supply
  const withdrawAmountTokenB = (poolTokenAmountB * poolTokenAmount) / supply

  return [withdrawAmountTokenA, withdrawAmountTokenB]
}

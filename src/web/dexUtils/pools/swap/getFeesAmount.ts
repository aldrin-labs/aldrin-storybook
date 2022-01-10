import { PoolInfo } from '@sb/compositions/Pools/index.types'

const getFeesAmount = ({
  amount,
  pool,
}: {
  amount: number
  pool: PoolInfo
}) => {
  const {
    tradeFeeNumerator,
    tradeFeeDenominator,
    ownerTradeFeeNumerator,
    ownerTradeFeeDenominator,
  } = pool.fees

  const fee =
    (amount * tradeFeeNumerator) / tradeFeeDenominator +
    (amount * ownerTradeFeeNumerator) / ownerTradeFeeDenominator

  return fee
}

export { getFeesAmount }

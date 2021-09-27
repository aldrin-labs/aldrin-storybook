import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { PoolInfo } from '../index.types'

export const getUserPoolsFromAll = ({
  poolsInfo,
  allTokensData,
}: {
  allTokensData: TokenInfo[]
  poolsInfo: PoolInfo[]
}) => {
  return poolsInfo.filter((el) =>
    allTokensData.find((tokenData) => tokenData.mint === el.poolTokenMint)
  )
}

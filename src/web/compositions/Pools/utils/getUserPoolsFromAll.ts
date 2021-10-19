import { TokenInfo } from '@sb/compositions/Rebalance/Rebalance.types'
import { PoolInfo } from '../index.types'

export const getUserPoolsFromAll = ({
  poolsInfo,
  allTokensDataMap,
}: {
  allTokensDataMap: Map<string, TokenInfo>
  poolsInfo: PoolInfo[]
}) => {
  return poolsInfo.filter(
    (el) =>
      allTokensDataMap.has(el.poolTokenMint) &&
      allTokensDataMap.get(el.poolTokenMint)?.amount > 0
  )
}

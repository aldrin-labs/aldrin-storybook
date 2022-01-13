import { Token } from '@sb/components/TokenSelector/SelectTokenModal'

import { PoolInfo } from '../Pools/index.types'

export interface SwapPageBaseProps {
  // TODO: resolve types structure
  poolsInfoRefetch: () => Promise<{ getPoolsInfo: PoolInfo[] }>
  poolsInfo: { getPoolsInfo: PoolInfo[] }
}
export interface SwapPageProps extends SwapPageBaseProps {
  tokens: Token[]
}

import { RefreshFunction } from '@sb/dexUtils/types'

import { DexTokensPrices } from '../Pools/index.types'

export interface StakingBlockProps {
  mSolInfo: any
  refreshStakingInfo: RefreshFunction
  setIsConnectWalletPopupOpen: (a: boolean) => void
  dexTokensPricesMap: Map<string, DexTokensPrices>
  open: boolean
  onClose: () => void
  socials: any // TODO
}

export interface StakingPageProps {
  getStakingInfoQuery: { getStakingInfo?: any }
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}

import { MarinadeState } from '@marinade.finance/marinade-ts-sdk'

import { RefreshFunction } from '@sb/dexUtils/types'

import { DexTokensPrices } from '../Pools/index.types'

export interface StakingBlockProps {
  mSolInfo: MarinadeState
  refreshStakingInfo: RefreshFunction
  setIsConnectWalletPopupOpen: (a: boolean) => void
  dexTokensPricesMap: Map<string, DexTokensPrices>
  open: boolean
  onClose: () => void
  socials: string[]
}

export interface StakingInfo {
  supply: number
  rinAPY: number
  rinAPR: number
  rinCurrentAPY: number
  rinCurrentAPR: number
  currentPeriodStartsAt: number
  currentPeriodEndsAt: number
  farmers: {
    pubkey: string
    reward: number
  }[]
  farming: {
    admin: string
    stakeMint: string
    stakeVault: string
    harvests: {
      mint: string
      vault: string
      harvestVaultTokenAmount: string
      harvestVaultDecimals: number
      apr: number
      apy: number
      periods: {
        tps: {
          amount: string
        }
        startsAt: {
          slot: string
        }
      }[]
    }[]
    snapshots: {
      ringBufferTip: string
      ringBuffer: {
        staked: string
        startedAt: string
      }
    }
    stakeVaultTokenAmount: string
    stakeVaultDecimals: number
    publicKey: string
  }[]
}

export interface WithStakingInfo {
  getStakingInfoQuery: {
    getStakingInfo?: StakingInfo
  }
}

export interface StakingPageProps extends WithStakingInfo {
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}

export type StakingRowType = {
  token: string
  labels: string[]
  totalStaked: number
  additionalInfo: string
  apy: string | number
  columnName: string
  socials: {
    twitter: string
    coinmarketcap: string
    discord: string
  }
}

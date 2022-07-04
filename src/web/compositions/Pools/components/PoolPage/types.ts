import { ApolloQueryResult } from 'apollo-client'
import React from 'react'

import { FarmingState, FarmingTicket } from '@sb/dexUtils/common/types'
import {
  TokenInfo,
  RefreshFunction,
  TokenInfo as TokenInfoType,
} from '@sb/dexUtils/types'

import { VestingWithPk, Vesting, Farm } from '@core/solana'

import {
  DexTokensPrices,
  FeesEarned,
  PoolInfo,
  TradingVolumeStats,
} from '../../index.types'

export interface ExtendFarmingModalProps {
  onClose: () => void
  onExtend: () => void
  pool: PoolInfo
  title?: string
}

export interface FarmingModalProps extends ExtendFarmingModalProps {
  title: string
}

export type TransactionStatus = 'processing' | 'success' | 'error'

export interface FarmingProcessingModalProps {
  onClose: () => void
  status: string
  open: boolean
  prolongFarming: () => void
  txId?: string
}

export interface PoolPageProps {
  pools?: PoolInfo[]
  prices: Map<string, DexTokensPrices>
  tradingVolumes: Map<string, TradingVolumeStats>
  fees: FeesEarned[]
  userTokensData: TokenInfoType[]
  earnedFees: Map<string, FeesEarned>
  refreshUserTokensData: RefreshFunction
  refreshAll: RefreshFunction
  vestingsForWallet: Map<string, VestingWithPk>
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
}

export type ModalType =
  | ''
  | 'deposit'
  | 'withdraw'
  | 'stake'
  | 'claim'
  | 'remindToStake'
  | 'unstake'

export interface PoolStatsProps {
  title: React.ReactNode
  value: number
  additionalInfo?: React.ReactNode
}

export interface ClaimTimeTooltipProps {
  farmingState?: FarmingState | null
}

export interface UserFarmingBlockProps {
  pool: PoolInfo
  farm?: Farm
  userTokensData: TokenInfo[]
  prices: Map<string, DexTokensPrices>
  onStakeClick: () => void
  onClaimClick: () => void
  onUnstakeClick: () => void
  refetchPools: () => Promise<ApolloQueryResult<{ getPoolsInfo: PoolInfo[] }>>
  processing: boolean
}

export interface PoolRewardRemain {
  timeRemain: number // Seconds
  tokensRemain: number
}

export interface UserLiquidityBlockProps {
  pool: PoolInfo
  userTokensData: TokenInfo[]
  earnedFees: Map<string, FeesEarned>
  basePrice: number
  quotePrice: number
  processing: boolean
  onDepositClick: () => void
  onWithdrawClick: () => void
  vesting?: Vesting
  tokenMap: Map<string, any>
}

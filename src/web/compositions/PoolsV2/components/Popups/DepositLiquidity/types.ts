import { Pool } from '@sb/dexUtils/amm/types'

export type DepositLiquidityType = {
  onClose: () => void
  open: boolean
  arrow?: boolean
  pool: Pool
  needBlur: boolean
  userTokenAccountA: string
  userTokenAccountB: string
  baseTokenDecimals: number
  quoteTokenDecimals: number
  maxBaseAmount: number
  maxQuoteAmount: number
}

export type CircleIconContainerType = {
  size?: string
}

export type PeriodButtonType = {
  isActive: boolean
}

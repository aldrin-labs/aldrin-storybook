import { DexTokensPrices } from '../../../Pools/index.types'

export interface MSolStakingBlockProps {
  open: boolean
  onClose: () => void
  getDexTokensPricesQuery: { getDexTokensPrices?: DexTokensPrices[] }
}

export type RowType = {
  width?: string
  padding?: string
  height?: string
  margin?: string
}

export type BoxType = {
  height?: string
  width?: string
  padding?: string
}

export type ColumnType = {
  height?: string
  width?: string
  margin?: string
}

export type CircleIconContainerType = {
  size?: string
}

export type PeriodButtonType = {
  isActive: boolean
}

export type ModalType = {
  needBlur?: boolean
}

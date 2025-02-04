import { InputCommon, OnChangeProps } from '../Input/types'

export interface AmountInputProps extends InputCommon, OnChangeProps {
  amount: number
  mint: string
  showButtons?: boolean
  usdValue?: number
  maxLength?: number
}

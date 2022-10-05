export type InputProps = {
  needPadding?: boolean
  background?: string
}

export type InputContainerProps = {
  width?: string
}

export type AmountInputProps = {
  amount?: string | number
  maxAmount?: number | string
  disabled?: boolean
  title?: string
  placeholder?: string
  onChange?: (value: number | string) => void
  onMaxAmountClick?: () => void
  appendComponent?: any
  needPadding?: boolean
}

export type CustomInputProps = {
  width?: string
  amount?: string | number
  maxAmount?: number | string
  disabled?: boolean
  title?: string
  placeholder?: string
  onChange?: (value: number | string) => void
  onMaxAmountClick?: () => void
  appendComponent?: any
  needPadding?: boolean
}

export type ValuesContainerType = {
  setBaseAmount: (a: number) => void
  setQuoteAmount: (a: number) => void
  quoteAmount: number | string
  baseAmount: number | string
  baseMint: string
  quoteMint: string
  baseMax: number
  quoteMax: number
}

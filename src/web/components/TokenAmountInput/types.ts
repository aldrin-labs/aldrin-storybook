export interface TokenAmountInputFieldProps {
  name: string
  available?: number
  setFieldValue?: (field: string, value: any) => void
  disabled?: boolean
  onChange?: (value: string) => void
}

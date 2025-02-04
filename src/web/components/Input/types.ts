import { BORDER_RADIUS } from '@variables/variables'
import { FieldValidator } from 'formik'
import { ReactChild, ReactNode } from 'react'

import { VARIANTS } from './styles'

export interface AppendProps {
  padding?: string
}

export interface PrependProps {
  padding?: string
}

export interface WrapProps {
  $borderRadius: keyof typeof BORDER_RADIUS
  $variant: keyof typeof VARIANTS
  $disabled?: boolean
  $withLabel?: boolean
}

// To share with other input-based components, for example AmountInput
export interface InputCommon {
  placeholder?: string
  name: string
  className?: string
  size?: number // Input size
  variant?: keyof typeof VARIANTS
  borderRadius?: keyof typeof BORDER_RADIUS
  disabled?: boolean
  label?: ReactNode
}

export interface InputBase extends InputCommon {
  formatter?: (e: string, prevValue: string) => string
  append?: ReactChild
  prepend?: ReactChild
}

export interface OnChangeProps {
  value?: string
  onChange: (e: string) => void
}

export interface OnFocusBlurProps {
  onBlur?: () => void
  onFocus?: () => void
}

export interface InputProps extends InputBase, OnChangeProps, OnFocusBlurProps {
  autoFocus?: boolean
  maxLength?: number
}

export interface InputFieldProps extends InputBase {
  validate?: FieldValidator
}

export type FieldProps = InputFieldProps & {
  onChange?: (v: string) => void
  value?: string
  showPlaceholderOnDisabled?: boolean
}

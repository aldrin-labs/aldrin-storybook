import { BORDER_RADIUS } from '@variables/variables'
import { FieldValidator } from 'formik'
import { ReactNode } from 'react'

import { VARIANTS } from './styles'

export interface AppendProps {
  padding?: string
}

export interface WrapProps {
  $borderRadius: keyof typeof BORDER_RADIUS
  $variant: keyof typeof VARIANTS
  $disabled?: boolean
}

export interface InputBase {
  formatter?: (e: string, prevValue: string) => string
  placeholder?: string
  append?: ReactNode
  size?: number // Input size
  name: string
  className?: string
  variant?: keyof typeof VARIANTS
  borderRadius?: keyof typeof BORDER_RADIUS
  disabled?: boolean
}

export interface InputProps extends InputBase {
  value?: string
  onChange: (e: string) => void
  maxButton?: boolean
  maxButtonOnClick?: () => void
  halfButton?: boolean
  halfButtonOnClick?: () => void
}

export interface InputFieldProps extends InputBase {
  validate?: FieldValidator
}

export type FieldProps = InputFieldProps & {
  onChange?: (v: string) => void
}

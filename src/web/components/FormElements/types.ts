import { COLORS } from '@variables/variables'
import React from 'react'

export interface CheckboxBase {
  label: React.ReactNode
  color?: keyof typeof COLORS
}

export interface BoolFieldProps {
  value: boolean
  onChange: (checked: boolean) => void
}

export interface CheckboxProps extends CheckboxBase, BoolFieldProps {}

export interface CheckboxFieldProps extends CheckboxBase {
  name: string
}

export interface SwitcherProps extends BoolFieldProps {}

export interface SwitcherContainerProps {
  $checked: boolean
}

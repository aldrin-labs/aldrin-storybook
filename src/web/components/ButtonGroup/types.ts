import React from 'react'

import { ButtonVariants } from '../Button'

export interface ButtonGroupButton<T = any> {
  children: React.ReactChild
  key: T
}

export interface ButtonGroupProps<T> {
  buttons: ButtonGroupButton<T>[]
  selected: T
  onSelect: (key: T) => void
  $variant?: ButtonVariants
  $variantSelected?: ButtonVariants
}

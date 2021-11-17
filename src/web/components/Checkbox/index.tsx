import React from 'react'
import { Text } from '../Typography'
import { CheckboxContainer, Label, CheckMark } from './styles'
import { COLORS } from '@variables/variables'

interface CheckboxProops {
  checked: boolean
  onChange: (checked: boolean) => void
  label: React.ReactNode
  color?: keyof typeof COLORS
}


export const Checkbox: React.FC<CheckboxProops> = (props) => {
  const { checked, onChange, label, color } = props
  return (
    <CheckboxContainer onClick={() => onChange(!checked)}>
      <CheckMark checked={checked} />
      <Label size="sm" color={color}>{label}</Label>
    </CheckboxContainer>
  )
}
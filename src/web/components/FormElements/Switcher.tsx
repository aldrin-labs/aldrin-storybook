import React from 'react'

import { SwitcherContainer, SwitcherButton } from './styles'
import { SwitcherProps } from './types'

export const Switcher: React.FC<SwitcherProps> = (props) => {
  const { value, onChange } = props
  return (
    <SwitcherContainer
      $checked={value}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!value)
      }}
    >
      <SwitcherButton />
    </SwitcherContainer>
  )
}

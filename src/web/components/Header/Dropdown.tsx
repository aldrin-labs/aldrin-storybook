import { BREAKPOINTS } from '@variables/variables'
import React from 'react'

import { NavLink, DropdownWrap, DropdownContent, DropdownInner } from './styles'

interface DropdownProps {
  text: React.ReactNode
  hide?: keyof typeof BREAKPOINTS
  isActive?: boolean
}

export const DropDown: React.FC<DropdownProps> = (props) => {
  const { text, children, hide, isActive } = props
  return (
    <DropdownWrap hide={hide}>
      <NavLink
        className={isActive ? 'selected-from-dropdown' : 'dropdown'}
        as="a"
      >
        {text}
      </NavLink>
      <DropdownContent>
        <DropdownInner>{children}</DropdownInner>
      </DropdownContent>
    </DropdownWrap>
  )
}

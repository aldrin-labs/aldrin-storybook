import React from 'react'
import { NavLink, DropdownWrap, DropdownContent, DropdownInner } from './styles'
import { BREAKPOINTS } from '@variables/variables'

interface DropdownProps {
  text: React.ReactNode
  hide?: keyof typeof BREAKPOINTS
}

export const DropDown: React.FC<DropdownProps> = (props) => {
  const { text, children, hide } = props
  return (
    <DropdownWrap hide={hide}>
      <NavLink>{text}</NavLink>
      <DropdownContent>
        <DropdownInner>
          {children}
        </DropdownInner>
      </DropdownContent>
    </DropdownWrap>
  )
}
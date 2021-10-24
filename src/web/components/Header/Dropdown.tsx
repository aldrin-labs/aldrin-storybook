import React from 'react'
import { NavLink, DropdownWrap, DropdownContent } from './styles'

interface DropdownProps {
  text: React.ReactNode
}

export const DropDown: React.FC<DropdownProps> = (props) => {
  const { text, children } = props
  return (
    <DropdownWrap>
      <NavLink>{text}</NavLink>
      <DropdownContent>{children}</DropdownContent>
    </DropdownWrap>
  )
}
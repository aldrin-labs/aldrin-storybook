import React from 'react'
import { useTheme } from 'styled-components'

import { SButton } from './NavLinkButton.styles'

const NavLinkButton = ({
  component,
  children,
  pathname,

  page = '',
  marketName,
  style,
  onClick,
}: {
  component: any
  children: React.ReactChild
  pathname: string

  page: string
  marketName: string
  style: any
  onClick: any
}) => {
  const isActivePage = page !== '' && pathname.match(page)
  const theme = useTheme()
  return (
    <SButton
      pathname={pathname}
      marketName={marketName}
      component={component}
      isActivePage={isActivePage}
      white={theme.colors.gray0}
      black={theme.colors.black}
      grey={theme.colors.grey.gray1}
      blue={theme.colors.blue5}
      borderColor={theme.colors.grey5}
      btnWidth="14rem"
      size="medium"
      color="default"
      variant="text"
      style={style}
      onClick={onClick}
    >
      {children}
    </SButton>
  )
}

export default NavLinkButton

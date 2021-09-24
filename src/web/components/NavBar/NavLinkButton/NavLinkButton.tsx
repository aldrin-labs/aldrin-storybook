import React from 'react'
import { withTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { SButton } from './NavLinkButton.styles'

const NavLinkButton = ({
  component,
  children,
  pathname,
  theme,
  theme: { palette },
  page = '',
  marketName,
  style,
  onClick,
}: {
  component: any
  children: React.ReactChild
  pathname: string
  theme: Theme
  page: string
  marketName: string
  style: any
  onClick: any
}) => {
  const isActivePage = page !== '' && pathname.match(page)

  return (
    <SButton
      theme={theme}
      pathname={pathname}
      marketName={marketName}
      component={component}
      isActivePage={isActivePage}
      type={palette.type}
      white={palette.common.white}
      black={palette.common.black}
      grey={palette.grey.text}
      blue={palette.blue.light}
      borderColor={palette.grey.border}
      btnWidth={'14rem'}
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

export default withTheme()(NavLinkButton)

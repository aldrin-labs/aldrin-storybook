import React from 'react'
import { withTheme } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { SButton } from './NavLinkButton.styles'

const NavLinkButton = ({
  component,
  children,
  pathname,
  theme: { palette },
  page,
  marketName,
  style,
}: {
  component: any
  children: React.ReactChild
  pathname: string
  theme: Theme
  page: string
  marketName: string
  style
}) => {
  const isActivePage = new RegExp(page, 'i').test(pathname)

  return (
    <SButton
      pathname={pathname}
      marketName={marketName}
      component={component}
      isActivePage={isActivePage}
      // disabled={(page === 'spot' || page === 'futures') && !isActivePage}
      type={palette.type}
      white={palette.common.white}
      black={palette.common.black}
      grey={palette.grey.text}
      blue={palette.blue.light}
      borderColor={palette.grey.border}
      size="medium"
      color="default"
      variant="text"
      style={style}
    >
      {children}
    </SButton>
  )
}

export default withTheme()(NavLinkButton)

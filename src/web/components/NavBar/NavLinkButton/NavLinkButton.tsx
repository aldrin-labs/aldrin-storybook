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
}: {
  component: any
  children: React.ReactChild
  pathname: string
  theme: Theme
  page: string
}) => {
  const isActivePage = new RegExp(page, 'i').test(pathname)

  return (
    <SButton
      component={component}
      isActivePage={isActivePage}
      type={palette.type}
      white={palette.common.white}
      black={palette.common.black}
      size="medium"
      color="default"
      variant="text"
    >
      {children}
    </SButton>
  )
}

export default withTheme(NavLinkButton)

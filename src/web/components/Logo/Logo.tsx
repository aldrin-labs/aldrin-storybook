import React from 'react'
import { StyledLogo } from './Logo.styles'
import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

import MainLogo from '@icons/MainLogo.png'
import MainLogoDark from '@icons/MainLogoDarkColor.png'
import { Link } from 'react-router-dom'

const Logo = ({
  theme: {
    palette: { type },
  },
}: {
  theme: Theme
}) => {
  return (
    <Link to="/">
      <StyledLogo src={!(type === 'dark') ? MainLogoDark : MainLogo} />
    </Link>
  )
}

export default withTheme()(Logo)

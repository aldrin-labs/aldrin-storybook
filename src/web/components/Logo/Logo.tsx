import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'
import React from 'react'
import { Link } from 'react-router-dom'

import MainLogoDark from '@icons/lightLogo.svg'
import MainLogo from '@icons/Logo.svg'

import { StyledLogo } from './Logo.styles'

const Logo = ({
  theme: {
    palette: { type },
  },
}: {
  theme: Theme
}) => {
  return (
    <Link to="/" style={{ width: '80%', height: '80%' }}>
      <StyledLogo src={type === 'dark' ? MainLogoDark : MainLogo} />
    </Link>
  )
}

export default withTheme()(Logo)

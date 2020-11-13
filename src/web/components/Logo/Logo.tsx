import React from 'react'
import { StyledLogo } from './Logo.styles'
import { Theme } from '@material-ui/core'
import { withTheme } from '@material-ui/styles'

// import MainLogo from '@icons/Logo.svg'
import Decefi from '@icons/decefi.svg'

// import MainLogoDark from '@icons/lightLogo.svg'
import { Link } from 'react-router-dom'

const Logo = ({
  theme: {
    palette: { type },
  },
}: {
  theme: Theme
}) => {
  return (
    <Link to="/" style={{ width: '100%', height: '100%' }}>
      {/* <StyledLogo src={type === 'dark' ? MainLogoDark : MainLogo} /> */}
      <StyledLogo src={Decefi} />
    </Link>
  )
}

export default withTheme()(Logo)

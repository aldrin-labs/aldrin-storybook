import React from 'react'
import { Link } from 'react-router-dom'

import MainLogoDark from '@icons/lightLogo.svg'
import MainLogo from '@icons/Logo.svg'

import { StyledLogo } from './Logo.styles'

const Logo = () => {
  return (
    <Link to="/" style={{ width: '80%', height: '80%' }}>
      <StyledLogo src={type === 'dark' ? MainLogoDark : MainLogo} />
    </Link>
  )
}

export default Logo

import React from 'react'

import { Row, NavbarText16GreenWithGradient } from './CardsPanel.styles'
import DecefiLogo from '@icons/decefiLogo.svg'
import SvgIcon from '@sb/components/SvgIcon'

const Logo = () => {
  return (
    <Row>
      <SvgIcon
        width="35px"
        height="35px"
        src={DecefiLogo}
      />
      <NavbarText16GreenWithGradient>(de+ce)/фi_</NavbarText16GreenWithGradient>
    </Row>
  )
}

export default Logo

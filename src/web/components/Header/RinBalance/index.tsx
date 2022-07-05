import React from 'react'

import RinLogo from '@icons/rin_logo.png'

import { RinBalanceContainer, RinBalanceLogo, RinBalanceLabel } from './styles'

export const RinBalance = () => {
  return (
    <RinBalanceContainer>
      <RinBalanceLogo src={RinLogo} />
      <RinBalanceLabel>1342.00</RinBalanceLabel>
    </RinBalanceContainer>
  )
}

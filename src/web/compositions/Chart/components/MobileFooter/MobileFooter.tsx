import React from 'react'

import {
  TradeLink,
  StakingLink,
  SwapsLink,
  PoolsLink,
} from './NavIconsComponents'
import { FooterComponent } from './styles'

export const MobileFooter = () => {
  return (
    <FooterComponent justify="space-around">
      <TradeLink />
      <SwapsLink />
      <PoolsLink />
      <StakingLink />

      {/* <MoreLink /> */}
    </FooterComponent>
  )
}

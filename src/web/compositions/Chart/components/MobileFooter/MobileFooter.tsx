import React, { useState } from 'react'

import { FeedbackPopup } from '../UsersFeedbackPopup'
import {
  TradeLink,
  DashboardLink,
  StakingLink,
  SwapsLink,
  PoolsLink,
} from './NavIconsComponents'
import { FooterComponent } from './styles'

export const MobileFooter = ({ pathname }) => {
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)

  return (
    <FooterComponent height="11em" justify="space-around">
      <TradeLink isActive={pathname.includes('chart')} />
      <DashboardLink isActive={pathname.includes('dashboard')} />
      <PoolsLink isActive={pathname.includes('pools')} />
      <SwapsLink isActive={pathname.includes('swap')} />
      <StakingLink isActive={pathname.includes('staking')} />

      <FeedbackPopup
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false)
        }}
      />
    </FooterComponent>
  )
}

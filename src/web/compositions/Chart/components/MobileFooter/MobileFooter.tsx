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

export const MobileFooter = () => {
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)

  return (
    <FooterComponent justify="space-around">
      <TradeLink />
      <DashboardLink />
      <SwapsLink />
      <PoolsLink />
      <StakingLink />

      <FeedbackPopup
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false)
        }}
      />
    </FooterComponent>
  )
}

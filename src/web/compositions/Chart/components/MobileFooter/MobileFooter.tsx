import React, { useState } from 'react'
import { FeedbackPopup } from '../UsersFeedbackPopup'
import {
  FeedbackBtn,
  TradeLink,
  WalletLink,
  DashboardLink,
  StakingLink,
  SwapsLink,
} from './NavIconsComponents'
import { FooterComponent } from './styles'

export const MobileFooter = ({ pathname }) => {
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)

  return (
    <FooterComponent height="11em" justify="space-around">
      <TradeLink isActive={pathname.includes('chart')} />
      <DashboardLink isActive={pathname.includes('dashboard')} />
      {/* <AnalyticsLink isActive={pathname.includes('analytics')} />
      <PoolsLink isActive={pathname.includes('pools')} /> */}
      <SwapsLink isActive={pathname.includes('swap')} />
      {/* <RebalanceLink isActive={pathname.includes('rebalance')} /> */}
      <StakingLink isActive={pathname.includes('staking')} />
      <WalletLink isActive={pathname.includes('wallet')} />
      <FeedbackBtn
        onClick={() => {
          setIsFeedBackPopupOpen(true)
        }}
        isActive={isFeedBackPopupOpen}
      />
      <FeedbackPopup
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false)
        }}
      />
    </FooterComponent>
  )
}

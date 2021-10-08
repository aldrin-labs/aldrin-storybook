import React, { useState } from 'react'
import { FeedbackPopup } from '../UsersFeedbackPopup'
import {
  FeedbackBtn,
  TradeLink,
  WalletLink,
  DashboardLink,
} from './NavIconsComponents'
import { FooterComponent } from './styles'

export const MobileFooter = ({ pathname }) => {
  const [isFeedBackPopupOpen, setIsFeedBackPopupOpen] = useState(false)

  return (
    <FooterComponent height="11rem" justify="space-around">
      <TradeLink isActive={pathname.includes('chart')} />
      <DashboardLink isActive={pathname.includes('dashboard')} />
      {/* <AnalyticsLink isActive={pathname.includes('analytics')} />
      <PoolsLink isActive={pathname.includes('pools')} />
      <SwapsLink isActive={pathname.includes('swaps')} />
      <RebalanceLink isActive={pathname.includes('rebalance')} /> */}
      <WalletLink />
      <FeedbackBtn
        onClick={() => {
          setIsFeedBackPopupOpen(true)
          console.log('aa', isFeedBackPopupOpen)
        }}
        isActive={isFeedBackPopupOpen}
      />
      <FeedbackPopup
        theme={theme}
        open={isFeedBackPopupOpen}
        onClose={() => {
          setIsFeedBackPopupOpen(false)
        }}
      />
    </FooterComponent>
  )
}

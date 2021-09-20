import React from 'react'
import {
  AnalyticsLink,
  PoolsLink,
  RebalanceLink,
  SwapsLink,
  TradeLink,
  WalletLink,
  DashboardLink,
} from './NavIconsComponents'
import { FooterComponent } from './styles'

export const MobileFooter = ({ pathname }) => {
  return (
    <FooterComponent height={'11rem'} justify={'space-around'}>
      <TradeLink isActive={pathname.includes('chart')} />
      <DashboardLink isActive={pathname.includes('dashboard')} />
      {/* <AnalyticsLink isActive={pathname.includes('analytics')} />
      <PoolsLink isActive={pathname.includes('pools')} />
      <SwapsLink isActive={pathname.includes('swaps')} />
      <RebalanceLink isActive={pathname.includes('rebalance')} /> */}
      <WalletLink />
    </FooterComponent>
  )
}

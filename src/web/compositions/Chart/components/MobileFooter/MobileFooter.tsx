import React from 'react'
import {
  AnalyticsLink,
  PoolsLink,
  RebalanceLink,
  SwapsLink,
  TradeLink,
  WalletLink,
} from './NavIconsComponents'
import { FooterComponent } from './styles'

export const MobileFooter = ({ pathname }) => {
  return (
    <FooterComponent height={'12rem'} justify={'space-between'}>
      <TradeLink isActive={pathname.includes('chart')} />
      <AnalyticsLink isActive={pathname.includes('analytics')} />
      <PoolsLink isActive={pathname.includes('pools')} />
      <SwapsLink isActive={pathname.includes('swaps')} />
      <RebalanceLink isActive={pathname.includes('rebalance')} />
      <WalletLink />
    </FooterComponent>
  )
}

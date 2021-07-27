import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'
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

export const MobileFooter = () => {
  return (
    <FooterComponent height={'12rem'} justify={'space-between'}>
      <TradeLink />
      <AnalyticsLink />
      <PoolsLink />
      <SwapsLink />
      <RebalanceLink />
      <WalletLink />
    </FooterComponent>
  )
}

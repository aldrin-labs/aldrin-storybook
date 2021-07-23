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

export const MobileFooter = () => {
  return (
    <RowContainer
      style={{
        backgroundColor: '#222429',
        borderTop: '0.1rem solid #383B45',
        padding: '0 2rem',
      }}
      height={'15rem'}
      justify={'space-between'}
    >
      <TradeLink />
      <AnalyticsLink />
      <PoolsLink />
      <SwapsLink />
      <RebalanceLink />
      <WalletLink />
    </RowContainer>
  )
}

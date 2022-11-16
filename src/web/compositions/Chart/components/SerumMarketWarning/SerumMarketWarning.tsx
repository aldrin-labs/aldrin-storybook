import React from 'react'

import { Container, Emoji, Text } from './styles'

const SerumMarketWarning = () => {
  return (
    <Container>
      <Emoji>⚠️</Emoji>
      <Text>
        This market is running on top of Project Serum DEX. Due to recent
        events, we decided to stop trading on the Serum markets. You can still
        cancel your orders and settle your funds using Aldrin.
      </Text>
    </Container>
  )
}

export { SerumMarketWarning }

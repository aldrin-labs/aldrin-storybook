import React from 'react'

import { Container, Emoji, Text } from './styles'

const DisabledTradingBanner = () => {
  return (
    <Container>
      <Emoji>⚠️</Emoji>
      <Text>Trading is disabled for this market.</Text>
    </Container>
  )
}

export { DisabledTradingBanner }

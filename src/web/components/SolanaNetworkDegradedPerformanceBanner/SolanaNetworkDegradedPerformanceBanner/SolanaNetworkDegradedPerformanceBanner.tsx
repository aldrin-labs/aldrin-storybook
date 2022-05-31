import React from 'react'

import { SvgIcon } from '@sb/components'
import { Text } from '@sb/components/Typography'

import { useSolanaTPS } from '@core/hooks/useSolanaTPS'

import BlackWarningIcon from '@icons/blackWarning.svg'

import { Link, Container, StyledRowContainer } from './styles'

const MAX_TPS_TO_SHOW_BANNER = 1500

export const SolanaNetworkDegradedPerformanceBanner = () => {
  const { data: TPS } = useSolanaTPS()

  if (typeof TPS !== 'number' || TPS > MAX_TPS_TO_SHOW_BANNER) {
    return null
  }

  return (
    <StyledRowContainer>
      <Container>
        <SvgIcon src={BlackWarningIcon} width="24px" height="24px" />
        <Text size="lg" color="black" margin="10px 0 10px 20px">
          Solana network is experiencing degraded performance. Transactions may
          fail to send or confirm. This info based on
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://explorer.solana.com/"
          >
            Solana TPS
          </Link>
          , you can also check the Solana status
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://status.solana.com/"
          >
            here
          </Link>
          .
        </Text>
      </Container>
    </StyledRowContainer>
  )
}

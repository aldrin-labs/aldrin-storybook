import React from 'react'
import styled from 'styled-components'

import { SvgIcon } from '@sb/components'
import { WideContent } from '@sb/components/Layout'
import { Text } from '@sb/components/Typography'
import { RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import { useSolanaTPS } from '@core/hooks/useSolanaTPS'

import BlackWarningIcon from '@icons/blackWarning.svg'

const MAX_TPS_TO_SHOW_BANNER = 1500

const Container = styled(WideContent)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const SolanaNetworkDegradedPerformanceBanner = () => {
  const { data: TPS } = useSolanaTPS()

  if (typeof TPS !== 'number' || TPS > MAX_TPS_TO_SHOW_BANNER) {
    return null
  }

  return (
    <RowContainer style={{ background: 'rgba(255, 219, 28)' }}>
      <Container>
        <SvgIcon src={BlackWarningIcon} width="24px" height="24px" />
        <Text size="lg" color="black" margin="10px 0 10px 20px">
          Solana network is experiencing degraded performance. Transactions may
          fail to send or confirm.
        </Text>
      </Container>
    </RowContainer>
  )
}

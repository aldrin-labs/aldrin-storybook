import React from 'react'

import { EscapeButton } from '@sb/components/EscapeButton'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { Column, Row } from '../../../index.styles'
import { StepChecker } from './StepChecker'

export const Header = ({ onClose }: { onClose: () => void }) => {
  return (
    <RootRow>
      <Row width="70%">
        <StepChecker />
        <Column width="85%" margin="0 0 0 1em">
          <InlineText size="xmd" weight={600}>
            Create Pool & Deposit Liquidity
          </InlineText>
          <InlineText color="blue1" size="esm">
            If your token name or logo are not displayed correctly you can
            submit it to the Aldrin Registry here.
          </InlineText>
        </Column>
      </Row>

      <EscapeButton onClose={onClose} />
    </RootRow>
  )
}

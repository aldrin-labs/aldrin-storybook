import React from 'react'

import { EscapeButton } from '@sb/components/EscapeButton'
import { InlineText } from '@sb/components/Typography'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'

import { Column, Row } from '../../../index.styles'
import { StepChecker } from './StepChecker'

export const Header = ({
  onClose,
  header,
  description,
  creationStep,
  arrow,
}: {
  onClose: () => void
  header: string
  description: string
  creationStep: string
  arrow: boolean
}) => {
  return (
    <RootRow margin="1.5em 0 1em 0">
      <Row width="70%">
        <StepChecker creationStep={creationStep} />
        <Column width="85%" margin="0 0 0 1em">
          <InlineText size="xmd" weight={600}>
            {header}
          </InlineText>
          <InlineText color="blue1" size="esm">
            {description}
          </InlineText>
        </Column>
      </Row>
      <EscapeButton arrow={arrow} onClose={onClose} />
    </RootRow>
  )
}

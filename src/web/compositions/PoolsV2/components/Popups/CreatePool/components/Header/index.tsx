import React from 'react'

import { EscapeButton } from '@sb/components/EscapeButton'
import { TokenIcon } from '@sb/components/TokenIcon'
import { InlineText } from '@sb/components/Typography'
import { IconsContainer } from '@sb/compositions/PoolsV2/components/TokenIconsContainer/index.styles'
import { RootRow } from '@sb/compositions/PoolsV2/index.styles'
import { getTokenMintAddressByName } from '@sb/dexUtils/markets'

import { Column, Row } from '../../../index.styles'
import { StepChecker } from './StepChecker'

export const Header = ({
  onClose,
  header,
  description,
  creationStep,
  arrow,
  needSteps,
}: {
  onClose: () => void
  header: string
  description: string
  creationStep: string
  arrow: boolean
  needSteps: boolean
}) => {
  return (
    <RootRow margin="1.5em 0 1em 0">
      {needSteps ? (
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
      ) : (
        <Row>
          <IconsContainer>
            <TokenIcon mint={getTokenMintAddressByName('RIN')} size={30} />
            <TokenIcon mint={getTokenMintAddressByName('USDC')} size={30} />
          </IconsContainer>
          <Column width="85%" margin="0 0 0 1em">
            <Row width="100%">
              <InlineText size="sm" weight={500} color="white2">
                {header}
              </InlineText>
            </Row>
            <InlineText size="md" weight={600} color="white1">
              {description}
            </InlineText>
          </Column>
        </Row>
      )}

      <EscapeButton arrow={arrow} onClose={onClose} />
    </RootRow>
  )
}

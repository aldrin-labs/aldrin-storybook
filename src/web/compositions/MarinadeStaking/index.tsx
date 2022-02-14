import { COLORS } from '@variables/variables'
import React, { useState } from 'react'

import { Button } from '@sb/components/Button'
import { FlexBlock, Page } from '@sb/components/Layout'
import { InlineText } from '@sb/components/Typography'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { StakingInput } from '../RinStaking/styles'
import { StretchedContent, ContentBlock, GrayButton } from '../Staking/styles'
import MarinadeBg from './bg.png'
import { Switcher } from './components/Switcher/Switcher'

export const MarinadeStaking = () => {
  const [isStakeModeOn, setIsStakeModeOn] = useState(true)
  return (
    <Page>
      <RowContainer margin="5rem 0" direction="column">
        <Row width="30%">
          <img src={MarinadeBg} width="100%" height="auto" alt="marinade" />
        </Row>
        <Row width="30%">
          <StretchedContent>
            <ContentBlock width="48%" style={{ background: COLORS.newBlack }}>
              <Row justify="flex-start" margin="0 0 2rem 0">
                <InlineText color="primaryGray" size="sm">
                  Epoch
                </InlineText>{' '}
              </Row>
              <InlineText size="lg" weight={700}>
                55.9%
              </InlineText>
            </ContentBlock>
            <ContentBlock style={{ background: '#121E10' }} width="48%">
              <Row justify="flex-start" margin="0 0 2rem 0">
                <InlineText color="primaryGray" size="sm">
                  APY
                </InlineText>{' '}
              </Row>
              <InlineText color="newGreen" size="lg" weight={700}>
                6.42%
              </InlineText>
            </ContentBlock>
          </StretchedContent>
        </Row>
        <Row width="30%">
          <ContentBlock style={{ margin: '0', background: COLORS.newBlack }}>
            <Switcher
              setIsStakeModeOn={setIsStakeModeOn}
              isStakeModeOn={isStakeModeOn}
            />
            <RowContainer margin="0 0 2rem 0" justify="space-between">
              <InlineText color="primaryGray" size="sm">
                Stake SOL and use mSOL while earning rewards
              </InlineText>
            </RowContainer>
            <RowContainer>
              <StakingInput
                placeholder="0"
                append={
                  <FlexBlock direction="row" alignItems="center">
                    &nbsp;
                    <Button
                      minWidth="2rem"
                      $fontSize="xs"
                      $borderRadius="xxl"
                      onClick={() => {}}
                      type="button"
                      $variant="primary"
                    >
                      MAX
                    </Button>
                    &nbsp;
                    <span>RIN</span>
                  </FlexBlock>
                }
              />
            </RowContainer>
            <RowContainer>
              <GrayButton style={{ background: COLORS.bluePrimary }}>
                Stake
              </GrayButton>
            </RowContainer>
            <RowContainer justify="space-between">
              <ContentBlock width="48%">
                <RowContainer justify="space-between">
                  {' '}
                  <InlineText color="primaryGray" size="sm">
                    Rate:{' '}
                  </InlineText>{' '}
                  <InlineText size="es">1 mSOL ⇄ 1.0313 SOL</InlineText>
                </RowContainer>
              </ContentBlock>
              <ContentBlock width="48%">
                <RowContainer justify="space-between">
                  {' '}
                  <InlineText color="primaryGray" size="sm">
                    Deposit fee:{' '}
                  </InlineText>{' '}
                  <InlineText size="es">0%</InlineText>
                </RowContainer>
              </ContentBlock>
            </RowContainer>
          </ContentBlock>
        </Row>
      </RowContainer>
    </Page>
  )
}

import { COLORS } from '@variables/variables'
import React, { useState } from 'react'

import { Page } from '@sb/components/Layout'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'

import { Row, RowContainer } from '../AnalyticsRoute/index.styles'
import { StakingInputWithAttributes } from '../Staking/StakingInput/StakingInput'
import { StretchedContent, ContentBlock, GrayButton } from '../Staking/styles'
import MarinadeBg from './bg.png'
import { BlockWithRadio } from './components/styles'
import { Switcher } from './components/Switcher/Switcher'

export const MarinadeStaking = () => {
  const [canUserUnstakeNow, setIfUserCanUnstakeNow] = useState(true)
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
              <StakingInputWithAttributes
                value="0"
                onChange={() => {}}
                placeholder="0"
                directionText={isStakeModeOn ? 'Stake' : 'Unstake'}
              />
            </RowContainer>
            <RowContainer margin="2rem 0">
              <StakingInputWithAttributes
                value="0"
                onChange={() => {}}
                placeholder="0"
                directionText="Receive"
              />
            </RowContainer>
            {!isStakeModeOn && (
              <RowContainer justify="space-between">
                <BlockWithRadio checked={canUserUnstakeNow}>
                  <RowContainer justify="space-between">
                    <InlineText weight={600} size="sm">
                      Unstake Now
                    </InlineText>
                    <Radio
                      change={() => {
                        setIfUserCanUnstakeNow(true)
                      }}
                      checked={canUserUnstakeNow}
                    />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <InlineText size="sm">Unstake Now</InlineText>
                  </RowContainer>
                </BlockWithRadio>
                <BlockWithRadio checked={!canUserUnstakeNow}>
                  <RowContainer justify="space-between">
                    <InlineText weight={600} size="sm">
                      Unstake in ≈2 days
                    </InlineText>
                    <Radio
                      change={() => {
                        setIfUserCanUnstakeNow(false)
                      }}
                      checked={!canUserUnstakeNow}
                    />
                  </RowContainer>
                  <RowContainer justify="space-between">
                    <InlineText weight={600} size="sm">
                      No fee
                    </InlineText>
                  </RowContainer>
                </BlockWithRadio>{' '}
              </RowContainer>
            )}

            <RowContainer>
              <GrayButton
                style={{
                  background: isStakeModeOn
                    ? COLORS.bluePrimary
                    : 'rgba(224, 66, 55, 0.25)',
                }}
              >
                {isStakeModeOn ? 'Stake' : 'Unstake'}
              </GrayButton>
            </RowContainer>
            <RowContainer justify="space-between">
              <ContentBlock width={isStakeModeOn ? '48%' : '100%'}>
                <RowContainer justify="space-between">
                  {' '}
                  <InlineText color="primaryGray" size="sm">
                    Rate:{' '}
                  </InlineText>{' '}
                  <InlineText size="es">1 mSOL ⇄ 1.0313 SOL</InlineText>
                </RowContainer>
              </ContentBlock>
              {isStakeModeOn && (
                <ContentBlock width="48%">
                  <RowContainer justify="space-between">
                    {' '}
                    <InlineText color="primaryGray" size="sm">
                      Deposit fee:{' '}
                    </InlineText>{' '}
                    <InlineText size="es">0%</InlineText>
                  </RowContainer>
                </ContentBlock>
              )}
            </RowContainer>
          </ContentBlock>
        </Row>
      </RowContainer>
    </Page>
  )
}

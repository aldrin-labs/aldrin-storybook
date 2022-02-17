import { COLORS, FONT_SIZES } from '@variables/variables'
import React from 'react'

import { SvgIcon } from '@sb/components'
import { Button } from '@sb/components/Button'
import { FlexBlock, Page, StretchedBlock } from '@sb/components/Layout'
import { Radio } from '@sb/components/RadioButton/RadioButton'
import { InlineText } from '@sb/components/Typography'

import { RowContainer } from '../AnalyticsRoute/index.styles'
import { BlockWithRadio } from '../MarinadeStaking/components/styles'
import { NumberWithLabel } from '../Staking/components/NumberWithLabel/NumberWithLabel'
import Lock from '../Staking/components/PlutoniansStaking/lock.svg'
import { StakingInputWithAttributes } from '../Staking/StakingInput/StakingInput'
import { ContentBlock, StakingBlock } from '../Staking/styles'
import Centuria from './assets/Centuria.png'
import Colossus from './assets/Colossus.png'
import Leviathan from './assets/Leviathan.png'
import Venator from './assets/Venator.png'

export const PlutoniansStaking = () => {
  return (
    <Page>
      <FlexBlock alignItems="center" direction="column">
        <StretchedBlock width="hf">
          <BlockWithRadio
            checked
            height="25rem"
            backgroundColor={COLORS.cardsBack}
            margin="0 1rem"
          >
            <FlexBlock direction="column">
              <StretchedBlock style={{ margin: '0 0 2rem 0' }} align="center">
                <InlineText size="md" weight={700}>
                  <SvgIcon src={Lock} alt="locked" /> 60 Days
                </InlineText>{' '}
                <Radio checked change={() => {}} />
              </StretchedBlock>{' '}
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
                label="12% APR + NFT"
              />
            </FlexBlock>
            <InlineText
              style={{ position: 'absolute', bottom: '3rem', width: '70%' }}
              size="sm"
              weight={600}
            >
              Aldrin Skin + 2 components
            </InlineText>
            <img src={Venator} alt="aldrin skin" width="100%" height="auto" />
          </BlockWithRadio>
          <BlockWithRadio
            checked={false}
            height="25rem"
            backgroundColor={COLORS.cardsBack}
            margin="0 1rem"
          >
            <FlexBlock direction="column">
              <StretchedBlock style={{ margin: '0 0 2rem 0' }} align="center">
                <InlineText size="md" weight={700}>
                  <SvgIcon src={Lock} alt="locked" /> 90 Days
                </InlineText>{' '}
                <Radio checked={false} change={() => {}} />
              </StretchedBlock>{' '}
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
                label="12% APR + NFT"
              />
            </FlexBlock>
            <InlineText
              style={{ position: 'absolute', bottom: '3rem', width: '70%' }}
              size="sm"
              weight={600}
            >
              Aldrin Skin + 4 components
            </InlineText>
            <img src={Centuria} alt="aldrin skin" width="100%" height="auto" />
          </BlockWithRadio>
          <BlockWithRadio
            checked={false}
            height="25rem"
            backgroundColor={COLORS.cardsBack}
            margin="0 1rem"
          >
            <FlexBlock direction="column">
              <StretchedBlock style={{ margin: '0 0 2rem 0' }} align="center">
                <InlineText size="md" weight={700}>
                  <SvgIcon src={Lock} alt="locked" /> 120 Days
                </InlineText>{' '}
                <Radio checked={false} change={() => {}} />
              </StretchedBlock>{' '}
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
                label="12% APR + NFT"
              />
            </FlexBlock>
            <InlineText
              style={{ position: 'absolute', bottom: '2rem', width: '70%' }}
              size="sm"
              weight={600}
            >
              Venator + Aldrin Skin + 4 components{' '}
            </InlineText>
            <img src={Colossus} alt="aldrin skin" width="100%" height="auto" />
          </BlockWithRadio>
          <BlockWithRadio
            checked={false}
            height="25rem"
            backgroundColor={COLORS.cardsBack}
            margin="0 1rem"
          >
            <FlexBlock direction="column">
              <StretchedBlock style={{ margin: '0 0 2rem 0' }} align="center">
                <InlineText size="md" weight={700}>
                  <SvgIcon src={Lock} alt="locked" /> 150 Days
                </InlineText>{' '}
                <Radio checked={false} change={() => {}} />
              </StretchedBlock>{' '}
              <NumberWithLabel
                size={FONT_SIZES.es}
                value={null}
                label="12% APR + NFT"
              />
            </FlexBlock>
            <InlineText
              style={{ position: 'absolute', bottom: '1rem', width: '70%' }}
              size="sm"
              weight={600}
            >
              Star Hunter + Aldrin Skin + 4 components + 1 exotic component{' '}
            </InlineText>
            <img src={Leviathan} alt="aldrin skin" width="100%" height="auto" />
          </BlockWithRadio>
        </StretchedBlock>
        <StretchedBlock width="hf">
          <StakingBlock style={{ width: '100%' }}>
            <RowContainer padding="2rem" direction="column">
              {' '}
              <ContentBlock style={{ alignItems: 'center' }}>
                <InlineText size="sm">
                  You have to stake at least 1000 PLD to be eligible for Aldrin
                  Skin NFT drop.
                </InlineText>
              </ContentBlock>
              <StakingInputWithAttributes />
              <StretchedBlock width="xl">
                {' '}
                <ContentBlock style={{ background: '#121E10' }} width="48%">
                  <StretchedBlock width="xl">
                    <InlineText color="primaryGray" size="sm">
                      APY
                    </InlineText>{' '}
                  </StretchedBlock>
                  <InlineText color="newGreen" size="lg" weight={700}>
                    7 %
                  </InlineText>
                </ContentBlock>{' '}
                <ContentBlock style={{ background: '#121E10' }} width="48%">
                  <StretchedBlock width="xl">
                    <InlineText color="primaryGray" size="sm">
                      APY
                    </InlineText>{' '}
                  </StretchedBlock>
                  <InlineText color="newGreen" size="lg" weight={700}>
                    5 %
                  </InlineText>
                </ContentBlock>
              </StretchedBlock>
              <Button>Stake</Button>
            </RowContainer>
          </StakingBlock>
        </StretchedBlock>
      </FlexBlock>
    </Page>
  )
}

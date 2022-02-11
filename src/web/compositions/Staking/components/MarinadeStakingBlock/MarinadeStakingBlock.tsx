import React from 'react'

import { BlockTitle, BlockContent } from '@sb/components/Block'
import { InlineText } from '@sb/components/Typography'
import { Row, RowContainer } from '@sb/compositions/AnalyticsRoute/index.styles'

import {
  ContentBlock,
  StakingBlock,
  StretchedContent,
  Line,
  GrayLink,
} from '../../styles'
import { NumberWithLabel } from '../NumberWithLabel/NumberWithLabel'
import Marinade from './marinadeLogo.svg'
import { AbsoluteImg, LogoWrap } from './styles'

export const MarinadeStakingBlock: React.FC = (props) => {
  return (
    <StakingBlock>
      <LogoWrap>
        <AbsoluteImg src={Marinade} alt="Marinade" />
      </LogoWrap>
      <BlockContent>
        <RowContainer justify="space-between">
          <BlockTitle>Stake mSOL</BlockTitle>
          <NumberWithLabel value={45} label="APY" />
        </RowContainer>
        <ContentBlock>
          <RowContainer margin="0 0 2rem 0" justify="space-between">
            <InlineText color="primaryGray" size="sm">
              Total Staked
            </InlineText>
            <InlineText size="rg" weight={700}>
              10.25m{' '}
              <InlineText color="primaryGray" weight={600}>
                SOl{' '}
              </InlineText>
            </InlineText>
          </RowContainer>
          <RowContainer justify="space-between">
            <InlineText size="sm" color="primaryGray">
              to 467 Validators{' '}
            </InlineText>{' '}
            <InlineText size="sm" weight={700}>
              <InlineText color="primaryGray">$</InlineText> 10.25m
            </InlineText>
          </RowContainer>
        </ContentBlock>
        <Line />{' '}
        <StretchedContent>
          <ContentBlock width="48%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                mSOL Price
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700}>
              1.91 <InlineText color="primaryGray">SOL</InlineText>
            </InlineText>
          </ContentBlock>
          <ContentBlock width="48%">
            <Row justify="flex-start" margin="0 0 2rem 0">
              <InlineText color="primaryGray" size="sm">
                Marketcap
              </InlineText>{' '}
            </Row>
            <InlineText size="rg" weight={700}>
              <InlineText color="primaryGray" weight={700}>
                $
              </InlineText>{' '}
              10.25m
            </InlineText>
          </ContentBlock>
        </StretchedContent>
        <RowContainer>
          <GrayLink to="/staking/marinade">View</GrayLink>
        </RowContainer>
      </BlockContent>
    </StakingBlock>
  )
}
